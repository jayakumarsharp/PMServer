FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better Docker layer caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source
COPY . .

EXPOSE 3003

CMD ["yarn", "start"]
