FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY src ./src
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/index.js"]
