# Use an official Node.js runtime as the base image
FROM node:22-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files to the container
COPY . .

# Expose the port your app listens on
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "start" ]
