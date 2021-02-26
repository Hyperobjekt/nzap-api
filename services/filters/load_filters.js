const router = require('express').Router();
const _m = require('../../_middlewares');
const slug = require('slug');
// const data = require('../../_data/nzap_filters.json')
const setField = (req, field) => { req.locals.distinctField = field; return; }
const setup = (req, res, next) => { req.locals = { collection: 'scenarios' }; next(); }
const slugify = str => {
  if (!str || str === 'NA') return ''
  if (str.charAt(str.length - 1) === '+') return slug(`${str} positive`)
  if (str.charAt(str.length - 1) === '-') return slug(`${str} negative`)
  return slug(str)
}

const getOrder = (req, res, next) => {
  let db = req.app.get('db');
  let aggL1 = db.collection('scenarios').aggregate([
    { $group: { _id: { filter_level_1: '$filter_level_1', _filter_level_1: '$_filter_level_1', alt_l1: '$alt_l1' } } }
  ]).toArray();
  aggL1.then(results => {
    let l1Sorted = results.filter(e => e._id.filter_level_1 !== 'NA').sort((a, b) => a._id.alt_l1 < b._id.alt_l1 ? -1 : 1);
    console.log(l1Sorted)
  })
}

const capitalize = str => str.split(' ').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' ');

const getUsStates = (req, res, next) => {
  let db = req.app.get('db');
  let agg = db.collection('scenarios').aggregate([
    { $group: { _id: { geo: '$geo', _geo: '$_geo' } } }
  ]).toArray();
  agg.then(results => {
    res.locals.usStates = results.map(doc => ({ label: capitalize(doc._id.geo), slug: doc._id._geo }))
    next();
  })
}
const getYearsField = (req, res, next) => {
  let db = req.app.get('db');
  let agg = db.collection('scenarios').aggregate([
    { $group: { _id: { year: '$year', _year: '$_year' } } }
  ]).toArray();
  agg.then(results => {
    res.locals.years = results.sort((a, b) => a._id._year < b._id._year ? -1 : 1).map(doc => ({ label: doc._id.year.replace(/\D/g, ''), slug: doc._id._year }))
    next();
  })
}
const getScenariosField = (req, res, next) => {
  let db = req.app.get('db');
  let agg = db.collection('scenarios').aggregate([
    { $group: { _id: { scenario: '$scenario', _scenario: '$_scenario' } } }
  ]).toArray();
  agg.then(results => {
    res.locals.scenarios = results.map(doc => ({ label: doc._id.scenario, slug: doc._id._scenario }))
    next();
  })
}
const getFilterLevelOneField = (req, res, next) => {
  let db = req.app.get('db');
  let agg = db.collection('scenarios').aggregate([
    { $group: { _id: { filter_level_1: '$filter_level_1', _filter_level_1: '$_filter_level_1', alt_l1: '$alt_l1' } } }
  ]).toArray();
  agg.then(results => {
    res.locals.levelOneFilters = results
      .filter(e => e._id.filter_level_1 !== 'NA')
      .sort((a, b) => a._id.alt_l1 < b._id.alt_l1 ? -1 : 1)
      .map(doc => ({ label: doc._id.filter_level_1, slug: doc._id._filter_level_1 }))
    next();
  })
}

const assembleFilterLevelTwo = async (req, res, next) => {
  let db = req.app.get('db');
  let agg = db.collection('scenarios').aggregate([
    { $group: { _id: { filter_level_1: '$filter_level_1', _filter_level_1: '$_filter_level_1', filter_level_2: '$filter_level_2', _filter_level_2: '$_filter_level_2', alt_l1: '$alt_l1', alt_l2: '$alt_l2' } } }
  ]).toArray();
  agg.then(results => {
    res.locals.levelTwoFilters = results
      .filter(e => e._id.filter_level_2 !== 'NA')
      .sort((a, b) => a._id.alt_l2 < b._id.alt_l2 ? -1 : 1)
      .map(doc => ({
        label: doc._id.filter_level_2,
        slug: doc._id._filter_level_2,
        levelOneLabel: doc._id.filter_level_1,
        levelOneSlug: doc._id._filter_level_1
      }))
    next();
  })
}


const done = (req, res) => {
  res.status(200).json(res.locals);
}


router.get('/', setup,
  // UsStates (geo)
  getUsStates,
  // Years (year)
  getYearsField,
  // Scenarios (scenario)
  getScenariosField,
  // FilterLevelOne (scenario)
  getFilterLevelOneField,
  // // FilterLevelTwo (scenario)
  assembleFilterLevelTwo,
  done
);



module.exports = router;