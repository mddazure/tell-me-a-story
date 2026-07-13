# 🌍 Foreign Language Story Generator

AI-powered language learning applications that generate engaging stories with comprehension and grammar questions using Azure OpenAI. Available in two versions: **Multi-Language** and **Russian-Only**.

> **⚡ Latest Update (2024):** Applications updated for compatibility with newer GPT models (GPT-4o, GPT-4 Turbo). Now uses `maxCompletionTokens` parameter and default temperature. See [Model Compatibility](#model-compatibility) section for details.

## 🚀 **Status: Production Ready** ✅

Both applications are **fully functional** and deployed to Docker Hub:
- ✅ **Multi-Language Version**: Supporting 10+ languages with easy language selection
- ✅ **Russian-Only Version**: "Скажи мне рассказ" - specialized for Russian learners  
- ✅ **All Features Working**: Story generation, comprehension questions, grammar questions
- ✅ **Security Hardened**: CSP-compliant, production security headers
- ✅ **Docker Hub Ready**: Latest images available for immediate deployment

##  Quick Start with Docker

> **Note**: These applications use **Azure Managed Identity** for authentication. When deploying to Azure App Service or Container Instances, enable System Assigned Managed Identity and grant the "Cognitive Services OpenAI User" role to your Azure OpenAI resource.

### Multi-Language Version
```bash
docker run -d \
  --name foreign-language-stories \
  -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/foreign-language-stories:latest
```

### Russian-Only Version
```bash
docker run -d \
  --name skazhi-mne-rasskaz \
  -p 3001:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
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

## 🏗️ Architecture & How It Works

### **System Overview**

The Foreign Language Story Generator is a **full-stack web application** that combines **Azure OpenAI's GPT models** with a **Node.js backend** and **responsive frontend** to create an interactive language learning experience.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Web Browser   │───▶│  Node.js Server  │───▶│   Azure OpenAI      │
│  (Frontend UI)  │◀───│   (Backend API)  │◀───│   (GPT-4/GPT-4o)   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                         │
         │              ┌────────▼────────┐               │
         │              │  Static Assets  │               │
         │              │ (HTML/CSS/JS)   │               │
         └──────────────▶└─────────────────┘               │
                                                           │
                         ┌─────────────────────────────────┘
                         ▼
                 ┌───────────────────┐
                 │ Story Generation  │
                 │ Question Creation │  
                 │ Answer Validation │
                 └───────────────────┘
```

### **Application Flow**

#### **1. Story Generation Process**
```
User Input → Backend Processing → AI Generation → Response Formatting → Frontend Display
```

1. **User Selection**: User chooses language, proficiency level (A1-C2), theme, and word count
2. **API Request**: Frontend sends POST request to `/api/generate-story` with parameters
3. **Prompt Engineering**: Backend creates specialized prompts in target language
4. **Azure OpenAI Call**: Server sends structured prompt to GPT-4/GPT-4o
5. **Content Processing**: AI generates story with proper grammar and vocabulary level
6. **Title Generation**: Separate AI call creates appropriate title in target language
7. **Response Formatting**: Backend returns JSON with story, title, and metadata
8. **Frontend Rendering**: Story displayed with proper typography and formatting

#### **2. Interactive Question System**
```
Story Content → Question Generation → User Interaction → Answer Validation → Feedback
```

**Comprehension Questions:**
- AI analyzes story content for plot, characters, and key details
- Generates 5 multiple-choice questions testing reading comprehension
- Each question has 4 options (A/B/C/D or А/Б/В/Г for Russian)
- Questions focus on story understanding and inference

**Grammar Questions:**
- AI examines language structures used in the story
- Creates questions about verb tenses, sentence structure, vocabulary usage
- Targets specific grammar points relevant to the proficiency level
- Tests practical application of grammar rules in context

#### **3. Answer Checking & Feedback**
```
User Selections → Validation Logic → Visual Feedback → Score Calculation → Results Display
```

- **Real-time Selection**: Radio buttons allow single answer selection per question
- **Answer Validation**: JavaScript compares user selections with correct answers from AI
- **Color-coded Feedback**: 
  - 🟢 **Green**: Correct answer selected
  - 🔴 **Red**: Incorrect answer selected
  - 🔵 **Blue**: Correct answer highlighted when user was wrong
- **Score Calculation**: Percentage score with encouraging messages
- **Progress Tracking**: Visual feedback helps users learn from mistakes

### **Technology Stack**

#### **Frontend (Client-Side)**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Responsive design with flexbox/grid, custom animations
- **Vanilla JavaScript**: 
  - DOM manipulation and event handling
  - Fetch API for backend communication
  - Form validation and user interaction
  - Answer checking and visual feedback logic

#### **Backend (Server-Side)**
- **Node.js 18+**: Modern JavaScript runtime with async/await
- **Express.js**: Web framework for API endpoints and static file serving
- **Azure OpenAI SDK**: Official client library for GPT integration
- **Environment Configuration**: Secure credential management
- **Error Handling**: Comprehensive logging and graceful error responses

#### **AI Integration**
- **Azure OpenAI Service**: Enterprise-grade AI platform
- **GPT-4/GPT-4o Models**: Advanced language understanding and generation
- **Structured Prompting**: Carefully crafted prompts for consistent output
- **JSON Response Parsing**: Reliable data extraction and validation
- **Multi-language Support**: Native handling of 10+ languages

#### **Security & Production Features**
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Helmet.js**: Security headers and best practices
- **Azure Managed Identity**: Secure cloud authentication (System Assigned)
- **No API Keys**: Keyless authentication using Azure RBAC
- **Input Validation**: Sanitization of user inputs
- **Error Boundaries**: Graceful handling of failures

### **Data Flow Architecture**

#### **Request-Response Cycle**
```javascript
// 1. User interaction triggers request
const storyData = {
  language: 'Russian',
  proficiency: 'B1',  
  theme: 'семья',
  wordCount: 500
};

// 2. Frontend sends API request
const response = await fetch('/api/generate-story', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(storyData)
});

// 3. Backend processes and calls Azure OpenAI
const prompt = `Create a ${proficiency} level ${language} story about ${theme}...`;
const aiResponse = await openAIClient.getChatCompletions(deploymentName, messages);

// 4. Response returned to frontend
const result = {
  story: "Generated story content...",
  title: "Story title",
  questions: [/* question objects */]
};
```

#### **State Management**
- **Frontend State**: JavaScript classes manage current story, questions, and user selections
- **Session Persistence**: Stories and questions remain available during browser session
- **No Database**: Stateless architecture - all data is ephemeral and AI-generated

### **Multi-Version Architecture**

#### **Multi-Language Version**
- **Universal Backend**: Handles all supported languages dynamically
- **Language Detection**: Automatic prompt generation based on selected language
- **Unified Interface**: English UI with language-specific content generation

#### **Russian-Only Version**
- **Specialized Backend**: Optimized specifically for Russian language processing
- **Immersive Interface**: Complete Russian UI for full language immersion
- **Cultural Customization**: Russia-specific themes and cultural context
- **Cyrillic Optimization**: Proper handling of Russian typography and formatting

### **Deployment Options**
1. **🐳 Docker Containers** - Ready-to-run images on Docker Hub
2. **☁️ Azure App Service** - Fully managed cloud deployment 
3. **📦 Azure Container Instances** - Serverless containers
4. **⚡ Azure Container Apps** - Advanced scaling and management
5. **💻 Local Development** - Node.js development server

### **Infrastructure as Code**
- **Bicep Templates**: Declarative Azure resource definitions
- **Azure Developer CLI**: Streamlined deployment workflow
- **Parameter Files**: Environment-specific configurations
- **Resource Management**: Automated provisioning and updates

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
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
    # Note: Uses Azure Managed Identity for authentication

  # Russian-only app
  russian-stories:
    image: madedroo/russian-story-generator:latest
    ports: ["3002:3000"]
    environment:
      - AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
      - AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
    # Note: Uses Azure Managed Identity for authentication
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
                          AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  --assign-identity --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.CognitiveServices/accounts/<openai-name> \
  --role "Cognitive Services OpenAI User" \
  --ports 3000

# Russian-only version
az container create \
  --resource-group myResourceGroup \
  --name russian-stories \
  --image madedroo/russian-story-generator:latest \
  --environment-variables AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
                          AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  --assign-identity --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.CognitiveServices/accounts/<openai-name> \
  --role "Cognitive Services OpenAI User" \
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
cd app
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

### **Authentication**
Both applications use **Azure Managed Identity** (`DefaultAzureCredential`) for secure, keyless authentication. When deploying to Azure, enable System Assigned Managed Identity and grant the "Cognitive Services OpenAI User" role.

### **Required Environment Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint | `https://your-openai.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | `gpt-4o` |

### **Optional Variables**
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Environment mode |
| `AZURE_CLIENT_ID` | - | User Assigned Managed Identity client ID (if not using System Assigned) |

> **Note:** The `AZURE_OPENAI_TEMPERATURE` environment variable is no longer used. Newer GPT models (GPT-4o, GPT-4 2024 versions) only support the default temperature of 1.0 and do not accept custom temperature parameters.

### **Model Compatibility**

Both applications are **optimized for newer GPT models** and compatible with:

✅ **Recommended Models:**
- `gpt-4o` (GPT-4 Omni)
- `gpt-4o-mini`
- `gpt-4` (2024-* versions)
- `gpt-4-turbo`

🔧 **Recent Updates for Model Compatibility:**
- Uses `maxCompletionTokens` parameter (newer models)
- Removed custom `temperature` and `topP` parameters (only default temperature=1.0 is supported)
- Optimized for Azure OpenAI API version `2024-02-15-preview` and later

⚠️ **Legacy Model Note:**
If using older GPT-3.5 or GPT-4 models that support temperature configuration, you may need to modify the source code to add back the temperature parameter. The current version is optimized for latest model deployments.

### **Flexible Azure Infrastructure**
The Bicep templates support both **new** and **existing** Azure resources:

#### Create All New Resources (Default)
```bash
azd up  # Creates new App Service Plan, OpenAI service, etc.
```

#### Use Existing Resources
```bash
# Edit app/infra/main.parameters.existing.json with your resource names
azd deploy --parameters-file app/infra/main.parameters.existing.json
```

**Supported Existing Resources:**
- ✅ App Service Plans
- ✅ OpenAI Services  
- ✅ Resource Groups
- ✅ Cross-resource group deployments

## 🔒 Security & Production Features

### **Authentication**
- 🎯 **Azure Managed Identity** - Keyless authentication using `DefaultAzureCredential`
- 🔐 **System Assigned Identity** - Recommended for Azure App Service / Container Apps
- 🆔 **User Assigned Identity** - Supported via `AZURE_CLIENT_ID` environment variable

### **Security Hardening**
- ✅ **HTTPS Enforcement** - All traffic encrypted
- ✅ **Content Security Policy** - XSS protection via Helmet.js  
- ✅ **CORS Configuration** - Cross-origin request control
- ✅ **Input Validation** - Sanitized user inputs
- ✅ **Non-root Containers** - Docker security best practices
- ✅ **Health Checks** - Built-in monitoring endpoints
- ✅ **Error Handling** - No information disclosure

### **Production Ready**
- 📊 **Health Monitoring** - `/api/health` endpoint for load balancers
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
curl http://localhost:3000/api/health

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
├── � README.md                     # This documentation
├── ⚙️ azure.yaml                   # Azure Developer CLI config
└── �📁 app/                          # Application code and resources
    ├── 📁 src/                      # Multi-language version
    │   ├── 📄 server.js             # Express server
    │   └── 📁 public/               # Frontend assets
    │       ├── 📄 index.html       # Main UI
    │       ├── 📄 script.js        # JavaScript logic
    │       └── 🎨 styles.css       # Styling
    ├── 📁 russian-version/          # Russian-only version  
    │   ├── 📄 package.json         # Russian app dependencies
    │   ├── 🐳 Dockerfile           # Russian container build
    │   └── 📁 src/                 # Russian app source
    │       ├── 📄 server.js        # Russian-specific server
    │       └── 📁 public/          # Russian frontend
    ├── 📁 infra/                    # Azure infrastructure
    │   ├── 📄 main.bicep           # Infrastructure template
    │   ├── 📄 main.parameters.json # New resources config
    │   └── 📄 main.parameters.existing.json # Existing resources config
    ├── 🐳 Dockerfile               # Multi-language container
    ├── 🐳 docker-compose.yml       # Container orchestration
    ├── 📄 package.json             # Main app dependencies
    └── 📚 Documentation files
        ├── 📖 DEPLOYMENT.md         # Deployment guide
        ├── 🐳 DOCKER.md             # Docker guide  
        └── 📋 DOCKER-HUB-README.md # Docker Hub documentation
```

## 📚 Documentation

- **[📖 Deployment Guide](app/DEPLOYMENT.md)** - Complete Azure deployment instructions
- **[🐳 Docker Guide](app/DOCKER.md)** - Container usage and best practices  
- **[🇷🇺 Russian Version](app/russian-version/README.md)** - Russian-only app documentation
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
# On Azure with Managed Identity
docker run -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/foreign-language-stories:latest
```
**Access:** http://localhost:3000

### **Try Russian-Only Version:**  
```bash
# On Azure with Managed Identity
docker run -p 3001:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  madedroo/russian-story-generator:latest
```
**Access:** http://localhost:3001

> **Note:** These containers use Azure Managed Identity for authentication. Deploy to Azure App Service, Container Apps, or ACI with System Assigned Managed Identity enabled.

**Изучайте языки через увлекательные истории! Learn languages through engaging stories!** 🌍📚✨