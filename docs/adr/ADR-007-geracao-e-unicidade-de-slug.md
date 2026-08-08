# ADR-007 — Geração e Unicidade de Slug

**Status:** Aprovado
**Data:** Agosto/2026
**Projeto:** Mercatto CMS

Segue o padrão definido em ADR-000 — Padrão para Architectural Decision Records.

---

## Contexto

Múltiplas entidades do sistema possuem `slug` (identificador amigável usado em
URLs): `Editoria` (Sprint 2) e `Noticia` (Sprint 3). Futuras entidades com
página pública (ex.: `Empresa`, `Jornalista`) provavelmente também terão.

Era preciso definir, de forma explícita e não apenas implícita no código: se o
`slug` é sempre gerado automaticamente a partir do nome/título, se o usuário
pode informá-lo manualmente, e como a unicidade é garantida em ambos os casos.

Até esta etapa, essa regra existia apenas implicitamente no código dos casos
de uso (`resolverSlugUnico` em `editoria.actions.ts`, e
`resolverSlugUnicoNoticia` em `application/use-cases/`), sem registro formal.

---

## Decisão

1. **Geração automática por padrão.** Se o campo `slug` não for informado (ou
   vier vazio), ele é gerado automaticamente a partir do campo textual
   principal da entidade (`nome` em Editoria, `titulo` em Notícia), usando a
   função pura `gerarSlug()` (normalização: minúsculas, sem acentos, espaços
   viram hífen, caracteres especiais removidos).

2. **Override manual permitido.** O usuário pode informar um `slug`
   manualmente. Quando informado, esse valor passa pelo mesmo processo de
   normalização (`gerarSlug()`) antes de ser persistido — o valor bruto do
   usuário nunca é salvo sem normalização.

3. **Unicidade é sempre validada, independentemente da origem do valor.** Não
   importa se o slug veio de geração automática ou de override manual: antes
   de persistir, o sistema verifica se o valor já existe. Em caso de colisão,
   um sufixo numérico incremental é adicionado (`-2`, `-3`, ...) até encontrar
   um valor livre. Na atualização (update) de um registro existente, o próprio
   registro é ignorado na checagem de unicidade (para permitir salvar sem
   alterar o slug).

4. **Responsabilidade da validação:** a resolução de slug único é
   responsabilidade da **camada de aplicação** (`application/use-cases` ou,
   no padrão anterior de Editoria, `application/*.actions.ts`), nunca da
   camada de apresentação (formulário/UI) nem da camada de infraestrutura
   (repository). O repository expõe apenas a consulta primitiva
   (`slugJaExiste`); a decisão de gerar, normalizar e resolver colisão de
   slug é lógica de negócio, não de acesso a dado.

---

## Justificativa

- Gerar automaticamente por padrão reduz fricção para quem cadastra conteúdo,
  sem exigir que o usuário pense em formatar uma URL manualmente.
- Permitir override manual é necessário para casos em que o slug automático
  não é ideal (ex.: título muito longo, ou necessidade de manter uma URL
  específica por motivos de SEO/histórico).
- Validar unicidade sempre — e não só quando o valor é gerado automaticamente
  — evita que um slug informado manualmente colida silenciosamente com um já
  existente, o que quebraria o roteamento público (duas entidades não podem
  responder pela mesma URL).
- Colocar essa responsabilidade na camada de aplicação (não no repository nem
  na UI) mantém a regra de negócio centralizada e reutilizável por qualquer
  consumidor futuro do Use Case (Service, Controller, Server Action), em vez
  de duplicá-la em cada ponto de entrada.

---

## Consequências

### Benefícios
- Regra consistente entre todas as entidades com slug no sistema.
- Nenhuma duplicação de lógica de normalização/unicidade nas camadas de UI.
- Comportamento previsível mesmo com múltiplos usuários cadastrando conteúdo
  simultaneamente com títulos parecidos.

### Limitações
- A resolução de colisão por sufixo numérico (`-2`, `-3`, ...) pode gerar
  slugs "feios" em cenários de alto volume de títulos idênticos. Aceitável
  para o volume esperado do Mercatto News (relevância acima de volume,
  conforme documento 15 do PRD).
- Cada checagem de unicidade é uma consulta ao banco por tentativa — em caso
  de muitas colisões sequenciais, várias consultas seriam feitas em série.
  Não é um problema no volume atual; pode ser revisto se necessário no
  futuro.

### Impactos futuros
- Qualquer nova entidade com `slug` (ex.: `Empresa`, quando esse módulo for
  iniciado) deve seguir esta mesma regra, reutilizando ou espelhando o
  padrão de `resolverSlugUnico*`.

---

## Alternativas Consideradas

**Slug sempre gerado automaticamente, sem override manual.**
Rejeitado. Reduziria flexibilidade sem ganho real, e a PRD não veda edição
manual de URL amigável.

**Slug sempre informado manualmente, sem geração automática.**
Rejeitado. Aumentaria a fricção operacional para a redação, indo contra o
princípio de produto "Simplicidade supera complexidade" (01.10, item 4).

**Validar unicidade apenas quando o slug é gerado automaticamente, confiando
no usuário quando ele informa manualmente.**
Rejeitado. Um slug manual duplicado quebraria o roteamento público da mesma
forma que um automático duplicado — não há motivo para tratar as origens de
forma diferente.

---

## Referências

- `src/modules/editorial/domain/value-objects/slug.ts` — função `gerarSlug()`
- `src/modules/editorial/application/use-cases/resolver-slug-unico-noticia.ts`
- `src/modules/editorial/application/editoria.actions.ts` — função
  `resolverSlugUnico()` (mesmo padrão, aplicado a Editoria no Sprint 2)
- ADR-000 — Padrão para Architectural Decision Records
