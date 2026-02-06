FROM node:24-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY pnpm-workspace.yaml ./

COPY package.json pnpm-lock.yaml ./

COPY apps/platform/package.json apps/platform/

RUN pnpm install --frozen-lockfile

COPY ./apps/platform ./apps/platform

COPY ./.env ./

RUN pnpm --filter platform build

FROM nginx:alpine
# Copy the built assets from the 'builder' stage to the Nginx web root directory
COPY --from=builder /app/apps/platform/dist /usr/share/nginx/html
# Expose port 80 (default Nginx port)
EXPOSE 80
# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
