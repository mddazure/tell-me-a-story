# 🇷🇺 Скажи мне рассказ (Tell Me a Story)

## Russian Language Learning Through AI Stories

A specialized Russian-only version of the Foreign Language Stories application that generates engaging Russian stories with comprehension and grammar questions using Azure OpenAI.

### 🌟 Features

- **Russian-Only Interface**: Fully localized in Russian language
- **Russian Flag Header**: Beautiful banner with "Скажи мне рассказ" 
- **Proficiency Levels**: A1 to C2 (CEFR standard)
- **Themed Stories**: 10 different themes (Food, Travel, Work, Family, etc.)
- **Proper Cyrillic Typography**: Uses only printed Cyrillic characters (печатные буквы)
- **Interactive Questions**: Comprehension and grammar exercises in Russian
- **Word Count Options**: 200 to 1000 words
- **Responsive Design**: Works on all devices

### 🚀 Quick Start

> **Authentication**: This application uses **Azure System Assigned Managed Identity** for secure, keyless authentication. When deploying to Azure, enable managed identity and grant the "Cognitive Services OpenAI User" role.

#### Using Docker
```bash
# Build the image
docker build -t russian-story-generator .

# Run with environment variables (no API key needed)
docker run -d \
  --name skazhi-mne-rasskaz \
  -p 3002:3000 \
  -e AZURE_OPENAI_ENDPOINT="https://your-openai.openai.azure.com/" \
  -e AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
  russian-story-generator
```

#### Using Docker Compose
```bash
# Set your environment variables in docker-compose.yml or .env file
docker-compose up -d
```

#### Local Development
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Azure OpenAI credentials
# Then start the server
npm start
```

### 🔧 Configuration

#### Required Environment Variables
| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI service endpoint |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name (e.g., gpt-4o) |

#### Authentication
This application uses **Azure System Assigned Managed Identity** for secure authentication:
- No API keys required
- Enable System Assigned Identity on your Azure resource (App Service, Container Instance, etc.)
- Grant "Cognitive Services OpenAI User" role to the managed identity on your Azure OpenAI resource

#### Optional Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Environment mode |

### 🎯 Usage

1. **Open**: http://localhost:3002 (if using Docker) or http://localhost:3000 (local)
2. **Select Settings**:
   - **Уровень**: Choose your proficiency level (A1-C2)
   - **Тема**: Select story theme
   - **Слова**: Choose word count
3. **Generate**: Click "Создать рассказ" to generate a Russian story
4. **Practice**: Use the question buttons for comprehension and grammar exercises

### 📚 Available Themes (Темы)

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

### 🏗️ Architecture

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **AI**: Azure OpenAI GPT-4
- **Container**: Docker with Alpine Linux
- **Security**: Helmet.js, CORS, CSP headers

### 🔒 Security Features

- Non-root user execution
- Content Security Policy
- Input validation
- Rate limiting ready
- Secure environment variable handling

### 🌐 Differences from Main App

This Russian version differs from the main multilingual app:

1. **No Language Selection**: Russian is hardcoded
2. **Russian Interface**: All text in Russian
3. **Russian Flag**: Prominent display with app name
4. **Cyrillic Focus**: Enhanced Russian character handling
5. **Cultural Themes**: Russia-focused content themes
6. **Simpler UI**: Streamlined for single-language use

### 📦 Docker Hub

The image is available on Docker Hub:
```bash
docker pull madedroo/russian-story-generator:latest
```

### 🔗 Related Projects

- **Main App**: Multi-language version at `/tell-me-a-story`
- **Docker Hub**: [madedroo/foreign-language-stories](https://hub.docker.com/r/madedroo/foreign-language-stories)

### 🤝 Contributing

Contributions are welcome! Please focus on:
- Russian language accuracy
- Cultural appropriateness
- Educational value
- UI/UX improvements

### 📄 License

MIT License - Feel free to use for educational purposes.

### 🎓 Educational Use

Perfect for:
- Russian language students (A1-C2 levels)
- Teachers creating lesson materials
- Self-study and practice
- Immersive learning experiences

---

**Изучайте русский язык через увлекательные истории!** 🇷🇺📚