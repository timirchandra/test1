# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose application port
EXPOSE 3000

# Set environment variables (Override these in deployment)
ENV MONGO_URI=mongodb://mongo:27017/hospital_db
ENV JWT_SECRET=your_secret_key

# Start the application
CMD ["node", "server.js"]
