# Stage 0: Base stage
FROM node:20-alpine 
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY tsconfig.json ./
COPY .env ./

RUN mkdir -p static/gifts

CMD ["npm", "run", "dev"]
