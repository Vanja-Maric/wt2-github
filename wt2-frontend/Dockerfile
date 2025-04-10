# Stage 1: Build React app using Node.js
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . ./

# Build the React app
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]
