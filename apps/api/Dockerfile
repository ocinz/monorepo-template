FROM node:24-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

COPY ./apps/api ./apps/api
RUN pnpm db:generate
COPY ./.env ./

RUN pnpm --filter api build

EXPOSE 8000

CMD ["pnpm", "--filter", "api", "start"]
