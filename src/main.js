import './style.css'
import { TEMPLATE_HTML } from './template.js'

// ── Utilities ────────────────────────────────────────────────

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Data extraction ──────────────────────────────────────────

function extractVagaData(raw) {
  const data = Array.isArray(raw) ? raw[0] : raw

  // Simplified format (if n8n transforms the response)
  if (data && typeof data.empresa === 'string') {
    return {
      empresa:    data.empresa    ?? '',
      localidade: data.localidade ?? '',
      foto_url:   data.foto_url   ?? '',
      requisitos: Array.isArray(data.requisitos) ? data.requisitos : [],
      beneficios: Array.isArray(data.beneficios) ? data.beneficios : []
    }
  }

  // Raw API format
  const empresa = (data.company?.name ?? '').trim()

  const localidade = (data.locations ?? [])
    .map(loc => {
      const city  = loc.city?.name ?? ''
      const state = loc.city?.state?.acronym ?? ''
      return state ? `${city}/${state}` : city
    })
    .filter(Boolean)
    .join(', ')

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

  return { empresa, localidade, foto_url, requisitos, beneficios }
}

// ── Template rendering ───────────────────────────────────────

function buildItemsHTML(items) {
  return items.map(t => `<span class="col-item">${t}</span>`).join('\n        ')
}

function generatePostHTML(vagaData, cargo) {
  return TEMPLATE_HTML
    .replace(/\{\{EMPRESA\}\}/g,         vagaData.empresa)
    .replace(/\{\{CARGO\}\}/g,           cargo)
    .replace(/\{\{LOCALIDADE\}\}/g,      vagaData.localidade)
    .replace(/\{\{FOTO_URL\}\}/g,        vagaData.foto_url)
    .replace(/\{\{REQUISITOS_HTML\}\}/g, buildItemsHTML(vagaData.requisitos))
    .replace(/\{\{BENEFICIOS_HTML\}\}/g, buildItemsHTML(vagaData.beneficios))
}

// ── DOM bootstrap ────────────────────────────────────────────

document.getElementById('app').innerHTML = `
  <header class="app-header">
    <div class="header-logo">
      <span class="s">sales</span><span class="j">jobs</span>
    </div>
    <div class="header-divider"></div>
    <div class="header-info">
      <h1>Gerador de Arte</h1>
      <p>Criação automática de posts de vaga</p>
    </div>
  </header>

  <main class="main">
    <div class="form-card">
      <div class="section-label">Dados da Vaga</div>
      <form id="form">
        <div class="form-row">
          <div class="field">
            <label>ID da Vaga <span class="req">*</span></label>
            <input id="idVaga" type="text" placeholder="Ex: 5217" autocomplete="off">
          </div>
          <div class="field">
            <label>Variações de nomenclatura <span class="req">*</span></label>
            <span class="hint">Uma por linha — cada linha gera uma imagem separada</span>
            <textarea id="variacoes" placeholder="Executivo de Vendas&#10;Gerente de Contas&#10;Key Account Manager"></textarea>
          </div>
        </div>

        <div class="form-footer">
          <button id="submitBtn" type="submit" class="btn btn-primary">
            <span class="spinner" id="spinner"></span>
            <span id="btnText">Buscar Vaga</span>
          </button>
          <div class="error-banner" id="errorBanner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <span id="errorText"></span>
          </div>
        </div>
      </form>
    </div>

    <div class="results-wrap" id="resultsWrap" style="display:none">
      <div class="results-header">
        <span class="label">Artes geradas</span>
        <span class="pill" id="resultCount"></span>
      </div>
      <div class="results-grid" id="resultsGrid"></div>
    </div>
  </main>
`

// ── State helpers ────────────────────────────────────────────

function setLoading(on) {
  const btn = document.getElementById('submitBtn')
  document.getElementById('spinner').style.display = on ? 'block' : 'none'
  document.getElementById('btnText').textContent = on ? 'Buscando vaga...' : 'Buscar Vaga'
  btn.disabled = on
}

function showError(msg) {
  const el = document.getElementById('errorBanner')
  document.getElementById('errorText').textContent = msg
  el.classList.add('visible')
}

function hideError() {
  document.getElementById('errorBanner').classList.remove('visible')
}

// ── Cards ────────────────────────────────────────────────────

function addSkeletonCard(index, cargo, empresa) {
  const grid = document.getElementById('resultsGrid')

  const card = document.createElement('div')
  card.className = 'art-card'
  card.id = `card-${index}`
  card.innerHTML = `
    <div class="art-preview skeleton"></div>
    <div class="art-card-body">
      <div class="art-card-info">
        <div class="cargo">${esc(cargo)}</div>
        <div class="meta">${esc(empresa)}</div>
      </div>
      <div class="spinner-small"></div>
    </div>
  `
  grid.appendChild(card)
}

function resolveCard(index, { cargo, empresa, localidade, blobUrl, filename }) {
  const card = document.getElementById(`card-${index}`)
  if (!card) return

  const preview = card.querySelector('.art-preview')
  preview.classList.remove('skeleton')
  preview.innerHTML = `<img src="${blobUrl}" alt="${esc(cargo)}">`

  card.querySelector('.art-card-body').innerHTML = `
    <div class="art-card-info">
      <div class="cargo" title="${esc(cargo)}">${esc(cargo)}</div>
      <div class="meta">${esc(empresa)}${localidade ? ' · ' + esc(localidade) : ''}</div>
    </div>
    <button class="btn btn-download" onclick="downloadBlob('${blobUrl}', '${filename}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Baixar PNG
    </button>
  `
}

function errorCard(index) {
  const card = document.getElementById(`card-${index}`)
  if (!card) return
  const preview = card.querySelector('.art-preview')
  preview.classList.remove('skeleton')
  preview.style.cssText = 'align-items:center;justify-content:center;color:#c0392b;font-size:0.8rem;font-weight:700;gap:6px;display:flex;flex-direction:column'
  preview.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Erro ao gerar`
  card.querySelector('.spinner-small')?.remove()
}

// ── Download helper (global, referenced from innerHTML) ──────
window.downloadBlob = function(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

// ── Main flow ────────────────────────────────────────────────

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  hideError()

  const idVaga    = document.getElementById('idVaga').value.trim()
  const variacoes = document.getElementById('variacoes').value
    .split('\n').map(v => v.trim()).filter(Boolean)

  if (!idVaga) { showError('Informe o ID da Vaga.'); return }
  if (!variacoes.length) { showError('Informe ao menos uma variação de nomenclatura.'); return }

  setLoading(true)
  const wrap = document.getElementById('resultsWrap')
  wrap.style.display = 'none'
  document.getElementById('resultsGrid').innerHTML = ''

  try {
    // 1. Buscar vaga
    const vagaRes = await fetch('/api/buscar-vaga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_vaga: idVaga, variacoes })
    })

    if (!vagaRes.ok) {
      const err = await vagaRes.json().catch(() => ({}))
      throw new Error(err.error || `Erro HTTP ${vagaRes.status}`)
    }

    const rawData = await vagaRes.json()
    if (!rawData || (Array.isArray(rawData) && !rawData.length)) {
      throw new Error('Vaga não encontrada. Verifique o ID.')
    }

    const vagaData = extractVagaData(rawData)

    // 2. Mostrar seção de resultados com skeletons
    document.getElementById('resultCount').textContent = variacoes.length
    wrap.style.display = 'block'
    variacoes.forEach((cargo, i) => addSkeletonCard(i, cargo, vagaData.empresa))
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' })

    setLoading(false)

    // 3. Gerar screenshots em paralelo (foto Pexels por variação)
    await Promise.all(variacoes.map(async (cargo, i) => {
      try {
        // 3a. Buscar foto no Pexels usando o nome do cargo
        const fotoRes = await fetch(`/api/foto?query=${encodeURIComponent(cargo)}`)
        const { url: fotoUrl } = await fotoRes.json()
        const vagaDataWithFoto = { ...vagaData, foto_url: fotoUrl }

        const postHTML = generatePostHTML(vagaDataWithFoto, cargo)
        const res = await fetch('/api/screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: postHTML })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const filename = `arte-${idVaga}-${toSlug(cargo)}.png`

        resolveCard(i, {
          cargo,
          empresa: vagaData.empresa,
          localidade: vagaData.localidade,
          blobUrl,
          filename
        })
      } catch {
        errorCard(i)
      }
    }))

  } catch (err) {
    showError(err.message || 'Erro inesperado. Tente novamente.')
    setLoading(false)
  }
})
