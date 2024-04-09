import fs from 'fs-extra';

export default (mainTemplate, linkedTemplate, name) => fs.readJSON(mainTemplate).then(json => {
  name = name.slice(0, 40) // deployment names have a char limit of 64, 40 seems like a safe limit to be able to include the region in the name
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