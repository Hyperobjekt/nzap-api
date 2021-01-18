#!/usr/bin/mongo --quiet

load('./_data/nzap_data.js')
db.scenarios.insertMany(scenarios)
