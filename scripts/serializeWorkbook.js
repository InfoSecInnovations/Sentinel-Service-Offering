import fs from 'fs-extra';
import clipboard from 'clipboardy'

fs.readJSON(process.argv[2]).then(json => {
  delete json.fallbackResourceIds
  const str = JSON.stringify(json)
  const serialized = str.replace(/"|\\/gi, '\\$&')
  clipboard.write(serialized).then(() => console.log('serialized data copied to clipboard!'))
})