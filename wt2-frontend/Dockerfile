# Use Node.js image as the base image
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present) to the container
COPY package*.json ./

# Install dependencies from package.json
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the React application
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx container's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to be accessible from outside the container
EXPOSE 80

# Start Nginx in the foreground (this keeps the container running)
CMD ["nginx", "-g", "daemon off;"]
