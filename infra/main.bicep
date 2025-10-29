// Parameters
@description('The name of the web app')
param appName string = 'foreign-language-stories-${uniqueString(resourceGroup().id)}'

@description('The location for all resources')
param location string = resourceGroup().location

@description('Whether to create a new App Service Plan or use an existing one')
param createNewAppServicePlan bool = true

@description('The name of the App Service Plan (existing or new)')
param appServicePlanName string = 'asp-${appName}'

@description('The resource group containing the existing App Service Plan (if using existing)')
param appServicePlanResourceGroup string = resourceGroup().name

@description('The SKU for the App Service Plan (only used when creating new)')
param appServicePlanSku string = 'B1'

@description('Whether to create a new Azure OpenAI service or use an existing one')
param createNewOpenAiService bool = true

@description('The Azure OpenAI service name')
param openAiServiceName string = 'openai-${uniqueString(resourceGroup().id)}'

@description('The resource group containing the existing OpenAI service (if using existing)')
param openAiResourceGroup string = resourceGroup().name

@description('The Azure OpenAI deployment name')
param openAiDeploymentName string = 'gpt-4'

@description('The Azure OpenAI model name')
param openAiModelName string = 'gpt-4'

@description('The Azure OpenAI model version')
param openAiModelVersion string = '2024-02-15-preview'

// Variables
var currentOpenAiService = createNewOpenAiService ? newOpenAiService : existingOpenAiService

// Existing App Service Plan (if using existing)
resource existingAppServicePlan 'Microsoft.Web/serverfarms@2023-01-01' existing = if (!createNewAppServicePlan) {
  name: appServicePlanName
  scope: resourceGroup(appServicePlanResourceGroup)
}

// New App Service Plan (if creating new)
resource newAppServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = if (createNewAppServicePlan) {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    tier: 'Basic'
  }
  properties: {
    reserved: false // Set to true for Linux
  }
}

// Web App
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: createNewAppServicePlan ? newAppServicePlan.id : existingAppServicePlan.id
    httpsOnly: true
    siteConfig: {
      nodeVersion: '18-lts'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '18.17.1'
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: currentOpenAiService.properties.endpoint
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT_NAME'
          value: openAiDeploymentName
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: ''
        }
      ]
      metadata: [
        {
          name: 'CURRENT_STACK'
          value: 'node'
        }
      ]
    }
  }
}

// Existing Azure OpenAI Service (if using existing)
resource existingOpenAiService 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = if (!createNewOpenAiService) {
  name: openAiServiceName
  scope: resourceGroup(openAiResourceGroup)
}

// New Azure OpenAI Service (if creating new)
resource newOpenAiService 'Microsoft.CognitiveServices/accounts@2023-05-01' = if (createNewOpenAiService) {
  name: openAiServiceName
  location: location
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: openAiServiceName
    publicNetworkAccess: 'Enabled'
    restrictOutboundNetworkAccess: false
  }
}

// Azure OpenAI Model Deployment (only create if creating new OpenAI service)
resource openAiDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = if (createNewOpenAiService) {
  parent: newOpenAiService
  name: openAiDeploymentName
  properties: {
    model: {
      format: 'OpenAI'
      name: openAiModelName
      version: openAiModelVersion
    }
    raiPolicyName: 'Microsoft.Default'
  }
  sku: {
    name: 'Standard'
    capacity: 30
  }
}

// Role assignment for Web App to access new OpenAI service
resource roleAssignmentNew 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (createNewOpenAiService) {
  name: guid(subscription().id, newOpenAiService.id, 'Cognitive Services OpenAI User')
  scope: newOpenAiService
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd') // Cognitive Services OpenAI User
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// Role assignment for Web App to access existing OpenAI service (using module for cross-resource group scenario)
module roleAssignmentExisting 'roleAssignment.bicep' = if (!createNewOpenAiService) {
  name: 'roleAssignmentExisting'
  scope: resourceGroup(openAiResourceGroup)
  params: {
    webAppPrincipalId: webApp.identity.principalId
    roleAssignmentName: guid(subscription().id, existingOpenAiService.id, 'Cognitive Services OpenAI User')
  }
}

// Outputs
output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output openAiServiceName string = currentOpenAiService.name
output openAiEndpoint string = currentOpenAiService.properties.endpoint
