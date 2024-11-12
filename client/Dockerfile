# Stage 0: Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 1: Development stage
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage 2: Build stage
FROM base AS build
RUN npm install
COPY . .
ARG VITE_API_URL
ARG VITE_TELEGRAM_BOT_USERNAME
ARG VITE_PUBLIC_URL
ARG VITE_CRYPTO_PAY_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
ENV VITE_CRYPTO_PAY_API_URL=$VITE_CRYPTO_PAY_API_URL
RUN npm run build

# Stage 3: Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
