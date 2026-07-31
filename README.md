# Mercatto CMS

Plataforma proprietária de gestão de conteúdo do **Mercatto News**, veículo de
inteligência empresarial e desenvolvimento regional do Sul do Brasil.

Este repositório contém a **fundação técnica (Sprint 1)** do projeto,
desenvolvida sobre arquitetura **Modular Monolith**, com **Domain-Driven
Design** e conceitos de **Clean Architecture**.

> Documentação de produto e arquitetura completa (PRDs, ADRs) está disponível
> separadamente e é a fonte oficial de requisitos deste projeto.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| ORM | Prisma |
| Banco de dados | MySQL |
| Autenticação | Auth.js (NextAuth v5) — Credentials Provider |
| Validação | Zod |
| Processamento de imagem | sharp |
| Testes | Vitest (unitário) + Playwright (E2E) |
| Hospedagem (MVP) | Hostinger (Node.js) |

---

## Decisões Técnicas Complementares (Sprint 1)

Estas decisões não geraram ADR formal, por definição do Product Owner (a
prioridade desta fase é entregar software funcional rapidamente), mas ficam
registradas aqui para preservar o conhecimento do projeto:

- **Autenticação:** Auth.js v5 com `Credentials Provider` (e-mail + senha) e
  sessão em **JWT** — estratégia obrigatória para Credentials no Auth.js. O
  `@auth/prisma-adapter` já está configurado para viabilizar, no futuro,
  provedores OAuth sem retrabalho estrutural.
- **Cache:** exclusivamente mecanismos nativos do Next.js (fetch cache,
  Route Segment Config, `revalidate`). Redis permanece previsto apenas para a
  Fase 8 do Plano de Evolução Técnica.
- **Storage de mídia (MVP):** disco local na Hostinger
  (`public/uploads`, configurável em `shared/config/app.config.ts`).
  Migração para Cloudflare R2 está prevista na Fase 8.
- **Processamento de imagem:** `sharp`, para compressão automática e
  conversão para WebP (requisito do módulo de Mídia).
- **Estilização:** Tailwind CSS, servindo de base para o Design System
  (`shared/components/ui`).
- **Testes:** Vitest para testes unitários dos casos de uso (`application/`
  de cada módulo); Playwright para testes E2E dos fluxos críticos
  (login, publicação de notícia). Browsers do Playwright não vêm
  pré-instalados — rodar `npx playwright install` no ambiente de
  desenvolvimento/CI.

---

## Estrutura do Projeto

```
src/
├── app/                # Next.js App Router (interface)
│   ├── (public)/        # Rotas públicas do portal
│   ├── (admin)/         # Painel administrativo (protegido por middleware)
│   ├── (auth)/          # Login e recuperação de senha
│   └── api/             # API Routes
│
├── modules/             # Núcleo do Modular Monolith (um domínio por pasta)
│   ├── editorial/        # domain / application / infrastructure / presentation
│   ├── empresas/         # ⭐ diferencial estratégico do produto
│   ├── usuarios/
│   ├── midia/
│   ├── publicidade/
│   ├── seo/
│   ├── configuracao/
│   └── analytics/        # reservado para a Fase 3 (Inteligência Editorial)
│
└── shared/               # Código compartilhado entre módulos
    ├── components/ui/     # Design System
    ├── components/layout/
    ├── config/            # Configuração central da aplicação e RBAC
    ├── lib/                # Prisma client, Auth.js
    ├── hooks/
    ├── types/
    └── utils/validators/   # Schemas Zod
```

Cada módulo em `src/modules/` segue a mesma organização interna:

- `domain/` — entidades e regras de negócio puras (nunca depende de
  framework ou infraestrutura).
- `application/` — casos de uso (orquestram regras de domínio).
- `infrastructure/` — implementação concreta (ex.: repositórios Prisma).
- `presentation/` — componentes de UI específicos do módulo.

---

## Papéis (RBAC) — MVP Essencial

Fonte única de verdade em `src/shared/config/roles.config.ts`:

- Super Administrador
- Administrador
- Editor-chefe
- Editor
- Jornalista
- Colunista
- Fotógrafo
- Comercial

> O documento `01.03 – Escopo do MVP` está oficialmente substituído por
> `01.03.1 – MVP Essencial` e deve ser tratado apenas como referência
> histórica (decisão do Product Owner).

---

## Como rodar o projeto localmente

### 1. Pré-requisitos
- Node.js 20+
- MySQL 8+ acessível (local ou remoto)

### 2. Instalação
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# edite .env com sua string de conexão MySQL e gere um AUTH_SECRET:
npx auth secret
```

### 4. Gerar o Prisma Client e aplicar o schema
```bash
npm run db:generate
npm run db:migrate
npm run db:seed   # cria o usuário Super Administrador inicial
```

> ⚠️ **Nota sobre o ambiente em que este projeto foi gerado:** a sandbox
> usada para criar esta fundação possui acesso de rede restrito e não
> conseguiu baixar os binários de engine do Prisma (`binaries.prisma.sh`
> não está na lista de domínios permitidos). Isso **não é um problema do
> projeto** — é uma limitação apenas deste ambiente de geração. No seu
> ambiente local ou de CI/CD, com rede normal, `npm run db:generate` deverá
> funcionar normalmente. O restante do código (TypeScript, ESLint, rotas,
> middleware) já foi validado.

### 5. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` (portal público) e
`http://localhost:3000/login` (acesso administrativo).

### 6. Outros comandos úteis
```bash
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Vitest
npm run db:studio    # Prisma Studio (explorar o banco visualmente)
```

---

## O que foi entregue no Sprint 1

- [x] Projeto Next.js 16 + TypeScript + Tailwind CSS v4 configurado.
- [x] Estrutura completa de módulos (Modular Monolith / DDD / Clean
      Architecture), incluindo `analytics` (vazio, reservado) e
      `shared/config` (configuração centralizada).
- [x] Schema Prisma inicial: `Usuario`, `Conta`, `Sessao`,
      `TokenVerificacao`, `LogAuditoria` — base para Autenticação e RBAC.
- [x] Autenticação com Auth.js v5 (Credentials + JWT).
- [x] Middleware de proteção de rotas administrativas com RBAC por seção.
- [x] Layout administrativo (sidebar) e páginas placeholder de todos os
      módulos do MVP Essencial.
- [x] Rotas públicas placeholder (home, categoria, notícia, empresa,
      jornalista).
- [x] API Routes placeholder para todos os módulos do MVP.
- [x] ESLint e Prettier configurados e sem erros/avisos no código entregue.

## Próximos passos (Sprint 2 — sugestão)

- Modelagem completa do domínio Editorial (Noticia, Categoria, Tag) no
  Prisma schema.
- Implementação real dos casos de uso do módulo `editorial`
  (criar/editar/publicar/agendar notícia).
- Editor visual de conteúdo (seção 5 do MVP Essencial).
- Modelagem do domínio `empresas` (diferencial estratégico ⭐).
