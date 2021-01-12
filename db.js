const { MongoClient } = require('mongodb');
const { uri, options } = require('./config/db.config');

module.exports = async () => {
  const client = new MongoClient(uri, options);
  console.log('\n\nStarting NZAP API\n===============');
  try {
    await client.connect();
    const db = client.db();
    console.log('☑ Database Connected');
    return db;
  } catch (err) {
    throw new Error('Error on DB connection >>>', err, '<<<')
  };
}
