# Docker Deployment Guide

## 🐳 Docker Container for Foreign Language Stories App

This document explains how to build, run, and deploy the Foreign Language Stories application using Docker.

## 📋 Prerequisites

- Docker Desktop installed and running
- Azure OpenAI service endpoint and API key (for full functionality)

## 🔨 Building the Docker Image

### Build the Container
```bash
# Build the Docker image
docker build -t foreign-language-stories:latest .

# Build with a specific tag
docker build -t foreign-language-stories:v1.0.0 .
```

### Image Details
- **Base Image**: `node:18-alpine` (lightweight Linux distribution)
- **Size**: Optimized with multi-stage build and Alpine Linux
- **Security**: Runs as non-root user (`nextjs:1001`)
- **Health Check**: Built-in HTTP health check on port 3000

## 🚀 Running the Container

### Method 1: Docker Run Command

#### Basic Run (without Azure OpenAI)
```bash
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  foreign-language-stories:latest
```

#### Full Configuration (with Azure OpenAI)
```bash
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai-resource.openai.azure.com/" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  -e AZURE_OPENAI_API_KEY="your-api-key-here" \
  -e NODE_ENV="production" \
  foreign-language-stories:latest
```

#### Using Environment File
```bash
# Create .env file from template
cp .env.docker .env

# Edit .env with your Azure OpenAI credentials
# Then run:
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  --env-file .env \
  foreign-language-stories:latest
```

### Method 2: Docker Compose

```bash
# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Required Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint | `https://your-openai.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | `gpt-4o` |

### Optional Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `AZURE_OPENAI_API_KEY` | None | API key (required for local development) |
| `AZURE_CLIENT_ID` | None | Managed Identity ID (for Azure deployment) |
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `3000` | Application port |

### Environment File Template (`.env.docker`)
```bash
# Copy and customize this file
AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_KEY=your-api-key-here
NODE_ENV=production
PORT=3000
```

## 🏥 Health Checks

The container includes built-in health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' foreign-language-stories
```

Health check endpoint: `http://localhost:3000/`

## 📊 Container Management

### View Running Containers
```bash
docker ps
```

### Check Container Logs
```bash
# View all logs
docker logs foreign-language-stories

# Follow live logs
docker logs -f foreign-language-stories

# View last 50 lines
docker logs --tail 50 foreign-language-stories
```

### Stop and Remove Container
```bash
# Stop container
docker stop foreign-language-stories

# Remove container
docker rm foreign-language-stories

# Remove image
docker rmi foreign-language-stories:latest
```

### Container Shell Access
```bash
# Access container shell for debugging
docker exec -it foreign-language-stories /bin/sh
```

## 🌐 Access the Application

Once running, access the application at:
- **Local**: http://localhost:3000
- **Custom port**: http://localhost:YOUR_PORT (if using different port mapping)

## 🔒 Security Features

- **Non-root user**: Container runs as `nextjs` user (UID 1001)
- **Minimal base image**: Alpine Linux reduces attack surface
- **No secrets in image**: Environment variables used for configuration
- **Health checks**: Automatic container health monitoring
- **Security headers**: Helmet.js provides security middleware

## 📦 Docker Hub Deployment

### Tag and Push to Docker Hub
```bash
# Tag the image
docker tag foreign-language-stories:latest your-dockerhub-username/foreign-language-stories:latest

# Push to Docker Hub
docker push your-dockerhub-username/foreign-language-stories:latest

# Pull and run from Docker Hub
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  --env-file .env \
  your-dockerhub-username/foreign-language-stories:latest
```

## 🐛 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check container status
docker ps -a

# View detailed logs
docker logs foreign-language-stories

# Check container configuration
docker inspect foreign-language-stories
```

#### Port Already in Use
```bash
# Use different port
docker run -p 3001:3000 foreign-language-stories:latest

# Find processes using port 3000
netstat -an | findstr 3000
```

#### Azure OpenAI Connection Issues
1. Verify environment variables are set correctly
2. Check Azure OpenAI endpoint is accessible
3. Ensure API key has proper permissions
4. Check deployment name matches Azure configuration

### Performance Monitoring
```bash
# Monitor resource usage
docker stats foreign-language-stories

# View container processes
docker exec foreign-language-stories ps aux
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker image
      run: docker build -t foreign-language-stories:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push foreign-language-stories:${{ github.sha }}
```

## 🌊 Azure Container Deployment

### Azure Container Instances
```bash
az container create \
  --resource-group your-rg \
  --name foreign-language-stories \
  --image your-dockerhub-username/foreign-language-stories:latest \
  --environment-variables \
    AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  --secure-environment-variables \
    AZURE_OPENAI_API_KEY="your-api-key" \
  --ports 3000 \
  --location eastus
```

### Azure Container Apps
The application can also be deployed to Azure Container Apps for advanced scaling and management features.

---

## 📝 Notes

- The Docker image is optimized for production use
- Development dependencies are excluded from the final image
- The container includes proper logging and monitoring capabilities
- Security best practices are implemented throughout the container