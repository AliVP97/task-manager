FROM node:18-alpine

# Define build arguments
ARG PORT
ARG HOST

# Set environment variables
ENV PORT=$PORT
ENV HOST=$HOST

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]
