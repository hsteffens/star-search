# Step 1: Use an official Node.js image as the base image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json from the start-search folder into the container
COPY star-search/package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code from the start-search folder
COPY star-search/ .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Expose port 3000 to be accessible from outside the container
EXPOSE 3000

# Step 8: Start the Next.js application
CMD ["npm", "start"]
