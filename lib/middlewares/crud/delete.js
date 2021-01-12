const mongo = require('../../mongo');

const DeleteCrud = function (db, query, skip, limit, schema, populate) {
    this.db = db;
    this.schema = schema;
    this.query = query;
}

DeleteCrud.prototype.delete = function (cb) {
    const options = {
        collection: this.schema.collection,
        query: this.query,
        schema: this.schema.schema
    }
    mongo.delete(this.db, options, response => cb(response))
    return this;
}


module.exports = (req, res, next) => {

    const db = req.app.get('db');
    const schema = req.locals.dynamicSchema || require(`./../../../api/v1/schemas/${req.params.route}.schema`);
    req.locals.populate = req.query.populate === 'true';
    let deleteObject = new DeleteCrud(db, req.locals.query, req.locals.skip, req.locals.limit, schema, req.locals.populate);

    /**THE COMMENTED OUT CODE IS TO LIMIT TO DELETE BY ID ONLY... I REMOVED THIS... */
    // let hasOneQuery = Object.keys(req.locals.query).length === 1;
    // let isQueryById = Object.keys(req.locals.query)[0] === '_id';

    // if (!hasOneQuery || !isQueryById) return next();
    // if (hasOneQuery && isQueryById) {
    return deleteObject.delete(response => {
        const obj = {};
        obj[schema.collection] = response;
        res.locals.results = obj;
        return next();
    });
    // }


};
