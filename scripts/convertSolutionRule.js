import clipboard from 'clipboardy'
import convertSolutionRule from './lib/convertSolutionRule.js';

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

convertSolutionRule(filename, solutionId, contentId, ruleVersion)
.then(str => clipboard.write(str))
.then(() => console.log("Formatted Analytics Rule template copied to clipboard!"))