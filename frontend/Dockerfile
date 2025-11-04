# Use official Node image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy all and build Next.js
COPY . .
RUN npm run build

# --- Production stage ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy build output from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
