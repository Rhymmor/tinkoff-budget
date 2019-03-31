FROM node:carbon AS base
WORKDIR /app

FROM base AS dependencies  
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

FROM dependencies AS build  
WORKDIR /app
COPY src /app/src/
RUN npm run build

FROM node:8.9-alpine AS release  
WORKDIR /app

COPY --from=dependencies /app/package.json ./
# Установить зависимости приложения
RUN npm install --only=production
COPY --from=build /app ./
RUN npm prune --production

ENV HOST="0.0.0.0"
ENV PORT=80
ENV NODE_ENV="production"
CMD ["node", "build/src/server/main.js"]