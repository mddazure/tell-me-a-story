# Foreign Language Story Generator

A web application that generates foreign language stories at different proficiency levels and provides comprehension and grammar questions using Azure OpenAI.

## Features

- 🌍 **Multi-language Support**: Generate stories in 10+ languages
- 📊 **Proficiency Levels**: Choose from A1 (Beginner) to C2 (Mastery) levels
- 📝 **Customizable Length**: Select word count from 100 to 1000 words
- 🧠 **Comprehension Tests**: 5 multiple-choice questions about story content
- 📚 **Grammar Tests**: 5 multiple-choice questions about grammar usage
- 🎯 **Interactive Results**: Immediate feedback with correct answers

## Architecture

- **Frontend**: Single-page application with vanilla HTML/CSS/JavaScript
- **Backend**: Node.js/Express server for Azure OpenAI API integration
- **Deployment**: Azure App Service with managed identity authentication
- **AI Service**: Azure OpenAI for story and question generation

## Prerequisites

- Node.js 18 or higher
- Azure subscription
- Azure CLI or Azure Developer CLI (azd)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   AZURE_OPENAI_ENDPOINT=your-openai-endpoint
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment to Azure

### Using Azure Developer CLI (Recommended)

1. Install Azure Developer CLI
2. Initialize the project:
   ```bash
   azd init
   ```

3. Deploy to Azure:
   ```bash
   azd up
   ```

### Manual Deployment

1. Deploy infrastructure:
   ```bash
   az deployment group create \
     --resource-group your-rg \
     --template-file infra/main.bicep \
     --parameters infra/main.parameters.json
   ```

2. Deploy application code to the created App Service

## Configuration

The application uses managed identity to authenticate with Azure OpenAI, eliminating the need for API keys. The following environment variables are configured automatically:

- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI service endpoint
- `AZURE_OPENAI_DEPLOYMENT_NAME`: Model deployment name
- `AZURE_CLIENT_ID`: Managed identity client ID

## Security Features

- ✅ Managed Identity authentication
- ✅ HTTPS enforcement
- ✅ Content Security Policy
- ✅ Input validation and sanitization
- ✅ Rate limiting protection
- ✅ Error handling without information disclosure

## Supported Languages

- Spanish
- French
- German
- Italian
- Portuguese
- Dutch
- Russian
- Japanese
- Korean
- Chinese (Mandarin)

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Cloud**: Azure App Service, Azure OpenAI
- **Infrastructure**: Bicep (Infrastructure as Code)
- **Authentication**: Azure Managed Identity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details