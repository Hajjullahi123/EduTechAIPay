# production stage
FROM node:20 AS build-stage
WORKDIR /app

# Copy package files and the prisma schema FIRST to satisfy postinstall
COPY package*.json ./
COPY server/prisma/schema.prisma ./server/prisma/schema.prisma

# Now run a normal npm install with fresh resolution for Linux
RUN rm -f package-lock.json && npm install

# Copy the rest of the application
COPY . .

# Generate the prisma client and build the frontend
RUN npx prisma generate --schema=server/prisma/schema.prisma
RUN npm run web:build

# runtime stage
FROM node:20-slim AS production-stage
# Prisma needs openssl on slim images
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/server ./server
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/main.js ./
COPY --from=build-stage /app/preload.js ./

EXPOSE 3001
CMD npx prisma db push --schema=server/prisma/schema.prisma && node server/index.js
