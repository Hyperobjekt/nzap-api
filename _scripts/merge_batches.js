const fs = require('fs').promises,
  inspect = require('util').inspect;

let json = [];

const read = name => fs.readFile(name, 'utf8').then(data => {
  json = [...json, ...JSON.parse(data)]
  console.log(json.length)
});
const save = stuff => {

  fs.writeFile('./_data/nzap_data.json', JSON.stringify(json));
};

// inspect.defaultOptions = {
//   ...inspect.defaultOptions, ...{
//     depth: 100000,
//     colors: false
//   }
// };


fs.readdir('./_data').then(filesArr => {
  let files = filesArr.filter(file => file.includes('.json') && file.includes('_batch_')).map(e => `./_data/${e}`)
  Promise.all(files.map(read)).then(save);
})
