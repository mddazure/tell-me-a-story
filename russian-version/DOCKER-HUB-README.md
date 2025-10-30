# 🇷🇺 Скажи мне рассказ - Russian Story Generator

A specialized Russian-only language learning application that generates engaging Russian stories with comprehension and grammar questions using Azure OpenAI.

## 🌟 Features

- **Russian-Only Interface**: Fully localized Russian language app
- **Beautiful Russian Banner**: "Скажи мне рассказ" with Russian flag
- **CEFR Levels**: A1 to C2 proficiency levels  
- **10 Themes**: Food, Travel, Work, Family, Hobbies, Nature, City, Sports, Culture, Technology
- **Proper Cyrillic**: Uses only printed Cyrillic characters (печатные буквы)
- **Interactive Questions**: Comprehension and grammar exercises in Russian
- **Responsive Design**: Works on desktop and mobile
- **Word Count Options**: 200-1000 words

## 🚀 Quick Start

```bash
docker run -d \
  --name skazhi-mne-rasskaz \
  -p 3002:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/russian-story-generator:latest
```

Then open http://localhost:3002

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
  russian-story-generator:
    image: madedroo/russian-story-generator:latest
    container_name: skazhi-mne-rasskaz
    ports:
      - "3002:3000"
    environment:
      - AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
      - AZURE_OPENAI_API_KEY=your-api-key
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
    restart: unless-stopped
```

## 📚 Available Themes (Темы)

- **Еда** (Food) - Default selection
- **Путешествия** (Travel)  
- **Работа** (Work)
- **Семья** (Family)
- **Хобби** (Hobbies)
- **Природа** (Nature)
- **Город** (City)
- **Спорт** (Sports)
- **Культура** (Culture)
- **Технологии** (Technology)

## 🎯 How to Use

1. **Access**: Open http://localhost:3002 in your browser
2. **Configure**: 
   - **Уровень владения языком** (Proficiency Level): A1-C2
   - **Тема рассказа** (Story Theme): Choose from 10 themes
   - **Количество слов** (Word Count): 200-1000 words
3. **Generate**: Click "Создать рассказ" (Create Story)
4. **Learn**: Read the story and use the question buttons:
   - **Вопросы на понимание** (Comprehension Questions)
   - **Грамматические вопросы** (Grammar Questions)

## 🏥 Health Check

The container includes built-in health monitoring:

```bash
# Check container health
docker ps

# Health endpoint
curl http://localhost:3002/health
```

## 🔒 Security Features

- **Non-root execution**: Runs as user `nextjs:1001`
- **Alpine Linux base**: Minimal attack surface
- **Security headers**: CSP, CORS protection via Helmet.js
- **Input validation**: Sanitized user inputs
- **No secrets in image**: Environment variables only

## 🎓 Perfect For

- **Russian Language Students**: All CEFR levels (A1-C2)
- **Teachers**: Creating Russian lesson materials
- **Self-Study**: Independent practice and learning
- **Immersive Learning**: Full Russian interface experience
- **Cultural Learning**: Russia-focused themes and content

## 🌐 Differences from Multi-Language Version

This specialized Russian version offers:

- **No Language Selection**: Russian hardcoded for streamlined experience
- **Russian Interface**: All UI text in Russian
- **Russian Flag Banner**: Prominent "Скажи мне рассказ" branding
- **Enhanced Cyrillic Handling**: Optimized for Russian typography
- **Cultural Themes**: Russia-specific content and contexts
- **Simplified UX**: Single-language focused interface

## 🔗 Related Images

- **Multi-Language Version**: [madedroo/foreign-language-stories](https://hub.docker.com/r/madedroo/foreign-language-stories)
- **Source Code**: [GitHub Repository](https://github.com/mddazure/tell-me-a-story)

## 🏷️ Tags

- `latest` - Most recent stable version
- `v1.0.0` - Specific version releases

## 🌍 Azure Integration

Optimized for Azure deployment:

- **Azure OpenAI**: Native GPT-4 integration
- **Azure App Service**: Direct deployment support  
- **Azure Container Instances**: Single-container deployment
- **Azure Container Apps**: Advanced scaling capabilities
- **Managed Identity**: Secure Azure authentication

## 💡 Usage Examples

### Local Development
```bash
# With environment file
docker run --env-file .env -p 3002:3000 madedroo/russian-story-generator

# With individual variables
docker run \
  -e AZURE_OPENAI_ENDPOINT="https://swedencentral.api.cognitive.microsoft.com/" \
  -e AZURE_OPENAI_API_KEY="your-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  -p 3002:3000 \
  madedroo/russian-story-generator
```

### Production Deployment
```bash
# Azure Container Instances
az container create \
  --resource-group myResourceGroup \
  --name russian-stories \
  --image madedroo/russian-story-generator:latest \
  --environment-variables AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  --secure-environment-variables AZURE_OPENAI_API_KEY="your-api-key" \
  --ports 3000
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: russian-story-generator
spec:
  replicas: 2
  selector:
    matchLabels:
      app: russian-stories
  template:
    metadata:
      labels:
        app: russian-stories
    spec:
      containers:
      - name: app
        image: madedroo/russian-story-generator:latest
        ports:
        - containerPort: 3000
        env:
        - name: AZURE_OPENAI_ENDPOINT
          value: "https://your-openai.openai.azure.com/"
        - name: AZURE_OPENAI_DEPLOYMENT_NAME
          value: "gpt-4o"
        - name: AZURE_OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
```

## 📊 Image Details

- **Base Image**: `node:18-alpine`
- **Size**: ~309MB (optimized)
- **Architecture**: Multi-platform (linux/amd64, linux/arm64)
- **Security**: Non-root user, minimal dependencies
- **Performance**: Production-optimized Node.js

## 🤝 Contributing

Issues and contributions welcome on [GitHub](https://github.com/mddazure/tell-me-a-story)!

## 📄 License

MIT License - Free for educational and commercial use.

---

**Изучайте русский язык через увлекательные истории!** 🇷🇺📚

*Learn Russian through engaging AI-powered stories!*