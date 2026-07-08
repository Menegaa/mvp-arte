import express from 'express'
import { closeBrowser } from './src/arte.js'
import { verifySignature } from './src/clickup.js'
import { processTask, shouldProcess } from './src/pipeline.js'

const app = express()

for (const envVar of ['CLICKUP_API_TOKEN', 'CLICKUP_WEBHOOK_SECRET']) {
  if (!process.env[envVar]) console.warn(`⚠️  ${envVar} não definido — configure antes de usar em produção`)
}

// ── Webhook do ClickUp (criação de card) ─────────────────────
// express.raw: o HMAC da assinatura precisa dos bytes exatos do body
app.post('/webhooks/clickup', express.raw({ type: 'application/json' }), (req, res) => {
  if (process.env.CLICKUP_WEBHOOK_SECRET) {
    if (!verifySignature(req.body, req.headers['x-signature'])) {
      return res.status(401).json({ error: 'assinatura inválida' })
    }
  } else {
    console.warn('[webhook] CLICKUP_WEBHOOK_SECRET não definido — pulando verificação de assinatura')
  }

  let payload
  try {
    payload = JSON.parse(req.body)
  } catch {
    return res.status(400).json({ error: 'body inválido' })
  }

  if (payload.event !== 'taskCreated') {
    return res.json({ status: 'ignored', event: payload.event })
  }

  const taskId = payload.task_id
  if (!taskId) return res.status(400).json({ error: 'task_id ausente' })

  if (!shouldProcess(taskId)) {
    return res.json({ status: 'duplicate' })
  }

  // responde já — ClickUp desabilita webhooks lentos/com falha
  res.json({ status: 'accepted' })
  processTask(taskId).catch(err => console.error('[webhook]', err))
})

// ── Trigger manual (testes) ──────────────────────────────────
app.post('/generate', express.json(), (req, res) => {
  const { task_id } = req.body ?? {}
  if (!task_id) {
    console.warn('[generate] task_id ausente (pode ser um teste de ping do ClickUp)')
    return res.json({ status: 'ignored', message: 'task_id é obrigatório para processamento' })
  }

  res.json({ status: 'accepted' })
  processTask(task_id).catch(err => console.error('[generate]', err))
})

app.get('/health', (req, res) => res.json({ ok: true }))

app.get('/debug-env', (req, res) => {
  res.json({
    hasToken: !!process.env.CLICKUP_API_TOKEN,
    tokenLength: process.env.CLICKUP_API_TOKEN ? process.env.CLICKUP_API_TOKEN.length : 0,
    envKeys: Object.keys(process.env)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server → http://localhost:${PORT}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await closeBrowser()
    process.exit(0)
  })
}
