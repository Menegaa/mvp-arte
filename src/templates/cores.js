// Paleta oficial por unidade (docs/design-system.md — fonte da verdade).
// Templates tematizáveis usam os placeholders {{COR_ACENTO}}, {{COR_SECUNDARIA}}
// e {{COR_FUNDO}}, preenchidos em generatePostHTML conforme a recruiting company.

const PALETAS = {
  salesjobs: { acento: '#0ABB84', secundaria: '#1599B8', fundo: '#102B69' },
  easyhire:  { acento: '#0CCD7F', secundaria: '#2C4251', fundo: '#011E42' },
  foursales: { acento: '#CA0F2D', secundaria: '#BF9F59', fundo: '#011E41' },
}

export function paletaDaUnidade(recruiting) {
  const r = String(recruiting ?? '').toLowerCase()
  if (r.includes('easy')) return PALETAS.easyhire
  if (r.includes('four')) return PALETAS.foursales
  return PALETAS.salesjobs
}
