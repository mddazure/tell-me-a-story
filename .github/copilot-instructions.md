# Foreign Language Story Generator

This project is a web application that generates foreign language stories with comprehension and grammar questions using Azure OpenAI.

## Project Structure

- **Frontend**: Single-page application (HTML/CSS/JavaScript)
- **Backend**: Node.js Express server with Azure OpenAI integration
- **Infrastructure**: Azure Bicep templates for App Service and OpenAI
- **Deployment**: Azure Developer CLI (azd) configuration

## Development Setup

1. Install Node.js 18+
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and configure Azure OpenAI settings
4. Run `npm run dev` to start development server

## Deployment

Use `azd up` to deploy to Azure with infrastructure as code.