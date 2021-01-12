module.exports = (req, res, next) => {
    const count = require('../_lib/ccrud/count');
    let db = req.app.get('db');
    count(db, req.schemas[collection], collection, req.locals.query)
        .then(response => {
            res.locals[collection] = { count: response };
            next()
        }).catch(err => console.log(err))
}