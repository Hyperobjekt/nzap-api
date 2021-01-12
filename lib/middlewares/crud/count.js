const mongo = require('../../mongo');

const GetCrud = function (db, query, schema) {
    this.db = db;
    this.schema = schema;
    this.query = query;
}

GetCrud.prototype.find = function (cb) {
    const options = {
        collection: this.schema.collection,
        query: this.query,
        schema: this.schema.schema
    }

    mongo.count(this.db, options, response => cb(response))
    return this;
}


module.exports = (req, res, next) => {

    const db = req.app.get('db');
    if (!req.locals) req.locals = {}
    const schema = req.locals.dynamicSchema || require(`./../../../api/v1/schemas/${req.params.route}.schema`);
    let getObject = new GetCrud(db, req.locals.query, schema);

    return getObject.find(response => {
        const obj = {};
        obj[schema.collection] = response;
        res.locals.results = obj;
        return next();
    });
};



// const db = require('../../db');
// module.exports = (req, res, next) => {
//     res.locals.results = {};
//     const init = schema => {
//         let collection = schema.collection;
//         let query = req.query;
//         db.count(collection, query, response => {
//             if (response.status !== 200) {
//                 return res.status(response.status).json({message: response.data});
//             }
//             if (response.status === 200) {
//                 res.locals.results[collection] = response.data;
//                 return next()
//             }
//         })
//     };

//     req.schema.collections[req.params.route]
//         ? init(req.schema.collections[req.params.route])
//         : res.status(404).json({message: `Schema "${req.params.route}" does not exist`});
// };