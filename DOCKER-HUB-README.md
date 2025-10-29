# Foreign Language Stories - Docker Image

A containerized web application that generates foreign language stories with comprehension and grammar questions using Azure OpenAI.

## 🚀 Quick Start

```bash
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/foreign-language-stories:latest
```

Then open http://localhost:3000

## 📋 Features

- **Multi-language Support**: Generate stories in various languages
- **Proficiency Levels**: A1, A2, B1, B2, C1, C2 (CEFR standard)
- **Themed Stories**: Choose from different topics (Food, Travel, Work, etc.)
- **Interactive Questions**: Comprehension and grammar exercises
- **Responsive Design**: Works on desktop and mobile
- **Proper Typography**: Language-specific character rendering (e.g., proper Cyrillic for Russian)

## 🔧 Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint | `https://your-openai.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | `gpt-4o` |
| `AZURE_OPENAI_API_KEY` | API key for authentication | `your-api-key-here` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Environment mode |
| `AZURE_CLIENT_ID` | - | Managed Identity ID (Azure deployment) |

## 🐳 Docker Compose

```yaml
version: '3.8'
services:
  foreign-language-stories:
    image: madedroo/foreign-language-stories:latest
    ports:
      - "3000:3000"
    environment:
      - AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
      - AZURE_OPENAI_API_KEY=your-api-key
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
    restart: unless-stopped
```

## 🏥 Health Check

The container includes built-in health checks accessible at the root endpoint (`/`).

```bash
# Check container health
docker ps

# View health status
docker inspect --format='{{.State.Health.Status}}' container_name
```

## 🔒 Security

- Runs as non-root user (`nextjs:1001`)
- Alpine Linux base image for minimal attack surface
- Security headers via Helmet.js middleware
- No secrets baked into the image

## 📊 Supported Languages

Currently optimized for:
- **Russian** (with proper Cyrillic typography)
- **English**
- **Spanish**
- **French**
- **German**
- And more via Azure OpenAI multilingual support

## 🌐 Azure Integration

This container is designed to work seamlessly with Azure services:

- **Azure OpenAI**: GPT-4 integration for story generation
- **Azure App Service**: Direct deployment support
- **Azure Container Instances**: Single-container deployment
- **Azure Container Apps**: Advanced scaling and management
- **Managed Identity**: Secure authentication in Azure

## 📖 Example Usage

### Local Development
```bash
# With environment file
docker run --env-file .env -p 3000:3000 madedroo/foreign-language-stories:latest

# With individual variables
docker run \
  -e AZURE_OPENAI_ENDPOINT="https://swedencentral.api.cognitive.microsoft.com/" \
  -e AZURE_OPENAI_API_KEY="your-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  -p 3000:3000 \
  madedroo/foreign-language-stories:latest
```

### Production Deployment
```bash
# Azure Container Instances
az container create \
  --resource-group myResourceGroup \
  --name foreign-language-stories \
  --image madedroo/foreign-language-stories:latest \
  --environment-variables AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  --secure-environment-variables AZURE_OPENAI_API_KEY="your-api-key" \
  --ports 3000
```

## 🏷️ Tags

- `latest` - Most recent stable version
- `v1.0.0` - Specific version releases

## 📝 License

MIT License - See the source repository for details.

## 🔗 Links

- **Source Code**: [GitHub Repository](https://github.com/mddazure/tell-me-a-story)
- **Issues**: Report bugs and feature requests on GitHub
- **Azure OpenAI**: [Get started with Azure OpenAI](https://azure.microsoft.com/services/cognitive-services/openai-service/)

## 💡 Tips

1. **Environment File**: Use `--env-file .env` for easier configuration management
2. **Port Mapping**: Change the host port if 3000 is already in use: `-p 8080:3000`
3. **Logging**: View container logs with `docker logs container_name`
4. **Updates**: Pull the latest image regularly: `docker pull madedroo/foreign-language-stories:latest`

---

Built with ❤️ for language learners worldwide