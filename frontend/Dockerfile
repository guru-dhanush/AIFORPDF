# Step 1: Build the frontend
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built files to nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (optional, only if you have custom config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
