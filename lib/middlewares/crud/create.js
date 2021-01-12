const mongo = require('../../mongo');
const ObjectID = require('mongodb').ObjectID;
const API_VERSION = process.env.API_VERSION;

const pruneBody = (body, schema) => {
    const isBulk = Array.isArray(body);
    const schemaKeys = Object.keys(schema);
    if (!isBulk) {
        let data = {};
        const validBodyKeys = Object.keys(body).filter(key => schemaKeys.indexOf(key) > -1)
        validBodyKeys.forEach(key => data[key] = body[key])
        return data;
    }
    if (isBulk) {
        return body.map(e => {
            const obj = {};
            const validBodyKeys = Object.keys(e).filter(key => schemaKeys.indexOf(key) > -1);
            validBodyKeys.forEach(key => obj[key] = e[key]);
            return obj
        });
    }
}

const CrudCreate = function (db, body, schema) {
    this.db = db;
    this.body = pruneBody(body, schema.schema);
    this.schema = schema;
}


CrudCreate.prototype.save = function (cb) {
    const options = { collection: this.schema.collection };
    Array.isArray(this.body) ? options.query = null : options.query = this.body;
    Array.isArray(this.body) ? options.data = this.body : options.data = [this.body];

    mongo.insert(this.db, options, response => cb(response));
    return this;
}


module.exports = (req, res, next) => {
    let errorMessage;
    const db = req.app.get('db');
    if (!req.locals) req.locals = {}
    const schema = req.locals.dynamicSchema || require(`./../../../api/v1/schemas/${req.params.route}.schema`);

    const create = (data) => {
        if (!Array.isArray(data)) Object.keys(data).forEach((key) => {
            if (key.includes('_ids')) return data[key] = data[key].map(e => new ObjectID(e));
            if (key.includes('_id')) return data[key] = new ObjectID(data[key]);
        })
        if (!!Array.isArray(data)) {

            data.forEach((row, i) => {
                Object.keys(row).forEach(key => {
                    if (key.includes('_ids')) return data[i][key] = row[key].map(e => new ObjectID(e))
                    if (key.includes('_id')) return data[i][key] = new ObjectID(row[key])
                })
            })
        }
        const createObject = new CrudCreate(db, data, schema);

        if (!createObject.body) return res.status(403).json({ message: `Key / Value pairs are invalid` });
        if (createObject.body) return createObject.save(response => {
            const obj = {};
            response.data ? obj[schema.collection] = response.data.ops : obj[schema.collection] = response;
            res.locals.results = obj;
            return next();
        });
    }

    const validateFields = (schema, body) => {
        return Object.keys(schema.schema).map(key => {
            let validators = require(`../../../api/${API_VERSION}/schemas/validators/${schema.schema[key].type}`);
            let isRequired = key !== '_id' && schema.schema[key].required && (body[key] !== 0 && !body[key]);
            let isValid = key !== '_id' && validators.validate(body[key], schema.schema[key].matches);
            if (isRequired) return res.status(403).json({ message: `Field: '${key}' is required.` });
            if (!isValid && body[key]) {
                errorMessage = `Field: '${key}'= ${body[key]} is not a valid '${schema.schema[key].type}'`
                return 'fail';
            }
            return 'pass';
        }).filter(e => e === 'pass').length;

    }

    const init = (schema, isBulk) => {

        if (!isBulk) {
            return Object.keys(schema.schema).length === validateFields(schema, req.body) ? create(req.body) : res.status(404).json({ message: errorMessage });
        }
        if (isBulk) {
            const bodyPass = req.body
                .map(body => Object.keys(schema.schema).length === validateFields(schema, body) ? 'pass' : 'fail')
                .filter(e => e === 'pass').length
            bodyPass === req.body.length ? create(req.body) : res.status(403).json({ message: `Some thing went wrong with "${req.params.route}" route while trying to validate body fields: ${errorMessage}` });
        }
    };

    if (!req.locals.dynamicSchema && !req.schema[req.params.route]) return res.status(404).json({ message: `Schema "${req.params.route}" does not exist` });
    return init(req.locals.dynamicSchema || req.schema[req.params.route], Array.isArray(req.body))



}
