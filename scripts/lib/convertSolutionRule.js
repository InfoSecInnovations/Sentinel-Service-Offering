import fs from 'fs-extra'

// This script converts rule templates from the Azure GitHub to a form we can include in our template (or use standalone)
// locate the template within the Solution on https://github.com/Azure/Azure-Sentinel for the Analytics Rule you wish to use. It will be in <SolutionName>/Package/mainTemplate.json.
// Inside the resource of type "Microsoft.OperationalInsights/workspaces/providers/contentTemplates" that contains the rule, copy paste the whole contents of the "mainTemplate" property into a file, then use this script as follows
// node convertSolutionRule.js filename solutionId contentId ruleVersion
// filename: path to saved file
// solutionId: you can find this towards the top of the main template in the variables section
// contentId: inside the template there will be some numbered variables something like analyticRulecontentId5, you will find the value in the main variables section also
// ruleVersion: under the same number you used above you'll find a variable for the version of the rule template
// the script will copy the modified template to clipboard so you can double check the results before use if so desired

const filename = process.argv[2]
const solutionId = process.argv[3]
const contentId = process.argv[4]
const ruleVersion = process.argv[5]

export default (filename, solutionId, contentId, ruleVersion) => fs.readJSON(filename).then(json => {
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
  return JSON.stringify(json, null, 2)
})