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
RUN npm run build
RUN cp -r assets dist/

# Stage 3: Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["npm", "start"]
