# Stage 1: Node.js
FROM node:18-slim AS node_stage
# Create and change to the app directory.
WORKDIR /
# Install FFmpeg.
RUN apt-get update && apt-get install -y ffmpeg
RUN curl -fsSL https://bun.sh/install | bash     
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
# Install production dependencies.
RUN bun install --omit=dev
# Copy local code to the container image.
COPY routes/ ./routes/
COPY config/ ./config/
# COPY twilioAudio/ ./twilioAudio/
COPY firebase.json .
COPY server.js .

# Stage 2: Python
FROM python:3-slim AS python_stage
# Copy only requirements.txt first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Now copy the rest of the Node.js build from Stage 1
COPY --from=node_stage / /

WORKDIR /

EXPOSE 8080
CMD [ "bun", "start" ]
