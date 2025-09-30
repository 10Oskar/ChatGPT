FROM node:20-bullseye AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps
RUN npm install -g pnpm@8.15.1
RUN pnpm install --frozen-lockfile --ignore-scripts
ARG SERVICE
RUN pnpm --filter ${SERVICE} run build

FROM node:20-bullseye AS runtime
WORKDIR /app
RUN npm install -g pnpm@8.15.1
COPY --from=base /app ./
ARG SERVICE
CMD ["pnpm", "--filter", "${SERVICE}", "run", "start"]
