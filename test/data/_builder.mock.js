const dream = require('dreamjs');
const schemas = require('../../_lib/schemas');
let passwords = ['thisisapassword', 'thisispassword', 'abCdeFg!']
dream.customType('array_of_ids', () => []);
dream.customType('password', () => passwords[Math.floor(Math.random() * passwords.length)]);
dream.customType('color', helper => helper.chance.color({ format: 'hex' }));

module.exports = (collection, amount = 1) => {
  let mock = {};
  const schema = schemas[collection].schema;
  dream.customType('match', () => {
    let matches = Object.keys(schema)
      .map(e => schema[e].type === 'match' ? schema[e].matches : null)
      .filter(e => e)[0]
    return matches[Math.floor(Math.random() * matches.length)];
  });
  dream.customType('array_of_strings', () => {
    let arrayOfStrings = Object.keys(schema)
      .map(e => {
        if (e === 'tags') return ['TEST']
        return null
      })
      .filter(e => e)[0];
    return arrayOfStrings || []
  });

  for (const key in schema) {
    const val = schema[key];
    if (val.type === 'id') continue;
    mock[key] = val.mockType || val.type;
  }
  dream.schema(collection, mock)
  return dream.useSchema(collection).generateRnd(amount).output();
}



