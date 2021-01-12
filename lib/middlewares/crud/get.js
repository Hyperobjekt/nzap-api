const mongo = require('../../mongo');

const GetCrud = function (db, query, skip, limit, schema, populate) {
    this.db = db;
    this.schema = schema;
    this.query = query;
    this.skip = skip;
    this.limit = limit;
    this.populate = populate;
}

GetCrud.prototype.find = function (cb) {
    const options = {
        collection: this.schema.collection,
        query: this.query,
        schema: this.schema.schema,
        skip: this.skip,
        limit: this.limit
    }

    this.populate
        ? mongo.getAndPopulate(this.db, options, response => cb(response))
        : mongo.find(this.db, options, response => cb(response))
    return this;
}


module.exports = (req, res, next) => {

    const db = req.app.get('db');
    const schema = req.locals.dynamicSchema || require(`./../../../api/v1/schemas/${req.params.route}.schema`);
    req.locals.populate = req.query.populate === 'true' || req.query.populate === true;
    let getObject = new GetCrud(db, req.locals.query, req.locals.skip, req.locals.limit, schema, req.locals.populate);

    return getObject.find(response => {
        const obj = {};
        obj[schema.collection] = response;
        res.locals.results = obj;
        return next();
    });
};
