import fs from 'fs-extra';

export default (mainTemplate, linkedTemplate, name) => fs.readJSON(mainTemplate).then(json => {
  json.variables[`${name}Name`] = `[concat('${name}', '-', parameters('location'))]`
  json.resources.push({
    "name": `[variables('${name}Name')]`,
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2022-09-01",
    "properties": {
      "mode": "Incremental",
      "templateLink": {
        "uri": `[uri(variables('isiSentinel'), '${linkedTemplate}')]`,
        "contentVersion": "1.0.0.0"
      },
      "parameters": {
        "workspaceName": {
        "value": "[parameters('workspaceName')]"
        }
      }
    }
  })
  return JSON.stringify(json, null, 2)
})