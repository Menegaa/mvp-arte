import { TEMPLATE_SALESJOBS } from './salesjobs.js'
import { TEMPLATE_EASYHIRE } from './easyhire.js'
import { TEMPLATE_FOURSALES } from './foursales.js'

// A unidade vem em recruitingCompany.name na resposta do sistema (via n8n).
// Fallback: Salesjobs (comportamento original).
export function pickTemplate(recruiting) {
  const r = String(recruiting ?? '').toLowerCase()
  if (r.includes('easy')) return TEMPLATE_EASYHIRE
  if (r.includes('four')) return TEMPLATE_FOURSALES
  return TEMPLATE_SALESJOBS
}
