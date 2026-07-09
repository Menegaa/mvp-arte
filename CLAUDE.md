# mvp-arte

Serviço headless (Express + Playwright) que gera artes de vaga para Instagram a partir de cards do ClickUp:

**Fluxo:** ClickUp dispara `taskCreated` → n8n (logs/re-execução) chama `POST /generate` com o `task_id` → extrai o id da vaga (primeiros dígitos do nome do card) e as variações de cargo (campo customizado "📣 Nomenclaturas", uma por linha) → busca dados da vaga no webhook n8n → condensa requisitos/benefícios via OpenAI → escolhe foto no Pexels por cargo → renderiza PNG 540×675 por variação → anexa os PNGs + comenta status no mesmo card.

## Comandos

```bash
npm run dev                  # node --watch server.js
npm start                    # produção
npm run build                # npx playwright install chromium
node --env-file=.env <x.mjs> # scripts locais com os secrets do .env
openssl rand -hex 24 
```

Não há testes automatizados. Validação é visual: renderizar previews com fixtures e conferir o PNG.

## Arquitetura

- `server.js` — rotas: `POST /webhooks/clickup` (HMAC via `X-Signature`, responde 200 imediato, processa async), `POST /generate` (entrada do n8n e trigger manual `{task_id}`; exige `Authorization: Bearer $GENERATE_TOKEN` quando o env está setado), `GET /health`.
- `src/pipeline.js` — orquestração `processTask(taskId)`: getTask → n8n → condensar listas → fotos (Set de dedup por card) → renders em lotes de 3 → uploads sequenciais → comentário final ✅/⚠️/❌. Dedup de retries em memória (TTL 10 min).
- `src/arte.js` — lógica pura: `extractVagaData` (aceita formato cru da API ou simplificado), `generatePostHTML` (substitui placeholders), busca de foto no Pexels (uma pessoa só, olhando pra câmera, relacionada ao cargo, centralizada), singleton do Chromium, screenshot.
- `src/openai.js` — `condensarListas`: gpt-5-nano (`reasoning_effort: medium`) combina itens do mesmo tema e encurta sem perder informação (ex.: saúde + odontológico numa linha só). Sem `OPENAI_API_KEY` ou em erro, devolve as listas originais.
- `src/clickup.js` — cliente API v2. Token pessoal vai puro no header `Authorization` (sem `Bearer`). Upload com `FormData`/`Blob` nativos.
- `src/templates/` — um arquivo por template + `index.js` com `pickTemplate(recruiting)`: nome contém "easy" → EasyHire, "four" → Foursales, senão Salesjobs. `moderno.js` e `destaque.js` existem mas ainda não estão mapeados. `cores.js` tem a paleta por unidade.

## Templates

- String HTML completa exportada por arquivo; placeholders: `{{EMPRESA}}`, `{{CARGO}}`, `{{SUBTITULO}}`, `{{LOCALIDADE}}`, `{{SEGMENTO}}`, `{{FOTO_URL}}`, `{{REQUISITOS_HTML}}`, `{{BENEFICIOS_HTML}}`, `{{UNIDADE}}` (nome da recruiting company) e `{{COR_ACENTO}}`/`{{COR_SECUNDARIA}}`/`{{COR_FUNDO}}` (paleta da unidade, `src/templates/cores.js`).
- Todo template tem um script inline de auto-ajuste que roda em `document.fonts.ready`: encolhe cargo/linhas para caber, cresce a fonte dos itens até 1.3× quando sobra espaço, encolhe até 0.55× quando falta, e só corta itens do fim como última defesa. Em layouts 60/40, a lista mais longa ganha a coluna larga.
- Cores por unidade: ver `docs/design-system.md` — paleta oficial é a fonte da verdade; templates novos devem se tematizar pela unidade da vaga, nunca ter paleta própria hardcoded.
- Fonte: Hanken Grotesk (Google Fonts) substitui a Effra do design original (comercial).
- Render: viewport 540×675, Playwright chromium com `--no-sandbox`; EasyHire e Salesjobs em 0.45× da arte do Figma (1200×1500).

## Integrações e contratos

- **n8n**: `POST` `N8N_WEBHOOK_URL` com `{id_vaga, variacoes}`. Resposta: `company.name`, `locations[].city{name, state.acronym}`, `flightPlan.disclosure.mandatoryRequirements[]/segments[]`, `benefits[]`, `recruitingCompany.name` (decide o template).
- **ClickUp → n8n → cá**: o trigger `taskCreated` fica no n8n (visibilidade e re-execução pelo time); um nó HTTP Request chama `POST /generate` com `{task_id}` e `Authorization: Bearer $GENERATE_TOKEN`. A rota `POST /webhooks/clickup` (HMAC) continua disponível caso o ClickUp volte a chamar direto.
- **Pexels**: busca landscape, ranqueia pelo `alt` (pessoa só > neutro > grupo) e prioriza originais verticais (pessoa centralizada no crop).

## Env (ver .env.example)

`CLICKUP_API_TOKEN` obrigatório; `GENERATE_TOKEN` obrigatório em produção (sem ele o `/generate` fica aberto); `CLICKUP_WEBHOOK_SECRET` só se o ClickUp chamar direto; `OPENAI_API_KEY`, `PEXELS_KEY`, `N8N_WEBHOOK_URL`, `CLICKUP_FIELD_VARIACOES`, `PORT` opcionais (têm fallback). O `.env` local tem chaves reais — nunca expor nem commitar.

## Regras de trabalho

- **Nunca rodar `processTask` em card real sem confirmação explícita do usuário** — anexa arquivos e comenta em cards que o time vê. Testar antes com fixtures (JSON de vaga salvo) e previews PNG locais.
- Não commitar sem aprovação explícita.
- Deploy: Railway via Nixpacks (`nixpacks.toml`); build instala o Chromium.
