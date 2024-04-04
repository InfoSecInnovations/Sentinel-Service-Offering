import fs from 'fs-extra'
import path from 'path'
import convertSolutionRule from "./lib/convertSolutionRule.js"
import addRuleReference from './lib/addRuleReference.js'

// This script converts rule templates from the Azure GitHub to a form we can include in our template (or use standalone), and then links it from the parent template
// locate the template within the Solution on https://github.com/Azure/Azure-Sentinel for the Analytics Rule you wish to use. It will be in <SolutionName>/Package/mainTemplate.json.
// Inside the resource of type "Microsoft.OperationalInsights/workspaces/providers/contentTemplates" that contains the rule, copy paste the whole contents of the "mainTemplate" property into a file, then use this script as follows
// node convertAndAddRule.js mainTemplate linkedTemplate solutionId contentId ruleVersion
// mainTemplate: path to parent template
// linkedTempate: 
// solutionId: you can find this towards the top of the main template in the variables section
// contentId: inside the template there will be some numbered variables something like analyticRulecontentId5, you will find the value in the main variables section also
// ruleVersion: under the same number you used above you'll find a variable for the version of the rule template
// the script will copy the modified template to clipboard so you can double check the results before use if so desired

const mainTemplate = process.argv[2]
const linkedTemplate = process.argv[3]
const solutionId = process.argv[4]
const contentId = process.argv[5]
const ruleVersion = process.argv[6]

convertSolutionRule(linkedTemplate, solutionId, contentId, ruleVersion)
.then(converted => fs.writeFile(linkedTemplate, converted))
.then(() => {
  const relative = path.relative('..', linkedTemplate)
  const parts = relative.split(path.sep)
  const forwardSlashed = parts.join("/")
  const last = (() => {
    const split = parts[parts.length - 1].replace('.json', '').split('-')
    return split.map((part, i) => {
      if (i > 0) part = part.charAt(0).toUpperCase() + part.slice(1)
      return part
    }).join('')
  })()
  return addRuleReference(mainTemplate, forwardSlashed, last)
})
.then(added => fs.writeFile(mainTemplate, added))
.then(() => console.log(`
converted ${linkedTemplate} to compatible format

linked converted template from ${mainTemplate}
`))
