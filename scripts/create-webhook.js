import { argv } from 'process'

const API_BASE = 'https://api.clickup.com/api/v2'

async function main() {
  const token = process.env.CLICKUP_API_TOKEN
  if (!token) {
    console.error('❌ CLICKUP_API_TOKEN não está definido no seu arquivo .env')
    process.exit(1)
  }

  const webhookUrl = argv[2]
  if (!webhookUrl) {
    console.error('❌ Uso: node --env-file=.env scripts/create-webhook.js <URL_DO_WEBHOOK_RAILWAY>')
    console.error('Exemplo: node --env-file=.env scripts/create-webhook.js https://mvp-arte.up.railway.app/webhooks/clickup')
    process.exit(1)
  }

  const headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
  }

  console.log('🔄 Buscando seus Teams (workspaces) no ClickUp...')
  const teamRes = await fetch(`${API_BASE}/team`, { headers })
  if (!teamRes.ok) {
    console.error(`❌ Erro ao buscar Teams: ${teamRes.status} ${await teamRes.text()}`)
    process.exit(1)
  }

  const { teams } = await teamRes.json()
  if (!teams || teams.length === 0) {
    console.error('❌ Nenhum Team (workspace) encontrado no seu ClickUp.')
    process.exit(1)
  }

  // Registra no primeiro Team encontrado
  const team = teams[0]
  console.log(`✅ Usando Team: "${team.name}" (ID: ${team.id})`)

  console.log(`🔄 Registrando webhook para: ${webhookUrl}...`)
  const body = {
    endpoint: webhookUrl,
    events: ['taskCreated']
  }

  const webhookRes = await fetch(`${API_BASE}/team/${team.id}/webhook`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  const resText = await webhookRes.text()
  if (!webhookRes.ok) {
    console.error(`❌ Erro ao registrar webhook: ${webhookRes.status} ${resText}`)
    process.exit(1)
  }

  const webhook = JSON.parse(resText)
  console.log('\n🎉 Webhook registrado com sucesso!')
  console.log('---------------------------------------------------------')
  console.log(`ID do Webhook: ${webhook.id}`)
  console.log(`Secret do Webhook: ${webhook.secret}`)
  console.log('---------------------------------------------------------')
  console.log('⚠️ IMPORTANTE: Copie o "Secret do Webhook" acima e adicione-o')
  console.log('na variável de ambiente CLICKUP_WEBHOOK_SECRET no Railway!')
  console.log('---------------------------------------------------------')
}

main().catch(err => {
  console.error('❌ Erro inesperado:', err)
})
