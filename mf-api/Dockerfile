# Build stage
FROM node:22 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and prisma setup
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app

# Install openssl for Prisma and other production dependencies
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production && rm -rf /root/.npm

# Copy built files and prisma setup from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.js ./prisma.config.js

# Expose the port
EXPOSE 3000

# Start command: Ensure DB is synced (push) then start the server
# DATABASE_URL should be provided via environment variables (e.g., in docker-compose or Render)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/server.js"]