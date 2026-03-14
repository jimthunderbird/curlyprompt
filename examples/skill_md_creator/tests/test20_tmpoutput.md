---
name: Docker Setup
description: Docker containerization guide
license: Apache-2.0
version: 1.0
---

# Docker Guide

This guide covers containerizing the application with Docker.

## Prerequisites

- Docker Engine installed
- Docker Compose installed
- Access to container registry

## Dockerfile

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

## Common Commands

- `docker build -t myapp . to build the image`
- `docker run -p 3000:3000 myapp to run the container`
- `docker compose up -d to start all services`

## Architecture Diagram

![Docker Architecture](docs/docker-arch.png)

