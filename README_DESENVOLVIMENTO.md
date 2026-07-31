# README_DESENVOLVIMENTO.md

# MERCATTO CMS
## Manual Oficial de Desenvolvimento

Versão: 1.0
Projeto: Mercatto CMS
Responsável: Gleison Luz

---

# Objetivo

Este documento define as regras oficiais de desenvolvimento do Mercatto CMS.

Toda IA (Claude, ChatGPT, Cursor, Copilot ou qualquer outro agente) deverá obedecer integralmente este documento antes de alterar qualquer arquivo do projeto.

Nenhuma alteração estrutural poderá ser feita ignorando estas regras.

---

# Filosofia do Projeto

Este projeto NÃO será desenvolvido em uma única etapa.

O desenvolvimento ocorre em Sprints.

Cada Sprint é dividida em pequenas entregas.

Nenhuma IA pode avançar para uma próxima etapa sem autorização explícita do usuário.

---

# Regra nº 1

Nunca desenvolver mais do que foi solicitado.

---

# Regra nº 2

Nunca alterar módulos já concluídos sem autorização.

---

# Regra nº 3

Antes de escrever código, explicar a estratégia adotada.

A resposta deverá conter:

- objetivo
- arquivos que serão alterados
- justificativa técnica
- riscos
- dependências

Somente depois iniciar a implementação.

---

# Regra nº 4

Sempre trabalhar em pequenas entregas.

Exemplo:

Sprint 3

3.1 Modelagem Prisma

(parar)

3.2 Repositories

(parar)

3.3 Services

(parar)

3.4 DTOs

(parar)

3.5 Validators

(parar)

3.6 Controllers

(parar)

3.7 Testes

(parar)

Nunca fazer tudo em uma resposta.

---

# Regra nº 5

Nunca criar funcionalidades fora da PRD.

Caso exista dúvida, perguntar.

Nunca assumir.

---

# Regra nº 6

Toda decisão arquitetural deverá ser justificada.

---

# Regra nº 7

Sempre preservar:

- Clean Architecture
- DDD
- SOLID
- DRY
- KISS

---

# Regra nº 8

Não remover código existente sem explicar.

---

# Regra nº 9

Sempre mostrar quais arquivos serão modificados.

Exemplo:

prisma/schema.prisma

src/modules/noticias/domain/

src/modules/noticias/repositories/

...

---

# Regra nº 10

Antes de qualquer alteração estrutural responder:

"Impacto: baixo"

ou

"Impacto: médio"

ou

"Impacto: alto"

---

# Git

Após cada Sprint concluída:

git status

git add .

git commit

git push

Tag quando solicitado.

---

# Organização

Cada módulo deverá seguir exatamente esta estrutura.

domain/

application/

infrastructure/

presentation/

repositories/

services/

dto/

validators/

---

# Padrão de Código

Utilizar TypeScript.

Evitar comentários desnecessários.

Priorizar código legível.

---

# Banco

Nunca remover tabelas existentes.

Nunca alterar migrations antigas.

Sempre criar novas migrations.

---

# Antes de finalizar uma Sprint

Executar:

- Type Check
- Build
- Lint

---

# Ao final de cada entrega

Responder sempre:

Arquivos alterados

Resumo técnico

Próxima etapa sugerida

Aguardar autorização.