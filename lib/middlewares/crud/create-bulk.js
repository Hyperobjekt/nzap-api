const pluralize = require('pluralize');
const mongo = require('../../mongo');

const CrudCreate = function (db, body, schema) {
    this.db = db;
    this.body = body;
    this.schema = schema;
}

CrudCreate.prototype.save = function (cb) {
    const options = { collection: this.schema.collection };
    Array.isArray(this.body) ? options.query = null : options.query = this.body;
    Array.isArray(this.body) ? options.data = this.body : options.data = [this.body];

    mongo.insert(this.db, options, response => {
        cb(response);
    });
    return this;
}


module.exports = (req, res, next) => {
    const db = req.app.get('db');
    const API_VERSION = process.env.API_VERSION;
    // const schema = require(`./../../../api/v1/schemas/${req.params.route}.schema`);

    const init = schema => {
        let body = req.body;
        let collection = schema.collection;
        let schemaKeys = Object.keys(schema.schema);


        body.forEach((data, index) => {
            schemaKeys.forEach((key, i) => {



            })
        })


        body.forEach((data, index) => {
            schemaKeys.forEach((e, i) => {
                let type = schema.schema[e].type;
                let validators = require(`../../../api/${API_VERSION}/schemas/validators/${type}`);
                let isRequired = e !== '_id' && schema.schema[e].required && !data[e];
                isValid = e !== '_id' && validators.validate(data[e], schema.schema[e].matches);



                if (isRequired) {
                    return res.status(403).json({ message: `Field: '${e}' is required.` });
                }
                if (!isValid && data[e]) {
                    return res.status(403).json({ message: `Field: '${e}' is not a valid '${type}': (${data[e]}).`, data: data });
                }
                if (i === schemaKeys.length - 1 && index === body.length - 1) {
                    const createObject = new CrudCreate(db, body, schema);
                    return createObject.save(response => {
                        const obj = {};
                        obj[schema.collection] = response;
                        res.locals.results = obj;
                        return next();
                    });
                }
            });
        });




    };

    req.schema[req.params.route]
        ? init(req.schema[req.params.route])
        : res.status(404).json({ message: `Schema "${req.params.route}" does not exist` });
}
