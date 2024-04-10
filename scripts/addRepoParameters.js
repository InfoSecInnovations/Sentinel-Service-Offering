import fs from "fs-extra"
import path from "path"

fs.readdir('../arm-templates', {recursive: true})
.then(files => Promise.all(files.filter(file => file.endsWith('.json')).map(async file => {
  const filePath = path.join('../arm-templates', file)
  const json = await fs.readJSON(filePath)
  if (json.variables && json.variables.isiSentinel) {
    json.parameters.repoName = {
      "type": "string",
      "defaultValue": "InfoSecInnovations/Sentinel-Service-Offering",
      "metadata": {
        "description": "GitHub repository containing the ARM templates Organization/Repo-Name."
      }
    }
    json.parameters.repoBranch = {
      "type": "string",
      "defaultValue": "main",
      "metadata": {
        "description": "Git branch containing the ARM templates."
      }
    }
    json.variables.isiSentinel = "[concat('https://raw.githubusercontent.com/', parameters('repoName'), '/', parameters('repoBranch'))]"
    json.resources.forEach(resource => {
      if (resource.type == "Microsoft.Resources/deployments" && 
      resource.properties.templateLink && 
      resource.properties.templateLink.uri && 
      resource.properties.templateLink.uri.startsWith("[uri(variables('isiSentinel')") && 
      resource.properties.templateLink.uri.split('/').length < 5 // bit of a magic numbery way to avoid passing the values down to the bottom level templates which won't have these parameters
    ) {
        resource.properties.parameters.repoName = {
          "value": "[parameters('repoName')]"
        }
        resource.properties.parameters.repoBranch = {
          "value": "[parameters('repoBranch')]"
        }
      }
    })
    await fs.writeJSON(filePath, json, {spaces: 2}) 
  }
})))