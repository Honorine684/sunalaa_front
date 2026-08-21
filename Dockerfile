FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=https://api.sunalaa.com/api/v1
ARG NEXT_PUBLIC_SNL_LAUNCH_DATE=2026-06-18
ARG NEXT_PUBLIC_SNL_EXCHANGE_DATE=2027-01-21
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SNL_LAUNCH_DATE=$NEXT_PUBLIC_SNL_LAUNCH_DATE
ENV NEXT_PUBLIC_SNL_EXCHANGE_DATE=$NEXT_PUBLIC_SNL_EXCHANGE_DATE
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
