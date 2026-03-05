# isA_Docs — Product Requirements Document

> **Product**: isA Developer Documentation Platform
> **Type**: Developer-facing documentation site (like docs.anthropic.com, platform.openai.com/docs)
> **Owner**: isA Platform Team
> **Repo**: `xenoISA/isA_Docs`
> **Created**: 2026-03-03
> **Last Updated**: 2026-03-03

---

## 1. Product Vision

isA_Docs is the **public developer portal** for the isA platform. It is not an internal project wiki — it is a product that developers use to evaluate, adopt, and build with isA services. Every page is a touchpoint that either builds or erodes developer trust.

**North Star**: A developer can go from "what is isA?" to a working agent in under 10 minutes using only the docs.

**Competitive set**: Anthropic Docs, OpenAI Platform Docs, Stripe Docs, Vercel Docs.

---

## 2. Target Users

| Persona | Goal | Key Pages |
|---------|------|-----------|
| **Evaluator** | Assess if isA fits their needs | Home, Architecture, FAQ, Playground |
| **Builder** | Build agents and integrations | Agent SDK, MCP, Model, Getting Started, Cookbook |
| **Operator** | Deploy and monitor in production | Cloud, OS, User Services, Deployment Guide |
| **Contributor** | Extend the platform | API Reference, CDD contracts, GitHub |

---

## 3. Platform Coverage

The docs must cover all isA projects. Status as of 2026-03-03:

| Project | Section | Status | Notes |
|---------|---------|--------|-------|
| isA_Agent_SDK | `/agent-sdk` (22 pages) | [Complete] | Comprehensive — 22 pages covering all features |
| isA_MCP | `/mcp` (15 pages) | [Complete] | Tools, security, multi-tenant, aggregator |
| isA_Model | `/model` (7 pages) | [Complete] | Inference, voice, caching, training, ML prediction |
| isA_Cloud | `/cloud` (10 pages) | [Complete] | Infrastructure, gRPC, gateway, CI/CD, ops |
| isA_OS | `/os` (7 pages) | [Complete] | Pool Manager, Cloud OS, Desktop Agent, REPL |
| isA_Data | `/data` (5 pages) | [Complete] | RAG, data lake, fabric, file processing |
| isA_user | `/user` (13 pages) | [Complete] | 35 microservices across 7 categories |
| isA_Agent | `/agents` (4 pages) | [Complete] | Vibe, Creative, Default agents |
| isA_App_SDK | `/app-sdk` (1 page) | [Complete] | 6-package monorepo overview |
| isA_Frame | `/frame` (1 page) | [Complete] | EmoFrame smart photo system |
| isA_Console | `/console` (1 page) | [Complete] | Next.js dashboard |
| isA_Trade | `/trade` (1 page) | [Complete] | Multi-agent trading system |
| isA_Chain | `/chain` (1 page) | [Complete] | Blockchain core |
| isA_Vibe | via `/agents/vibe` | [Complete] | AI-SDLC orchestration |
| isA_Mate | — | [Not Started] | Companion services — no docs page exists |
| isA_Orch | — | [Not Started] | Platform orchestration — no docs page exists |

### Cross-Cutting Pages

| Page | Status | Notes |
|------|--------|-------|
| Home (`/`) | [Complete] | Platform overview with quick start |
| Getting Started | [Complete] | Installation, first agent, choose-your-path |
| Architecture | [Complete] | Full platform diagram and component details |
| Changelog | [Complete] | All releases through v0.6.0 |
| FAQ | [Complete] | 8 sections, some "coming soon" items |
| Playground | [Complete] | 4 demo playgrounds (simulated) |
| Cookbook (6 recipes) | [Complete] | Chatbot, RAG, code assistant, data, multi-agent, streaming |
| Quickstarts (5 guides) | [Complete] | Customer support, doc Q&A, Slack, Discord, API backend |

---

## 4. Completed Work

### Phase 1: Docs Catch-Up (Epic #3 — Closed 2026-03-03)

All issues resolved:

| Issue | Title | Status |
|-------|-------|--------|
| #4 | Bug: Incorrect GitHub org URL across docs | [Complete] |
| #5 | Bug: Stale MCP tool count and microservice count | [Complete] |
| #6 | Bug: 6 broken internal links to missing pages | [Complete] |
| #7 | Bug: FAQ references wrong MCP port | [Complete] |
| #8 | Update Agent SDK API examples to current surface | [Complete] |
| #9 | Update changelog with all releases since Jan 2025 | [Complete] |
| #10 | Document shipped features (voice, A2A, proxy, observability) | [Complete] |
| #11 | Add docs for App SDK, Console, Trade, Chain, Frame | [Complete] |
| #2 | SDK Migration: Adopt isA_App_SDK primitives | [Complete] |

---

## 5. Current Phase: Developer-Grade DX Overhaul

### 5.1 Problem Statement

A product audit (2026-03-03) against the implementation revealed 13 gaps across accuracy, completeness, and interactive components. The docs read like maintained project notes rather than a developer product. Key trust-breakers:

- **Contradictory numbers**: MCP tool count says "89+" in 10 places but "190+" in the Agent SDK tools page
- **Wrong model names**: 3 pages reference `gpt-5-nano` while 40+ pages use `gpt-4.1-nano`
- **Mocked components**: StatusBadge always returns "operational"; FeedbackWidget logs to console
- **Missing projects**: isA_Mate and isA_Orch have zero documentation
- **Unresolved placeholders**: 5+ "Coming Soon" sections across the site

### 5.2 Requirements

#### 5.2.1 Content Accuracy (P1)

**Requirement**: Every number, model name, and API example in the docs must be correct and consistent across all pages.

**Acceptance Criteria**:
- [ ] Single authoritative MCP tool count used everywhere (verify against `isA_MCP` source)
- [ ] Single authoritative default model name used everywhere (verify against `isA_Model` source)
- [ ] Tool names follow a documented capitalization convention (snake_case for MCP tools, PascalCase only for Claude Code tool references)
- [ ] Zero conflicting numbers or names across all 95 MDX files

**Stories**:
- Fix MCP tool count to single authoritative number across all pages (P1)
- Fix model name inconsistency — standardize gpt-5-nano vs gpt-4.1-nano (P1)
- Standardize tool name capitalization convention (P2)

#### 5.2.2 Platform Coverage (P2)

**Requirement**: Every isA project listed in the platform directory must have at minimum an index page with overview, architecture diagram, quick start, and tech stack.

**Acceptance Criteria**:
- [ ] `content/mate/index.mdx` exists with overview, architecture, getting-started
- [ ] `content/orch/index.mdx` exists with overview, architecture, getting-started
- [ ] Home page and architecture page reference all 16 projects

**Stories**:
- Add isA_Mate project documentation (P2)
- Add isA_Orch project documentation (P2)

#### 5.2.3 Interactive Components (P2)

**Requirement**: Every interactive component on the site must be functional — no mocked behaviors in production.

**Acceptance Criteria**:
- [ ] StatusBadge either fetches real status or displays static badge without fake fetch
- [ ] FeedbackWidget submits to an endpoint or is removed from rendered pages
- [ ] Search API has rate limiting (30 req/min/IP), configurable embedding model, 10s timeout
- [ ] Search API embedding model is env-configurable (not hardcoded `text-embedding-3-small`)

**Stories**:
- Fix StatusBadge — remove mock, use real status or static display (P2)
- Harden search API — rate limiting, timeouts, configurable model (P2)
- Wire FeedbackWidget to backend or remove from pages (P3)

#### 5.2.4 Placeholder Resolution (P2)

**Requirement**: No "Coming Soon" text without a linked tracking issue or concrete timeline.

**Acceptance Criteria**:
- [ ] `content/platform/index.mdx` "Coming Soon" section either documented or linked to issue
- [ ] `content/agents/creative.mdx` "Coming Soon" section resolved
- [ ] `content/agent-sdk/desktop-execution.mdx` cloud_pool reference resolved
- [ ] `content/faq.mdx` pricing and compliance "coming soon" items resolved
- [ ] `content/os/python-repl.mdx` architecture diagram `(TODO)` replaced

**Stories**:
- Resolve all "Coming Soon" placeholders across docs (P2)
- Fix Python REPL TODO in architecture diagram (P3)

### 5.3 Out of Scope (This Phase)

These are valuable but deferred to a future phase:

| Feature | Rationale |
|---------|-----------|
| Multi-language SDK parity (Python + JS + cURL on every page) | High effort, requires coordinating with SDK teams |
| Live API playground with real backend calls | Requires auth infrastructure for anonymous users |
| Automated docs generation from source code | Separate tooling initiative |
| Status page with historical uptime | Needs dedicated monitoring infrastructure |
| i18n / localization | Not needed at current scale |
| AI-powered search answers (RAG over docs) | Current vector search is functional; full RAG is a future enhancement |
| Developer onboarding analytics / funnel tracking | Needs analytics infrastructure first |

---

## 6. Phase 3: Production Readiness (Epic #31)

### 6.0 Problem Statement

A production readiness investigation (2026-03-05) found that the docs site builds cleanly (118 static pages) but has **no deployment path, no CI, no tests, and several API/component issues** that would prevent a reliable production deployment. The site works locally but is not production-grade.

### 6.1 Deployment & CI (P0-P1)

**Requirement**: The site must have a defined, repeatable deployment path and automated quality gates.

**Acceptance Criteria**:
- [ ] Dockerfile or Vercel config exists and produces a working deployment
- [ ] GitHub Actions CI runs build + lint on every PR
- [ ] ESLint and Prettier are configured with standard Next.js rules

**Stories**:
- Add deployment configuration — Dockerfile + container/Vercel config (P0, infra)
- Add GitHub Actions CI pipeline — build + lint on PR (P1, infra)
- Add ESLint + Prettier configuration (P1, infra)

### 6.2 API Hardening (P0-P1)

**Requirement**: Server-side API routes must be durable, observable, and resilient in production environments.

**Acceptance Criteria**:
- [ ] Feedback storage uses a durable backend (not local filesystem)
- [ ] Rate limiter works across instances and survives restarts (Redis or external)
- [ ] Search API has health checks; UI degrades gracefully when search is unavailable
- [ ] Search input is debounced (300ms minimum)

**Stories**:
- Replace feedback JSONL file storage with durable backend (P0, api/data)
- Replace in-memory rate limiter with Redis or external solution (P0, api/infra)
- Add search health check and graceful UI degradation (P1, api/ui)
- Add debounce to AI search input — 300ms (P1, ui)

### 6.3 Code Quality & DX (P1-P2)

**Requirement**: The codebase must have type safety, test coverage, error resilience, and SEO basics for a public-facing site.

**Acceptance Criteria**:
- [ ] TypeScript strict mode enabled with zero type errors
- [ ] Test suite exists covering API routes and key utilities
- [ ] React error boundaries wrap all interactive components
- [ ] No `console.error` in production code
- [ ] sitemap.xml and robots.txt are generated at build time
- [ ] Custom 404 page exists
- [ ] ApiPlayground proxies requests server-side (no client-side API keys)

**Stories**:
- Enable TypeScript strict mode and fix type errors (P1, core)
- Add basic test suite — unit + API route tests (P1, core)
- Add React error boundaries around interactive components (P2, ui)
- Replace console.error with structured logger or remove (P2, core)
- Add sitemap.xml and robots.txt generation (P2, docs/infra)
- Add custom 404 page (P2, ui)
- Add server-side proxy for ApiPlayground requests (P2, api)

### 6.4 Out of Scope (This Phase)

| Feature | Rationale |
|---------|-----------|
| Full monitoring/alerting | Requires dedicated observability infrastructure |
| CDN configuration | Depends on hosting decision |
| Production secrets management | Handled by isA_Cloud |
| Lighthouse performance audit | Separate optimization pass |
| Load testing | Premature before deployment target is defined |

---

## 7. Future Phases (Backlog)

### Phase 4: Developer Experience Polish

- Expected output shown alongside every code example
- Framework/package-manager variant selectors on install commands (pip/uv/poetry)
- "Related pages" recommendations at page bottom
- Page-level "Edit on GitHub" links
- Versioned docs (pin docs to SDK version)

### Phase 5: Interactive & Trust

- Live API playground with sandboxed backend
- Per-service status dashboard with uptime history
- AI-powered search with RAG (answer questions, not just find pages)
- Developer feedback pipeline (submit → triage → fix → notify)
- Community contributions workflow

### Phase 6: Scale

- Multi-language docs (JS/TS SDK parity)
- Auto-generated API reference from OpenAPI/protobuf specs
- Onboarding funnel analytics (where do developers drop off?)
- Localization for top-traffic regions

---

## 8. Technical Architecture

### Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x |
| Docs Engine | Nextra | 4.6.x |
| Styling | Tailwind CSS | 4.x |
| Search Backend | Qdrant | — |
| Embeddings | isA_Model service | — |
| Hosting | TBD | — |
| Language | TypeScript / React 19 | — |

### Key Files

| Path | Purpose |
|------|---------|
| `content/**/*.mdx` | All documentation content (95 files) |
| `app/layout.tsx` | Root layout with Nextra theme, nav, footer |
| `app/page.tsx` | Marketing home page |
| `app/content/[[...mdxPath]]/page.tsx` | Dynamic MDX content router |
| `app/api/search/route.ts` | AI search API endpoint |
| `components/` | 7 custom components (AISearch, ApiPlayground, etc.) |
| `lib/surfaces.ts` | Centralized env-driven URL config |
| `.env.example` | Environment variable template |

### Content Structure

```
content/
  index.mdx              # Home
  getting-started.mdx     # Onboarding
  architecture.mdx        # Platform overview
  changelog.mdx           # Release history
  faq.mdx                 # FAQ
  playground.mdx          # Interactive demos
  agent-sdk/              # 22 pages
  mcp/                    # 15 pages
  model/                  # 7 pages
  cloud/                  # 10 pages
  os/                     # 7 pages
  data/                   # 5 pages
  user/                   # 13 pages
  agents/                 # 4 pages
  app-sdk/                # 1 page
  frame/                  # 1 page
  console/                # 1 page
  trade/                  # 1 page
  chain/                  # 1 page
  platform/               # 1 page
  cookbook/                # 7 pages
  quickstarts/            # 6 pages
```

---

## 9. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Content accuracy | 0 contradictions across all pages | Automated grep audits |
| Platform coverage | 16/16 projects documented | Content directory check |
| Placeholder count | 0 unlinked "Coming Soon" items | Grep audit |
| Search reliability | < 2s p95 response time | API monitoring |
| Component functionality | 0 mocked behaviors in production | Code review |

---

## 10. Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-03-03 | isA Team | Initial PRD created from product audit findings |
| 2026-03-05 | isA Team | Added Phase 3: Production Readiness (14 stories, 3 themes) |
