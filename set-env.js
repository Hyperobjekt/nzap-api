const lineReplace = require('line-replace');
const MODE = process.env.MODE;

lineReplace({
  file: 'package.json',
  line: 7,
  text: `    "start": "MODE=${MODE} node server",`,
  addNewLine: true,
  callback: ({ file, line, text, replacedText, error }) => {
    console.log(`environment variables set: ${MODE}`)
  }
})