FROM node:18-alpine

# Define build arguments
ARG VITE_API_URL
ARG VITE_PORT=5173

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PORT=$VITE_PORT

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install
RUN npm install -g vite

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE $VITE_PORT

# Start the preview server
CMD ["sh", "-c", "npx vite preview --host --port $VITE_PORT"]
