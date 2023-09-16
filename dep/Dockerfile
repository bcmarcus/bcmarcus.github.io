# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-slim

# Create and change to the app directory.
WORKDIR /
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
# Copy local code to the container image.
COPY routes/ ./routes/
COPY config/ ./config/
COPY firebase.json .
COPY server.js .
# Install production dependencies.
RUN npm install --omit=dev

EXPOSE 8080
# Run the web service on container startup.
CMD [ "npm", "start" ]
