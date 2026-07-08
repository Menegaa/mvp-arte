// Condensa requisitos/benefícios via OpenAI (gpt-5-nano) antes de gerar a arte:
// combina itens do mesmo tema, encurta a redação e permite fonte maior no card.
// Sem OPENAI_API_KEY ou em qualquer erro, devolve as listas originais.

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-5-nano'

const INSTRUCOES = `Você prepara textos para artes de divulgação de vagas no Instagram (cartão 540x675 com duas colunas: Requisitos e Benefícios).

Reescreva as duas listas para ficarem mais enxutas e legíveis em fonte grande. A PRIORIDADE é reduzir o número de linhas combinando itens do mesmo tema — no máximo 6 itens por lista, menos se possível:
- Combine itens do mesmo tema em um só. Plano de saúde e plano odontológico DEVEM virar um único item ("Plano de saúde e odontológico"), mesmo com fornecedores diferentes. "Vale alimentação R$ 450" + "Vale refeição R$ 500" → "Vale alimentação R$ 450 e refeição R$ 500".
- Itens do tipo "Outros (a, b, c, ...)": incorpore o conteúdo agrupando por tema em poucos itens curtos — nunca um item por elemento.
- Encurte a redação SEM perder informação: prefira sempre a forma mais curta que preserve o significado.
- NÃO altere o nível de exigência nem adicione qualificadores. Ex.: "capacidade de se comunicar em inglês" NÃO vira "inglês fluente" — vira "Comunicação em inglês".
- Copie nomes próprios e de fornecedores EXATAMENTE como estão escritos (ex.: Allya, Gympass, Odontoprev). Fornecedor conhecido pode virar o próprio item ("Auxílio academia (Gympass)" → "Gympass"); detalhe irrelevante entre parênteses pode sair.
- Mantenha valores (R$) e números.
- NUNCA descarte informação: cada requisito e cada benefício das listas originais precisa aparecer em algum item do resultado (agrupado e encurtado, mas presente). Enxugar é combinar e reescrever, não cortar. Se precisar, ultrapasse o limite de itens em vez de omitir algo. Antes de responder, confira item por item da lista original se está coberto.
- Não invente nada que não esteja nas listas.
- Cada item idealmente com até 45 caracteres, sem ponto final.

Responda APENAS com JSON válido: {"requisitos": ["..."], "beneficios": ["..."]}`

const INSTRUCOES_FOTO = `Você escolhe fotos de banco de imagens (Pexels) para artes de divulgação de vagas.

Para cada cargo recebido, escreva uma query de busca em INGLÊS (4 a 7 palavras) descrevendo UMA pessoa profissional daquela área, de preferência olhando para a câmera, no ambiente de trabalho típico do cargo.

- Use o contexto da vaga para resolver nomes ambíguos: "Engenheiro de Desenvolvimento de Mercado" numa empresa de agroquímicos é um perfil de agro/comercial → "agronomist portrait crop field looking at camera" — NADA de software/computadores.
- "perfilCandidato" (quando presente) é o sinal mais importante: descreve de onde vem o profissional (ex.: "Agronegócio, vendas" → cena de campo/comercial, não laboratório). "segmento" é o setor da empresa; "empresa" ajuda a desambiguar.
- Sempre inclua "portrait".
- Evite palavras de grupo (team, meeting, people, group).
- Cenário coerente com a área: campo/lavoura para agro, farmácia para farma, loja para varejo, escritório para corporativo etc.

Responda APENAS com JSON válido: {"queries": {"<cargo exatamente como recebido>": "<query>"}}`

// Gera a query de foto por cargo considerando o contexto da vaga.
// Em erro ou sem chave, devolve {} e o chamador cai no dicionário regex local.
export async function gerarQueriesFoto(cargos, contexto = {}) {
  if (!process.env.OPENAI_API_KEY || !Array.isArray(cargos) || cargos.length === 0) return {}
  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        reasoning_effort: 'low',
        max_completion_tokens: 6000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: INSTRUCOES_FOTO },
          { role: 'user', content: JSON.stringify({ contexto, cargos }) }
        ]
      })
    })
    if (!res.ok) {
      console.error('[openai/foto] status', res.status, await res.text().catch(() => ''))
      return {}
    }
    const data = await res.json()
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? '{}')
    return (out.queries && typeof out.queries === 'object') ? out.queries : {}
  } catch (err) {
    console.error('[openai/foto]', err.message)
    return {}
  }
}

function listaValida(arr) {
  return Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(i => typeof i === 'string' && i.trim().length > 0)
}

export async function condensarListas(requisitos, beneficios) {
  const original = { requisitos, beneficios }
  if (!process.env.OPENAI_API_KEY) return original
  if (requisitos.length === 0 && beneficios.length === 0) return original

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        reasoning_effort: 'medium',
        max_completion_tokens: 25000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: INSTRUCOES },
          { role: 'user', content: JSON.stringify({ requisitos, beneficios }) }
        ]
      })
    })
    if (!res.ok) {
      console.error('[openai] status', res.status, await res.text().catch(() => ''))
      return original
    }
    const data = await res.json()
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? '{}')
    return {
      requisitos: listaValida(out.requisitos) ? out.requisitos.map(s => s.trim()) : requisitos,
      beneficios: listaValida(out.beneficios) ? out.beneficios.map(s => s.trim()) : beneficios
    }
  } catch (err) {
    console.error('[openai]', err.message)
    return original
  }
}
