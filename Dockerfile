FROM node:8-slim

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Expose port
EXPOSE 8080

# Run app
CMD ["npm", "start"]
