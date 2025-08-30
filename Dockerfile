# Builder stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy app source (optional if needed during build)
COPY . .

# Production stage
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /usr/src/app

# Copy package files and install ONLY production deps
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy application code
COPY --chown=nextjs:nodejs . .

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]
# CMD ["node", "app.js"]