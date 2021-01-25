const fs = require('fs');
const neatCsv = require('neat-csv');
const slug = require('slug');
const path = process.argv[2]

// Supply the path to a csv

const slugify = str => {
  if (!str || str === 'NA') return ''
  if (str.charAt(str.length - 1) === '+') return slug(`${str} positive`)
  if (str.charAt(str.length - 1) === '-') return slug(`${str} negative`)
  return slug(str)
}

const addIndexes = data => {
  Object.keys(data).forEach(key => {
    if (key !== 'id') data[`_${key}`] = slugify(data[key])
  })
  return data
}

// Output a JSON file
const processData = data => {
  let fileArray = path.split('/');
  let file = `${fileArray[fileArray.length - 1].split('.')[0]}.json`;
  fileArray.pop()
  let jsonFile = `${fileArray.join('/')}/${file}`;
  let indexed = data.map((e, i) => {
    let obj = { id: i + 1 }
    return { ...obj, ...e };
  }).map(e => addIndexes(e))
  fs.writeFileSync(jsonFile, JSON.stringify(indexed));
}

fs.readFile(path, async (err, data) => (err) ? console.error(err) : processData(await neatCsv(data)))

