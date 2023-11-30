import fs from 'fs-extra';

fs.readJSON(process.argv[2]).then(json => {
  delete json.fallbackResourceIds
  const str = JSON.stringify(json)
  const serialized = str.replace(/"|\\/gi, '\\$&')
  console.log(serialized)
})