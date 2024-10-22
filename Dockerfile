FROM node:22.10.0 AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
