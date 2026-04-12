# production stage
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
RUN npx prisma generate --schema=server/prisma/schema.prisma
RUN npm run web:build

# runtime stage
FROM node:20-alpine AS production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/server ./server
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/main.js ./
COPY --from=build-stage /app/preload.js ./

EXPOSE 3001
CMD npx prisma db push --schema=server/prisma/schema.prisma && node server/index.js
