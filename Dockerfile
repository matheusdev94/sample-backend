# Use the official Node.js image as the base image
FROM node:16

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the working directory
COPY ./app .

# Expose the port on which your Node.js application will run
EXPOSE 3500

# Command to run your Node.js application
CMD ["node", "server.js"]
