import crypto from 'crypto'

const API_BASE = 'https://api.clickup.com/api/v2'

function authHeader() {
  // Token pessoal do ClickUp vai puro no header, sem prefixo "Bearer"
  return { Authorization: process.env.CLICKUP_API_TOKEN ?? '' }
}

// ── Assinatura do webhook ────────────────────────────────────

export function verifySignature(rawBody, signatureHeader) {
  const secret = process.env.CLICKUP_WEBHOOK_SECRET
  if (!secret || !signatureHeader) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signatureHeader)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// ── API ──────────────────────────────────────────────────────

export async function getTask(taskId) {
  const res = await fetch(`${API_BASE}/task/${taskId}`, { headers: authHeader() })
  if (!res.ok) throw new Error(`ClickUp getTask ${taskId}: HTTP ${res.status} — ${await res.text()}`)
  return res.json()
}

export async function attachFile(taskId, filename, buffer) {
  const form = new FormData()
  form.append('attachment', new Blob([buffer], { type: 'image/png' }), filename)
  const res = await fetch(`${API_BASE}/task/${taskId}/attachment`, {
    method: 'POST',
    headers: authHeader(),
    body: form
  })
  if (!res.ok) throw new Error(`ClickUp attachFile ${filename}: HTTP ${res.status} — ${await res.text()}`)
  return res.json()
}

export async function postComment(taskId, text) {
  const res = await fetch(`${API_BASE}/task/${taskId}/comment`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment_text: text, notify_all: true })
  })
  if (!res.ok) throw new Error(`ClickUp postComment: HTTP ${res.status} — ${await res.text()}`)
  return res.json()
}

// ── Extração de dados do card ────────────────────────────────

export function extractVagaId(taskName) {
  return taskName?.match(/\d+/)?.[0] ?? null
}

export function extractVariacoes(task) {
  // match por inclusão: tolera emoji/prefixos no nome do campo (ex: "📣 Nomenclaturas")
  const fieldName = (process.env.CLICKUP_FIELD_VARIACOES || 'Nomenclaturas').trim().toLowerCase()
  const field = (task.custom_fields ?? []).find(
    f => (f.name ?? '').trim().toLowerCase().includes(fieldName)
  )
  if (!field || typeof field.value !== 'string') return []

  let parts = field.value.split(/\r?\n/).map(p => p.trim()).filter(Boolean)
  if (parts.length === 1 && parts[0].includes(',')) parts = parts[0].split(',')
  return parts
    .map(p => p.trim().replace(/[.,;]+$/, ''))
    .filter(Boolean)
}
