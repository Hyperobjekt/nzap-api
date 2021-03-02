// https://net-zero-america.nn.r.appspot.com/v1/load_filters

const request = require('request');
const fs = require('fs')
const options = {
  'method': 'GET',
  'url': 'https://net-zero-america.nn.r.appspot.com/v1/load_filters',
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  fs.writeFileSync('_data/nzap_filters.json', response.body);
});
