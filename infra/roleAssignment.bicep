// Role assignment module for cross-resource group scenarios
@description('The principal ID of the web app managed identity')
param webAppPrincipalId string

@description('The name for the role assignment')
param roleAssignmentName string

// Role assignment
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: roleAssignmentName
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd') // Cognitive Services OpenAI User
    principalId: webAppPrincipalId
    principalType: 'ServicePrincipal'
  }
}
