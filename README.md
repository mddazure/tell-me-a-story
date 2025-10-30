# 🌍 Foreign Language Story Generator

AI-powered language learning applications that generate engaging stories with comprehension and grammar questions using Azure OpenAI. Available in two versions: **Multi-Language** and **Russian-Only**.

## 🚀 **Status: Production Ready** ✅

Both applications are **fully functional** and deployed to Docker Hub:
- ✅ **Multi-Language Version**: Supporting 10+ languages with easy language selection
- ✅ **Russian-Only Version**: "Скажи мне рассказ" - specialized for Russian learners  
- ✅ **All Features Working**: Story generation, comprehension questions, grammar questions
- ✅ **Security Hardened**: CSP-compliant, production security headers
- ✅ **Docker Hub Ready**: Latest images available for immediate deployment

##  Quick Start with Docker

### Multi-Language Version
```bash
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/foreign-language-stories:latest
```

### Russian-Only Version
```bash
docker run -d \
  --name skazhi-mne-rasskaz \
  -p 3001:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/russian-story-generator:latest
```

## 🌟 Two Versions Available

### 🌍 **Multi-Language Version** 
**Perfect for language learning centers and polyglots**

- 🌐 **10+ Languages**: Spanish, French, German, Italian, Portuguese, Dutch, Russian, Japanese, Korean, Chinese
- 🔄 **Language Selection**: Easy dropdown to switch between languages
- 🎯 **Universal Interface**: English UI for global accessibility
- 📚 **Broad Appeal**: Suitable for diverse learning environments

### 🇷🇺 **Russian-Only Version: "Скажи мне рассказ"**
**Specialized for dedicated Russian learners**

- 🇷🇺 **Russian Flag Banner**: Beautiful "Скажи мне рассказ" branding
- 🎯 **Russian-Only Focus**: No language selection, streamlined experience
- 📝 **Full Russian Interface**: Complete immersion in Russian
- 🔤 **Proper Cyrillic**: Uses only printed Cyrillic characters (печатные буквы)
- 🏛️ **Cultural Themes**: Russia-focused content and contexts

## 🎮 Features (Both Versions)

- 📊 **CEFR Proficiency Levels**: A1 (Beginner) to C2 (Mastery)
- 🎭 **Themed Stories**: 10 themes including Food, Travel, Work, Family, Culture
- 📏 **Flexible Length**: 200-1000 words
- 🧠 **Comprehension Questions**: 5 questions testing story understanding
- 📚 **Grammar Questions**: 5 questions focusing on language mechanics  
- ✨ **Dynamic Titles**: AI-generated story titles in target language
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔒 **Secure**: Production-ready with security best practices

## 🏗️ Architecture & Deployment

### **Technology Stack**
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Single-Page App)
- **Backend**: Node.js + Express.js
- **AI Service**: Azure OpenAI GPT-4/GPT-4o
- **Container**: Docker with Alpine Linux
- **Cloud**: Azure App Service, Azure Container Instances/Apps
- **Infrastructure**: Bicep (Infrastructure as Code)
- **Authentication**: Azure Managed Identity + API Key fallback

### **Deployment Options**
1. **🐳 Docker Containers** - Ready-to-run images on Docker Hub
2. **☁️ Azure App Service** - Fully managed cloud deployment 
3. **📦 Azure Container Instances** - Serverless containers
4. **⚡ Azure Container Apps** - Advanced scaling and management
5. **💻 Local Development** - Node.js development server

## 🚀 Deployment Methods

### 1. 🐳 **Docker Deployment (Recommended)**

#### Pull from Docker Hub
```bash
# Multi-language version
docker pull madedroo/foreign-language-stories:latest

# Russian-only version  
docker pull madedroo/russian-story-generator:latest
```

#### Docker Compose
```yaml
version: '3.8'
services:
  # Multi-language app
  foreign-stories:
    image: madedroo/foreign-language-stories:latest
    ports: ["3001:3000"]
    environment:
      - AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
      - AZURE_OPENAI_API_KEY=your-api-key
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o

  # Russian-only app
  russian-stories:
    image: madedroo/russian-story-generator:latest
    ports: ["3002:3000"]
    environment:
      - AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
      - AZURE_OPENAI_API_KEY=your-api-key
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

### 2. ☁️ **Azure Cloud Deployment**

#### Azure Developer CLI (azd)
```bash
# Clone and deploy multi-language version
git clone https://github.com/mddazure/tell-me-a-story.git
cd tell-me-a-story
azd up
```

#### Azure Container Instances
```bash
# Multi-language version
az container create \
  --resource-group myResourceGroup \
  --name foreign-language-stories \
  --image madedroo/foreign-language-stories:latest \
  --environment-variables AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  --secure-environment-variables AZURE_OPENAI_API_KEY="your-api-key" \
  --ports 3000

# Russian-only version
az container create \
  --resource-group myResourceGroup \
  --name russian-stories \
  --image madedroo/russian-story-generator:latest \
  --environment-variables AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  --secure-environment-variables AZURE_OPENAI_API_KEY="your-api-key" \
  --ports 3000
```

### 3. 💻 **Local Development**

#### Prerequisites
- Node.js 18+ 
- Azure OpenAI service
- Docker (optional)

#### Setup
```bash
# Clone repository
git clone https://github.com/mddazure/tell-me-a-story.git
cd tell-me-a-story

# Multi-language version
npm install
cp .env.example .env
# Edit .env with your Azure OpenAI credentials
npm run dev
# Open http://localhost:3000

# Russian-only version
cd russian-version
npm install  
cp .env.example .env
# Edit .env with your Azure OpenAI credentials
npm start
# Open http://localhost:3000
```

## ⚙️ Configuration

### **Required Environment Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint | `https://your-openai.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | `gpt-4o` |
| `AZURE_OPENAI_API_KEY` | API key (local dev) | `your-api-key-here` |

### **Optional Variables**
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Environment mode |
| `AZURE_CLIENT_ID` | - | Managed Identity ID (Azure deployment) |

### **Flexible Azure Infrastructure**
The Bicep templates support both **new** and **existing** Azure resources:

#### Create All New Resources (Default)
```bash
azd up  # Creates new App Service Plan, OpenAI service, etc.
```

#### Use Existing Resources
```bash
# Edit infra/main.parameters.existing.json with your resource names
azd deploy --parameters-file infra/main.parameters.existing.json
```

**Supported Existing Resources:**
- ✅ App Service Plans
- ✅ OpenAI Services  
- ✅ Resource Groups
- ✅ Cross-resource group deployments

## 🔒 Security & Production Features

### **Authentication Options**
- 🎯 **Azure Managed Identity** (Production) - No secrets required
- 🔑 **API Key Authentication** (Development) - For local testing
- 🔄 **Automatic Fallback** - Seamless authentication switching

### **Security Hardening**
- ✅ **HTTPS Enforcement** - All traffic encrypted
- ✅ **Content Security Policy** - XSS protection via Helmet.js  
- ✅ **CORS Configuration** - Cross-origin request control
- ✅ **Input Validation** - Sanitized user inputs
- ✅ **Non-root Containers** - Docker security best practices
- ✅ **Health Checks** - Built-in monitoring endpoints
- ✅ **Error Handling** - No information disclosure

### **Production Ready**
- 📊 **Health Monitoring** - `/health` endpoint for load balancers
- 🔧 **Graceful Shutdowns** - Proper process management
- 📝 **Structured Logging** - Application insights integration
- ⚡ **Performance Optimized** - Alpine Linux, production Node.js
- 🛡️ **Security Headers** - Complete protection suite

## 🌍 Supported Languages & Features

### **Multi-Language Version Languages**
- 🇪🇸 Spanish - 🇫🇷 French - 🇩🇪 German - 🇮🇹 Italian - 🇵🇹 Portuguese
- 🇳🇱 Dutch - 🇷🇺 Russian - 🇯🇵 Japanese - 🇰🇷 Korean - 🇨🇳 Chinese

### **Russian-Only Version Themes** 
- 🍽️ **Еда** (Food) - 🗺️ **Путешествия** (Travel) - 💼 **Работа** (Work)
- 👨‍👩‍👧‍👦 **Семья** (Family) - 🎨 **Хобби** (Hobbies) - 🌲 **Природа** (Nature)  
- 🏙️ **Город** (City) - ⚽ **Спорт** (Sports) - 🎭 **Культура** (Culture) - 💻 **Технологии** (Technology)

### **CEFR Proficiency Levels**
- **A1** - Beginner/Начальный
- **A2** - Elementary/Элементарный  
- **B1** - Intermediate/Средний (Default)
- **B2** - Upper-Intermediate/Выше среднего
- **C1** - Advanced/Продвинутый
- **C2** - Proficiency/Профессиональный

## 📊 Usage Analytics & Monitoring

### **Container Health Checks**
```bash
# Check container status
docker ps

# View health endpoint
curl http://localhost:3000/health

# Monitor container resources
docker stats container_name
```

### **Application Logs**
```bash
# View real-time logs
docker logs -f container_name

# Azure App Service logs
az webapp log tail --name app-name --resource-group rg-name

# Container Apps logs
az containerapp logs show --name app-name --resource-group rg-name
```

## 🗂️ Repository Structure

```
tell-me-a-story/
├── 📁 src/                          # Multi-language version
│   ├── 📄 server.js                 # Express server
│   └── 📁 public/                   # Frontend assets
│       ├── 📄 index.html           # Main UI
│       ├── 📄 script.js            # JavaScript logic
│       └── 🎨 styles.css           # Styling
├── 📁 russian-version/              # Russian-only version  
│   ├── 📄 package.json             # Russian app dependencies
│   ├── 🐳 Dockerfile               # Russian container build
│   └── 📁 src/                     # Russian app source
│       ├── 📄 server.js            # Russian-specific server
│       └── 📁 public/              # Russian frontend
├── 📁 infra/                        # Azure infrastructure
│   ├── 📄 main.bicep               # Infrastructure template
│   ├── 📄 main.parameters.json     # New resources config
│   └── 📄 main.parameters.existing.json # Existing resources config
├── 🐳 Dockerfile                   # Multi-language container
├── 🐳 docker-compose.yml           # Container orchestration
├── ⚙️ azure.yaml                   # Azure Developer CLI config
└── 📚 Documentation files
    ├── 📖 DEPLOYMENT.md             # Deployment guide
    ├── 🐳 DOCKER.md                 # Docker guide  
    └── 📋 DOCKER-HUB-README.md     # Docker Hub documentation
```

## 📚 Documentation

- **[📖 Deployment Guide](DEPLOYMENT.md)** - Complete Azure deployment instructions
- **[🐳 Docker Guide](DOCKER.md)** - Container usage and best practices  
- **[🇷🇺 Russian Version](russian-version/README.md)** - Russian-only app documentation
- **[📦 Docker Hub - Multi-Language](https://hub.docker.com/r/madedroo/foreign-language-stories)**
- **[📦 Docker Hub - Russian Only](https://hub.docker.com/r/madedroo/russian-story-generator)**

## 🎯 Use Cases

### **Educational Institutions**
- **Language Schools** - Multi-language support for diverse curricula
- **Universities** - Russian departments using specialized version
- **Online Learning Platforms** - Container-ready for scaling

### **Individual Learners**
- **Self-Study** - Personalized proficiency level progression
- **Immersive Learning** - Russian-only version for full immersion
- **Mobile Learning** - Responsive design for any device

### **Developers & Organizations**
- **Easy Integration** - Docker containers for existing infrastructure  
- **Cloud Deployment** - Azure-native with managed identity
- **Customization** - Open source for educational modifications

## 🔗 Links & Resources

- **🐙 GitHub Repository**: https://github.com/mddazure/tell-me-a-story
- **🐳 Docker Hub - Multi-Language**: https://hub.docker.com/r/madedroo/foreign-language-stories  
- **🇷🇺 Docker Hub - Russian Only**: https://hub.docker.com/r/madedroo/russian-story-generator
- **☁️ Azure OpenAI**: https://azure.microsoft.com/services/cognitive-services/openai-service/
- **📖 Azure Developer CLI**: https://learn.microsoft.com/azure/developer/azure-developer-cli/
- **🎓 CEFR Guidelines**: https://www.coe.int/en/web/common-european-framework-reference-languages

## 📄 License

**MIT License** - Free for educational and commercial use. See [LICENSE](LICENSE) file for details.

---

## 🎉 **Ready to Start Learning?**

### **Try Multi-Language Version:**
```bash
docker run -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/foreign-language-stories:latest
```
**Access:** http://localhost:3000

### **Try Russian-Only Version:**  
```bash
docker run -p 3001:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/" \
  -e AZURE_OPENAI_API_KEY="your-api-key" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/russian-story-generator:latest
```
**Access:** http://localhost:3001

*Note: You'll need Azure OpenAI credentials for full functionality*

**Изучайте языки через увлекательные истории! Learn languages through engaging stories!** 🌍📚✨