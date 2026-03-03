# Build stage
FROM node:22 AS build

WORKDIR /app

# Install dependencies (all, including dev)
COPY package*.json ./
RUN npm install

# Copy source code and config
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (TypeScript to JavaScript)
RUN npm run build

# Prune development dependencies to keep the image small
RUN npm prune --production

# Final Production stage
FROM node:22-slim

# Set to production
ENV NODE_ENV=production

WORKDIR /app

# Install openssl (required for Prisma's database engine)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy necessary files from the build stage
# This is much safer than copying from the host context again
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.js ./prisma.config.js

# Expose the port (Render will use this)
EXPOSE 3000

# Start command:
# 1. Sync the database schema (prisma db push)
# 2. Start the compiled JavaScript server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/server.js"]