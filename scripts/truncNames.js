import fs from "fs-extra"
import path from "path"

fs.readdir('../arm-templates', {recursive: true})
.then(files => Promise.all(files.filter(file => file.endsWith('deployment-template.json')).map(async file => {
  const filePath = path.join('../arm-templates', file)
  const json = await fs.readJSON(filePath)
  if (json.variables) {
    Object.entries(json.variables).forEach(([key, value]) => {
      json.variables[key] = value.replace(/(\[concat\(')(.*)(', '-', parameters\('location'\)\)\])/g, (match, g1, g2, g3) => g1 + g2.slice(0, 40) + g3)
    }) 
    await fs.writeJSON(filePath, json, {spaces: 2}) 
  }
})))