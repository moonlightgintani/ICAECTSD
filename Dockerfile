# Stage 1: Build the Vite React Frontend Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code and config
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Serve via High-Performance Nginx Web Server
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx traffic management configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy production build assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
