# Step 1: Use the Node.js base image
FROM node:20-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN yarn install

# Step 4: Copy the rest of the application source code
COPY . .

# Step 5: Build the application
RUN yarn build

# Step 6: Expose the application port
EXPOSE 3000

# Step 7: Start the application
CMD ["yarn", "start:prod"]
