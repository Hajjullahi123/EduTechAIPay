# production stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run web:build

# runtime stage
FROM node:20-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/server ./server
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/main.js ./
COPY --from=build-stage /app/preload.js ./

EXPOSE 3001
CMD npx prisma db push && node server/index.js
