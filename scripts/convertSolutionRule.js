import fs from 'fs-extra';
import clipboard from 'clipboardy'

// filename solutionId contentId ruleVersion
const filename = process.argv[2]
const solutionId = process.argv[3]
const contentId = process.argv[4]
const ruleVersion = process.argv[5]

fs.readJSON(filename).then(json => {
  json.contentVersion = "1.0.0.0"
  json.parameters = {
    "workspaceName": {
      "type": "string"
    },
    "ruleId": {
      "type": "string",
      "defaultValue": "[newGuid()]",
      "metadata": {
        "description": "The unique guid for this Analytics Rule"
      }
    }
  }
  json.variables = {
    "contentId": contentId,
    "ruleResourceId": "[concat(resourceId('Microsoft.OperationalInsights/workspaces/providers', parameters('workspaceName'), 'Microsoft.SecurityInsights'),'/alertRules/', parameters('ruleId'))]",
    "ruleVersion": ruleVersion,
    "solutionId": solutionId
  }
  const ruleResource = json.resources[0]
  ruleResource.type = "Microsoft.OperationalInsights/workspaces/providers/alertRules"
  ruleResource.name = "[concat(parameters('workspaceName'),'/Microsoft.SecurityInsights/', parameters('ruleId'))]"
  ruleResource.apiVersion = "2022-11-01-preview"
  delete ruleResource.location
  ruleResource.properties.alertRuleTemplateName = "[variables('contentId')]"
  ruleResource.properties.incidentConfiguration = {
    "createIncident": true,
    "groupingConfiguration": {
      "enabled": false,
      "reopenClosedIncident": false,
      "lookbackDuration": "PT5H",
      "matchingMethod": "AllEntities",
      "groupByEntities": [],
      "groupByAlertDetails": [],
      "groupByCustomDetails": []
    }
  }
  ruleResource.properties.enabled = true
  const metadataResource = json.resources[1]
  metadataResource.name = "[concat(parameters('workspaceName'),'/Microsoft.SecurityInsights/',concat('AnalyticsRule-', last(split(variables('ruleResourceId'),'/'))))]"
  metadataResource.properties.parentId = "[variables('ruleResourceId')]"
  metadataResource.properties.contentId = "[variables('contentId')]"
  metadataResource.properties.version = "[variables('ruleVersion')]"
  metadataResource.properties.source.sourceId = "[variables('solutionId')]"
  delete metadataResource.properties.author
  const str = JSON.stringify(json, null, 2)
  clipboard.write(str).then(() => console.log("Formatted Analytics Rule template copied to clipboard!"))
})