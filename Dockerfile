FROM node:24-alpine AS deps
WORKDIR /app

COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN cd server && npm ci
RUN cd client && npm ci

FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

COPY . .

RUN cd server && npm run build
RUN cd client && npm run build

RUN cd server && npm prune --omit=dev

FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/server/node_modules ./server/node_modules

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

COPY --from=builder /app/server/package.json ./server/

CMD ["node", "./server/dist/main"]
