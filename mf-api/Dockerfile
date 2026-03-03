# Build stage
FROM node:22 AS build

WORKDIR /app

# Explicitly copy package files first
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy everything from the current folder
COPY . .

# Generate Prisma client & Build
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Final Production stage
FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app

# Install openssl (Required for Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.js ./prisma.config.js

EXPOSE 3000

# Push schema and start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/server.js"]
