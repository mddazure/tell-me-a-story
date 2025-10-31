# Russian Story Generator Docker Image
# Use the official Node.js 18 Alpine image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy source code
COPY src/ ./src/

# Create necessary directories and set permissions
RUN mkdir -p /usr/src/app/logs && \
    chown -R nextjs:nodejs /usr/src/app

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Health check to ensure the app is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Add labels for better organization
LABEL maintainer="madedroo" \
      version="1.0.0" \
      description="Скажи мне рассказ - Russian Language Learning App" \
      language="russian"

# Start the application
CMD ["npm", "start"]