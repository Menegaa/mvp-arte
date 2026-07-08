import { chromium } from 'playwright'
import { pickTemplate } from './templates/index.js'
import { paletaDaUnidade } from './templates/cores.js'

const PEXELS_KEY = process.env.PEXELS_KEY || 'lCBu8OSxzeukfVRX4uSorhj8ISEt7wR1IYY0cVFfJPIhIDqwAzagvwEx'

// ── Utilities ────────────────────────────────────────────────

export function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ── Data extraction ──────────────────────────────────────────

export function extractVagaData(raw) {
  const data = Array.isArray(raw) ? raw[0] : raw

  // Simplified format (if n8n transforms the response)
  if (data && typeof data.empresa === 'string') {
    return {
      empresa:    data.empresa    ?? '',
      localidade: data.localidade ?? '',
      segmento:   data.segmento   ?? '',
      recruiting: data.recruiting ?? '',
      foto_url:   data.foto_url   ?? '',
      requisitos: Array.isArray(data.requisitos) ? data.requisitos : [],
      beneficios: Array.isArray(data.beneficios) ? data.beneficios : []
    }
  }

  // Raw API format
  const empresa = (data.company?.name ?? '').trim()

  // locations podem vir só com state (sem city) — ex.: vaga estadual
  const localidade = (data.locations ?? [])
    .map(loc => {
      const city  = loc.city?.name ?? ''
      const state = loc.city?.state ?? loc.state ?? null
      if (city) return state?.acronym ? `${city} | ${state.acronym}` : city
      return state?.name ?? state?.acronym ?? ''
    })
    .filter(Boolean)
    .join(', ')

  const segmento = (data.flightPlan?.disclosure?.segments ?? [])
    .map(s => (typeof s === 'string' ? s : s?.name ?? ''))
    .filter(Boolean)
    .join(', ')

  const recruiting = (data.recruitingCompany?.name ?? '').trim()

  const foto_url = data.foto_url ?? ''

  const requisitos = [...(data.flightPlan?.disclosure?.mandatoryRequirements ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(r => r.text ?? '')
    .filter(Boolean)

  const beneficios = (data.benefits ?? []).map(b => {
    let label = b.benefit?.name ?? ''
    if (b.textValue)        label += ` (${b.textValue})`
    if (b.currencyValue != null) label += ` — R$ ${b.currencyValue}`
    return label
  }).filter(Boolean)

  return { empresa, localidade, segmento, recruiting, foto_url, requisitos, beneficios }
}

// ── Template rendering ───────────────────────────────────────

function buildItemsHTML(items) {
  return items.map(t => `<span class="col-item">${t}</span>`).join('\n        ')
}

export function generatePostHTML(vagaData, cargo) {
  // linha do design: "Cidade | Estado - Segmento do Candidato"
  const subtitulo = [vagaData.localidade, vagaData.segmento].filter(Boolean).join(' - ')

  const paleta = paletaDaUnidade(vagaData.recruiting)

  return pickTemplate(vagaData.recruiting)
    .replace(/\{\{UNIDADE\}\}/g,         vagaData.recruiting || 'Salesjobs')
    .replace(/\{\{COR_ACENTO\}\}/g,      paleta.acento)
    .replace(/\{\{COR_SECUNDARIA\}\}/g,  paleta.secundaria)
    .replace(/\{\{COR_FUNDO\}\}/g,       paleta.fundo)
    .replace(/\{\{EMPRESA\}\}/g,         vagaData.empresa)
    .replace(/\{\{CARGO\}\}/g,           cargo)
    .replace(/\{\{LOCALIDADE\}\}/g,      vagaData.localidade)
    .replace(/\{\{SEGMENTO\}\}/g,        vagaData.segmento)
    .replace(/\{\{SUBTITULO\}\}/g,       subtitulo)
    .replace(/\{\{FOTO_URL\}\}/g,        vagaData.foto_url)
    .replace(/\{\{REQUISITOS_HTML\}\}/g, buildItemsHTML(vagaData.requisitos))
    .replace(/\{\{BENEFICIOS_HTML\}\}/g, buildItemsHTML(vagaData.beneficios))
}

// ── Pexels — busca foto por cargo ───────────────────────────

const FALLBACK_QUERY = 'professional portrait looking at camera office'

// área do cargo (pt, sem acento) → query Pexels (en): uma pessoa só, olhando pra câmera
const FOTO_QUERIES = [
  [/farmac|propagand/,             'pharmacist portrait looking at camera pharmacy'],
  [/motorista|entregador/,         'delivery driver portrait smiling'],
  [/desenvolv|program|tecnolog|ti\b/, 'software developer portrait looking at camera office'],
  [/atend|recepc/,                 'customer service agent headset portrait smiling'],
  [/promotor|loja|varejo/,         'retail worker portrait smiling store'],
  [/represent/,                    'sales representative portrait suit looking at camera'],
  [/analist/,                      'business analyst portrait looking at camera office'],
  [/assistent|auxiliar/,           'office worker portrait smiling desk'],
  [/supervis|coorden|lider/,       'confident leader portrait looking at camera office'],
  [/gerent|gestor|gestao|diretor/, 'business manager portrait confident office'],
  [/vend|comercial|conta|account/, 'salesperson portrait smiling looking at camera office'],
]

// via alt da Pexels: prioriza foto de UMA pessoa; descarta cenas de grupo pro fim da fila
const SINGLE_RE = /\b(man|woman|person|portrait|male|female|guy|girl|lady)\b/i
const GROUP_RE  = /\b(men|women|people|team|group|colleagues|coworkers|crowd|couple|together|meeting)\b/i

function buildFotoQuery(cargo) {
  const c = String(cargo ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  for (const [re, query] of FOTO_QUERIES) {
    if (re.test(c)) return query
  }
  return FALLBACK_QUERY
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// `used` (Set de URLs) evita foto repetida entre variações do mesmo card.
// `query` (opcional) vem da IA com contexto da vaga; sem ela, cai no dicionário regex.
export async function fetchPexelsPhoto(cargo, used = new Set(), query = '') {
  const search = async q => {
    const params = new URLSearchParams({ query: q, per_page: 30, orientation: 'landscape' })
    const upstream = await fetch(
      `https://api.pexels.com/v1/search?${params}`,
      { headers: { Authorization: PEXELS_KEY } }
    )
    const data = await upstream.json()
    const photos = data.photos ?? []
    const solo  = photos.filter(p => SINGLE_RE.test(p.alt ?? '') && !GROUP_RE.test(p.alt ?? ''))
    const resto = shuffle(photos.filter(p => !SINGLE_RE.test(p.alt ?? '') && !GROUP_RE.test(p.alt ?? '')))
    const grupo = photos.filter(p => GROUP_RE.test(p.alt ?? ''))
    // original em retrato → pessoa quase sempre centralizada no crop landscape da Pexels
    const soloRetrato  = shuffle(solo.filter(p => (p.height ?? 0) > (p.width ?? 0)))
    const soloPaisagem = shuffle(solo.filter(p => (p.height ?? 0) <= (p.width ?? 0)))
    return [...soloRetrato, ...soloPaisagem, ...resto, ...grupo]
      .map(p => p.src?.landscape)
      .filter(Boolean)
  }

  try {
    // com query da IA, o regex fica de fora do fallback (pode errar o domínio)
    let candidatas = await search(query || buildFotoQuery(cargo))
    if (candidatas.length === 0) candidatas = await search(FALLBACK_QUERY)
    const foto = candidatas.find(u => !used.has(u)) ?? candidatas[0] ?? ''
    if (foto) used.add(foto)
    return foto
  } catch (err) {
    console.error('[pexels]', err.message)
    return ''
  }
}

// ── Browser singleton ────────────────────────────────────────

let browser = null

async function getBrowser() {
  if (!browser?.isConnected()) {
    browser = await chromium.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ]
    })
  }
  return browser
}

export async function closeBrowser() {
  if (browser) await browser.close()
}

// com --single-process o Chromium pode morrer ao fechar a última página;
// se newPage falhar, relança o browser uma vez
async function newPageSafe() {
  try {
    const b = await getBrowser()
    return await b.newPage()
  } catch {
    browser = null
    const b = await getBrowser()
    return await b.newPage()
  }
}

// ── Screenshot via Playwright ────────────────────────────────

export async function renderScreenshot(html) {
  let page = null
  try {
    page = await newPageSafe()
    await page.setViewportSize({ width: 540, height: 675 })
    await page.setContent(html, { waitUntil: 'load' })
    // aguarda fontes renderizarem
    await page.evaluate(() => document.fonts.ready)

    return await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 540, height: 675 }
    })
  } finally {
    if (page) await page.close()
  }
}

// ── Geração completa de uma arte ─────────────────────────────

export async function generateArte(vagaData, cargo, idVaga, fotoUrl) {
  const foto = fotoUrl ?? await fetchPexelsPhoto(cargo)
  const html = generatePostHTML({ ...vagaData, foto_url: foto || vagaData.foto_url }, cargo)
  const buffer = await renderScreenshot(html)
  return { cargo, filename: `arte-${idVaga}-${toSlug(cargo)}.png`, buffer }
}
