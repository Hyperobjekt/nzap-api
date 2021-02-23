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

const handleDuplicates = data => {
  let duplicates = [];
  let uniqueSubcategories = [];
  [...data.levelTwoFilters].map(e => e.slug).forEach(e => !uniqueSubcategories.includes(e) ? uniqueSubcategories.push(e) : duplicates.push(e))
  data.levelTwoFilters = data.levelTwoFilters.map(filter => {
    if (duplicates.includes(filter.slug)) return { ...filter, label: `${filter.label} (${filter.levelOneLabel})`, slug: `${filter.levelOneSlug}_${filter.slug}` }
    return { ...filter }
  })
  return data;
}

const assembleAndMapLevelTwoFilters = (output, data) => {
  let tracker = []
  let levelTwoFilters = []
  for (let i = 0; i < output.levelOneFilters.length; i++) {
    data.sort((a, b) => a._alt_l2 < b._alt_l2 ? -1 : 1).filter(e => e.filter_level_1 === output.levelOneFilters[i].label && !!e.filter_level_2).forEach(e => {
      let trackerKey = `${e._filter_level_1}-${e._filter_level_2}`
      if (tracker.indexOf(trackerKey) === -1) {
        let filter = { l1: e.filter_level_1, l2: e.filter_level_2 }
        tracker.push(trackerKey)
        levelTwoFilters.push(filter)
      }
    })
    output.levelTwoFilters = levelTwoFilters.map(e => { return { label: e.l2, slug: slugify(e.l2), levelOneLabel: e.l1, levelOneSlug: slugify(e.l1) } })
  }

  return saveOutput(handleDuplicates(output));
}

const processData = dataString => {
  let tempLevelOneFilters = [];
  let data = JSON.parse(dataString).sort((a, b) => a._alt_l1 < b._alt_l1 ? -1 : 1)
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
  return assembleAndMapLevelTwoFilters(output, data)
}

fs.readFile(path, async (err, data) => (err) ? console.error(err) : processData(data))
