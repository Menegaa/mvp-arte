import express from 'express'
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Em produção (Render) o Chromium é instalado dentro do projeto, pois o
// ~/.cache não persiste do build para o runtime. Aponta o Playwright para lá.
const localBrowsers = join(__dirname, '.playwright-browsers')
if (existsSync(localBrowsers)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowsers
}

const app = express()
app.use(express.json({ limit: '10mb' }))

const PEXELS_KEY = 'lCBu8OSxzeukfVRX4uSorhj8ISEt7wR1IYY0cVFfJPIhIDqwAzagvwEx'

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
        '--single-process',
        '--no-zygote',
      ]
    })
  }
  return browser
}

process.on('SIGINT', async () => {
  if (browser) await browser.close()
  process.exit(0)
})

// ── Proxy webhook (resolve CORS) ─────────────────────────────
app.post('/api/buscar-vaga', async (req, res) => {
  try {
    const upstream = await fetch(
      'https://foursales-company.app.n8n.cloud/webhook/buscar-vaga-sistema-arte',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    )

    if (!upstream.ok) {
      const text = await upstream.text()
      return res.status(upstream.status).json({ error: text || `HTTP ${upstream.status}` })
    }

    const data = await upstream.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Pexels — busca foto por cargo ───────────────────────────
app.get('/api/foto', async (req, res) => {
  const query = req.query.query || 'professional business'
  try {
    const params = new URLSearchParams({ query, per_page: 1, orientation: 'portrait' })
    const upstream = await fetch(
      `https://api.pexels.com/v1/search?${params}`,
      { headers: { Authorization: PEXELS_KEY } }
    )
    const data = await upstream.json()
    const photo = data.photos?.[0]
    res.json({ url: photo?.src?.portrait ?? '' })
  } catch (err) {
    console.error('[pexels]', err.message)
    res.json({ url: '' })
  }
})

// ── Screenshot via Playwright ────────────────────────────────
app.post('/api/screenshot', async (req, res) => {
  const { html } = req.body
  if (!html) return res.status(400).json({ error: 'html é obrigatório' })

  let page = null
  try {
    const b = await getBrowser()
    page = await b.newPage()
    await page.setViewportSize({ width: 540, height: 675 })
    await page.setContent(html, { waitUntil: 'load' })
    // aguarda fontes renderizarem
    await page.evaluate(() => document.fonts.ready)

    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 540, height: 675 }
    })

    res.type('image/png').send(screenshot)
  } catch (err) {
    console.error('[screenshot]', err.message)
    res.status(500).json({ error: err.message })
  } finally {
    if (page) await page.close()
  }
})

// ── Serve frontend buildado (produção) ──────────────────────
const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server → http://localhost:${PORT}`)
})
