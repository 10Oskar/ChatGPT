# Surveillance Digital Twin Command Centre

This monorepo delivers a production-ready surveillance and decision support platform for the global spare-parts supply network. It comprises mock adapters for upstream systems, the command centre services, prioritisation engines, orchestration workers, and a Next.js front-end for various operational roles.

## Repository Layout

- `apps/services/*` — backend services implemented with Fastify and BullMQ workers.
- `apps/web/command-centre` — Next.js 14 application with role-based dashboards and simulation sandbox.
- `packages/database` — Prisma schema, migrations, and seed data for PostgreSQL.
- `packages/shared` — shared domain models, event contracts, utilities.
- `packages/config` — configuration loader, environment typing, RBAC helpers.
- `packages/playbooks` — YAML playbooks and loader utilities.
- `packages/simulation` — deterministic what-if scenario engine and offline evaluators.
- `infra` — docker-compose stack, Makefile helpers, IaC stubs.
- `docs` — architecture diagrams, ADRs, OpenAPI documents, and operations manuals.

## Getting Started

See the **How to Run** section at the bottom for quick start instructions.

## Delivery Phases

- **Phase 1 – Foundation & Visibility**: Initial commit `foundation` tag covers adapters, cc-core read models, dashboards, basic pegging, and KPI views.
- **Phase 2 – Decision Support**: Current HEAD expands to prioritisation, Detect-&-Act, risk briefing, MDM guardian, dynamic picking, and simulation sandbox.
- **Phase 3 – Predict & Automate**: Reserved for future work (ML forecasting and automated playbooks) with tag `phase-3` when implemented.

## How to Run

1. Copy `.env.example` to `.env` and adjust secrets if needed.
2. Install dependencies: `make install`.
3. Start the stack with seeded data: `make dev` (invokes docker compose).
4. Open `http://localhost:3005` for the web UI and `http://localhost:3000/docs` for the cc-core API docs.
5. Run tests locally with `make test`.
