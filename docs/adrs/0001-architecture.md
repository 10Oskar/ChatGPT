# ADR 0001: Monorepo with Fastify Services

- **Context**: Need cohesive deployable stack with shared domain models.
- **Decision**: Use a pnpm monorepo. Implement services with Fastify, share schema via Prisma, expose Next.js frontend.
- **Consequences**: Simplifies local orchestration via docker-compose and encourages shared libraries. Requires consistent TypeScript tooling across packages.
