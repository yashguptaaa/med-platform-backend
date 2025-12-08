# ---------- Stage 1: build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (dev + prod)
COPY package*.json ./
RUN npm install

# Copy source
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy package files so runtime has manifest info
COPY package*.json ./

# Copy node_modules from build stage (includes generated Prisma client)
COPY --from=build /app/node_modules ./node_modules

# Copy built JS + prisma folder
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
