# Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3001

# Start command
CMD ["npm", "start"]