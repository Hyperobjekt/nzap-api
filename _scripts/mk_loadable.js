const fs = require('fs');
let data = require('../_data/nzap_data.json');
let jsData = `var scenarios = ${JSON.stringify(data)}`
fs.writeFileSync('_data/nzap_data.js', jsData)