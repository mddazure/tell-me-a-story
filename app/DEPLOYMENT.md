# Deployment Guide for Foreign Language Stories App

## Overview
This application is deployed to Azure App Service and integrates with Azure OpenAI for story and question generation. The Bicep infrastructure supports both creating new resources and using existing ones.

## Deployment Architecture

### Application Components
- **Azure App Service**: Hosts the Node.js Express application
- **Azure OpenAI Service**: Provides GPT-4 capabilities for story generation
- **App Service Plan**: Compute resources for the web application
- **Managed Identity**: Enables secure authentication between services

### Deployment Options

#### Option 1: Create All New Resources (Default)
This is the standard deployment that creates all resources from scratch.

**Parameters file**: `infra/main.parameters.json`
```json
{
  "createNewAppServicePlan": { "value": true },
  "createNewOpenAiService": { "value": true }
}
```

#### Option 2: Use Existing Resources
This option allows you to deploy the web app using existing App Service Plan and/or OpenAI service.

**Parameters file**: `infra/main.parameters.existing.json`
```json
{
  "createNewAppServicePlan": { "value": false },
  "appServicePlanName": { "value": "your-existing-plan" },
  "appServicePlanResourceGroup": { "value": "your-existing-rg" },
  "createNewOpenAiService": { "value": false },
  "openAiServiceName": { "value": "your-existing-openai" },
  "openAiResourceGroup": { "value": "your-existing-rg" }
}
```

## How the Application is Deployed to App Service

### 1. Azure Developer CLI (azd) Workflow
The deployment uses Azure Developer CLI for orchestrated deployment:

```bash
# Preview deployment changes
azd provision --preview

# Deploy infrastructure and application
azd up
```

### 2. Infrastructure Deployment (Bicep)
The `infra/main.bicep` template creates:

- **App Service Plan** (conditional creation based on `createNewAppServicePlan`)
- **Web App** with system-assigned managed identity
- **Azure OpenAI Service** (conditional creation based on `createNewOpenAiService`)
- **Role Assignments** for secure service-to-service authentication

### 3. Application Build and Package
The `azure.yaml` configuration defines the build process:

```yaml
services:
  web:
    project: .
    language: js
    host: appservice
    hooks:
      prepackage:
        shell: npm install --production
```

**Build Steps:**
1. `npm install --production` - Installs only production dependencies
2. Creates deployment package excluding `node_modules`, `.env`, and other non-essential files
3. Uploads package to Azure App Service

### 4. Runtime Configuration
The web app is configured with:

- **Node.js 18 LTS runtime**
- **Environment Variables**:
  - `AZURE_OPENAI_ENDPOINT`: OpenAI service endpoint
  - `AZURE_OPENAI_DEPLOYMENT_NAME`: Model deployment name
  - `AZURE_CLIENT_ID`: Managed identity client ID
- **HTTPS enforcement**
- **Security headers** via Helmet.js

### 5. Authentication Flow
The application uses **Managed Identity** for secure Azure OpenAI access:

1. Web App has system-assigned managed identity
2. Role assignment grants "Cognitive Services OpenAI User" role
3. Application uses `DefaultAzureCredential` or API key fallback
4. No secrets stored in application code

## Deployment Commands

### New Resources Deployment
```bash
# Using default parameters (creates new resources)
azd provision --preview
azd up
```

### Existing Resources Deployment
```bash
# Using custom parameters file for existing resources
azd provision --preview --parameters-file infra/main.parameters.existing.json
azd deploy
```

### Manual Bicep Deployment
```bash
# Resource group deployment
az deployment group create \
  --resource-group your-rg \
  --template-file infra/main.bicep \
  --parameters @infra/main.parameters.existing.json
```

## Environment Variables

### Required in Azure App Service
- `AZURE_OPENAI_ENDPOINT` - Set automatically by Bicep template
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Set automatically by Bicep template

### Optional (for local development)
- `AZURE_OPENAI_API_KEY` - API key for local testing
- `PORT` - Port number (defaults to 3000)

## Monitoring and Troubleshooting

### Application Logs
```bash
# Stream live logs
az webapp log tail --name your-app-name --resource-group your-rg

# Download log files
azd deploy app logs get
```

### Health Check
The application provides a simple health check at the root endpoint (`/`) which serves the main HTML page.

### Common Issues
1. **OpenAI Authentication**: Ensure managed identity has proper role assignment
2. **Model Deployment**: Verify the deployment name matches the OpenAI service
3. **Dependencies**: Check that all npm packages installed correctly during build

## Security Considerations

- **HTTPS Only**: Enforced at App Service level
- **CORS**: Configured for same-origin requests
- **CSP Headers**: Content Security Policy via Helmet.js
- **No Hardcoded Secrets**: Uses Managed Identity or Key Vault
- **Least Privilege**: Role assignments with minimum required permissions