const MONGO_URL = process.env.MONGO_URL;
module.exports = {
  uri: MONGO_URL,
  options: {
    // autoReconnect: true,
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};