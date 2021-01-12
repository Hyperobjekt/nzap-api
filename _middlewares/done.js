module.exports = (req, res) => {
  let collection = req.baseUrl.split('/')[2];
  if (!req.body) req.body = {};
  if (!req.locals) req.locals = {};

  switch (req.method) {
    case 'GET':
      return !res.locals[collection].length
        ? res.status(404).send({ message: `no ${collection} found`, query: req.locals.query })
        : res.status(200).send(res.locals[collection])

    case 'POST':
      return !res.locals[collection].length
        ? res.status(404).send({ message: `no ${collection} found`, query: req.locals.query })
        : res.status(200).send(res.locals[collection])

    default:
      break;
  }





}