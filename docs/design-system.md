# Design system — cores por unidade

Paleta oficial das recruiting companies. É a fonte da verdade para cores de template.

| Unidade | Cor 1 | Cor 2 | Cor 3 |
|---|---|---|---|
| **Salesjobs** | `#0ABB84` (verde) | `#1599B8` (azul-petróleo) | `#102B69` (azul-marinho) |
| **Easyhire** | `#0CCD7F` (verde) | `#2C4251` (cinza-azulado) | `#011E42` (azul-marinho escuro) |
| **Foursales** | `#CA0F2D` (vermelho) | `#011E41` (azul-marinho escuro) | `#BF9F59` (dourado) |

Além do branco padrão `#FFFFFF` em todas.

## O ponto

Templates devem **beber dessas cores de acordo com a unidade da vaga** (`recruitingCompany.name`, que chega via n8n e vira `vagaData.recruiting`):

- O template **Moderno** (`src/templates/moderno.js`) é o primeiro caso: em vez de cores fixas, ele deve trocar acento/fundo/CTA conforme a unidade — verde sobre marinho para Easyhire, vermelho + dourado para Foursales, verde + petróleo para Salesjobs.
- **Todo template novo criado no futuro segue a mesma regra**: nada de paleta própria hardcoded por unidade; a identidade visual vem desta tabela.

## Estado atual (para quem for alinhar)

Os templates vindos do Figma usam tons ligeiramente diferentes da paleta oficial:

- EasyHire: verde `#10DF8B` e fundo `#051530` (oficial: `#0CCD7F` / `#011E42`)
- Foursales: vermelho `#CE0E2D` (oficial: `#CA0F2D`)

Em caso de alinhamento, substituir pelos valores oficiais acima.
