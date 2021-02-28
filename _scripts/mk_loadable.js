const fs = require('fs');
let dataFiles = fs.readdirSync('_data/');
let files = dataFiles.filter(file => file.includes('batch') && file.includes('.json'))
let i = 0;

const makeFileLoadable = file => {
  let data = require(`../_data/${file}`);
  let jsData = `var scenarios = ${JSON.stringify(data)}`;
  fs.writeFileSync(`_data/${file.split('.')[0]}.js`, jsData);
  i = i + 1;
  if (i < files.length) return makeFileLoadable(files[i]);
  return;
}

makeFileLoadable(files[i]);