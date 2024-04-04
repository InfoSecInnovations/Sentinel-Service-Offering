import clipboard from 'clipboardy'
import addRuleReference from './lib/addRuleReference.js';

// This script adds a resource for an Analytics Rule that uses our standard template format to a parent template
// usage:
// node addRuleReference.js mainTemplate linkedTemplate name
// mainTemplate: local path to the file you wish to modify
// linkedTemplate: path relative to repo root of template to link i.e. arm-templates/packs/<pack-type>/<pack-name>/rules/<rule-name>.json
// name: deployment name, can be whatever you want so long as it's unique, however, we recommend using the name of the rule or a shortened version that still indicates which rule it is

const mainTemplate = process.argv[2]
const linkedTemplate = process.argv[3]
const name = process.argv[4]

addRuleReference(mainTemplate, linkedTemplate, name)
.then(str => clipboard.write(str))
.then(() => console.log("Linked Analytics Rule template added to main template and copied to clipboard!"))