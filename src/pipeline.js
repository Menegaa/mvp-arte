import { extractVagaData, generateArte, fetchPexelsPhoto } from './arte.js'
import { getTask, attachFile, postComment, extractVagaId, extractVariacoes } from './clickup.js'
import { condensarListas, gerarQueriesFoto } from './openai.js'

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ||
  'https://foursales-company.app.n8n.cloud/webhook/buscar-vaga-sistema-arte'

// ── Dedup em memória (retries do ClickUp) ────────────────────

const recent = new Map()
const DEDUP_TTL_MS = 10 * 60 * 1000

export function shouldProcess(taskId) {
  const now = Date.now()
  for (const [id, ts] of recent) {
    if (now - ts > DEDUP_TTL_MS) recent.delete(id)
  }
  if (recent.has(taskId)) return false
  recent.set(taskId, now)
  return true
}

// ── Pipeline principal ───────────────────────────────────────

async function fetchVaga(idVaga, variacoes) {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_vaga: idVaga, variacoes })
  })
  if (!res.ok) return null
  const raw = await res.json()
  if (raw == null || (Array.isArray(raw) && raw.length === 0)) return null
  return raw
}

export async function processTask(taskId) {
  console.log(`[pipeline] iniciando task ${taskId}`)
  try {
    const task = await getTask(taskId)

    const idVaga = extractVagaId(task.name)
    if (!idVaga) {
      await postComment(taskId, `⚠️ Não encontrei o ID da vaga no nome do card ("${task.name}"). Inclua o número da vaga no título.`)
      return
    }

    const variacoes = extractVariacoes(task)
    if (variacoes.length === 0) {
      await postComment(taskId, `⚠️ Campo "${process.env.CLICKUP_FIELD_VARIACOES || 'Variações'}" vazio ou ausente no card. Preencha uma variação de cargo por linha.`)
      return
    }

    const raw = await fetchVaga(idVaga, variacoes)
    if (!raw) {
      await postComment(taskId, `⚠️ Vaga ${idVaga} não encontrada no sistema.`)
      return
    }
    const vagaData = extractVagaData(raw)

    // em paralelo: enxuga requisitos/benefícios (fonte maior na arte) e gera a
    // query de foto por cargo com contexto (evita ex.: "Desenvolvimento de
    // Mercado" no agro virar foto de desenvolvedor de software)
    // campo do card com o perfil de origem do candidato — melhor sinal p/ tema da foto
    const perfilCandidato = (task.custom_fields ?? [])
      .find(f => /segmento de origem/i.test(f.name ?? ''))?.value ?? ''

    const [listas, fotoQueries] = await Promise.all([
      condensarListas(vagaData.requisitos, vagaData.beneficios),
      gerarQueriesFoto(variacoes, {
        empresa: vagaData.empresa,
        segmento: vagaData.segmento,
        perfilCandidato: typeof perfilCandidato === 'string' ? perfilCandidato.trim() : ''
      })
    ])
    vagaData.requisitos = listas.requisitos
    vagaData.beneficios = listas.beneficios

    // fotos escolhidas sequencialmente com dedup: cada variação ganha uma foto diferente
    const usedFotos = new Set()
    const fotos = []
    for (const cargo of variacoes) {
      fotos.push(await fetchPexelsPhoto(cargo, usedFotos, fotoQueries[cargo]))
    }

    // renderiza em lotes de 3: estável no Chromium e leve na memória do container
    const results = []
    for (let i = 0; i < variacoes.length; i += 3) {
      results.push(...await Promise.allSettled(
        variacoes.slice(i, i + 3).map((cargo, j) => generateArte(vagaData, cargo, idVaga, fotos[i + j]))
      ))
    }

    const failed = []
    let uploaded = 0
    for (let i = 0; i < results.length; i++) {
      const r = results[i]
      if (r.status === 'rejected') {
        console.error(`[pipeline] render falhou (${variacoes[i]}):`, r.reason)
        failed.push(variacoes[i])
        continue
      }
      try {
        await attachFile(taskId, r.value.filename, r.value.buffer)
        uploaded++
      } catch (err) {
        console.error(`[pipeline] upload falhou (${r.value.filename}):`, err.message)
        failed.push(variacoes[i])
      }
    }

    const comment = failed.length === 0
      ? `✅ ${uploaded} arte(s) gerada(s) e anexada(s) — vaga ${idVaga}.`
      : `⚠️ ${uploaded} arte(s) anexada(s); ${failed.length} falharam: ${failed.join(', ')}.`
    await postComment(taskId, comment)
    console.log(`[pipeline] task ${taskId} concluída: ${uploaded} ok, ${failed.length} falhas`)
  } catch (err) {
    console.error(`[pipeline] erro na task ${taskId}:`, err)
    try {
      await postComment(taskId, `❌ Erro ao gerar artes: ${err.message}`)
    } catch (commentErr) {
      console.error('[pipeline] falha ao postar comentário de erro:', commentErr.message)
    }
  }
}
