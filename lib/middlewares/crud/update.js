const mongo = require('../../mongo');
const ObjectID = require('mongodb').ObjectID;

const UpdateCrud = function (db, query, data, schema) {
    this.db = db;
    this.schema = schema;
    this.query = query;
    this.data = data;
}

UpdateCrud.prototype.update = function (cb) {
    this.action = null // addToSet | pull
    this.many = this.query.many;

    delete this.query.action;
    delete this.query.many;

    const options = {
        collection: this.schema.collection,
        query: this.query,
        schema: this.schema.schema,
        data: this.data,
        action: this.action,
        many: this.many
    }
    mongo.update(this.db, options, response => {
       return cb(response)
    })
    return this;
}



module.exports = (req, res, next) => {

    const db = req.app.get('db');
    if (!req.locals) req.locals = {}
    const schema = req.locals.dynamicSchema || require(`./../../../api/v1/schemas/${req.params.route}.schema`);
    Object.keys(req.body).forEach(key => {
        if (key.includes('_ids')) req.body[key] = req.body[key].map(e => new ObjectID(e))
        if (key.includes('_id') && !key.includes('_ids')) req.body[key] = new ObjectID(req.body[key]);
    })
    let updateObject = new UpdateCrud(db, req.locals.query, req.body, schema);

    return updateObject.update(response => {
        const obj = {};
        obj[schema.collection] = response;
        res.locals.results = obj;
        return next();
    });
};
