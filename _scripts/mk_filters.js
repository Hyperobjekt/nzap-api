const fs = require('fs');
var slug = require('slug')
const path = process.argv[2]

// Extract usStates
// Extract levelOneFilters and levelTwoFilters

let output = { usStates: [], years: [], scenarios: [] };

const capitalize = str => {
  return str.split(' ').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' ')
}

const saveOutput = output => {
  fs.writeFileSync('_data/nzap_filters.json', JSON.stringify(output, 0, 2));
}

const slugify = str => {
  if (!str || str === 'NA') return ''
  if (str.charAt(str.length - 1) === '+') return slug(`${str} positive`)
  if (str.charAt(str.length - 1) === '-') return slug(`${str} negative`)
  return slug(str)
}

const extractLevelTwoFilters = (output, data) => {
  for (let i = 0; i < output.levelOneFilters.length; i++) {
    let levelTwoFilters = []
    data
      .filter(e => e.filter_level_1 === output.levelOneFilters[i].label && !!e.filter_level_2)
      .forEach(e => levelTwoFilters.indexOf(e.filter_level_2) === -1 ? levelTwoFilters.push(e.filter_level_2) : null)
    output.levelOneFilters[i].levelTwoFilters = levelTwoFilters.map(e => { return { label: e, slug: slugify(e) } })
  }
  return saveOutput(output);
}

const processData = dataString => {
  let tempLevelOneFilters = [];
  let data = JSON.parse(dataString);
  for (let i = 0; i < data.length; i++) {
    let state = capitalize(data[i].geo)
    let year = data[i].year.replace(/\D/g, '')
    if (output.usStates.indexOf(state) === -1) output.usStates.push(state);
    if (output.years.indexOf(year) === -1) output.years.push(year)
    if (output.scenarios.indexOf(data[i].scenario) === -1) output.scenarios.push(data[i].scenario)
    if (tempLevelOneFilters.indexOf(data[i].filter_level_1) === -1) tempLevelOneFilters.push(data[i].filter_level_1);
  }
  output.levelOneFilters = tempLevelOneFilters.map(e => { return { label: e, slug: slugify(e) } });
  output.usStates = output.usStates.map(e => ({ label: e, slug: slugify(e) }))
  output.years = output.years.map(e => ({ label: e, slug: slugify(e) }))
  output.scenarios = output.scenarios.map(e => ({ label: e, slug: slugify(e) }))
  return extractLevelTwoFilters(output, data)
}

fs.readFile(path, async (err, data) => (err) ? console.error(err) : processData(data))
