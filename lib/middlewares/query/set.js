const ObjectID = require('mongodb').ObjectID;

const addSearchQuery = (schema, q) => {
    const quariables = ['string', 'array_of_strings', 'email', 'title'];
    const filteredQ = Object.keys(schema).filter(e => quariables.indexOf(schema[e].type) > -1);
    let qArray = filteredQ.map(e => {
        const obj = {};
        obj[e] = { $regex: q.toLowerCase(), $options: 'i' };
        return obj;
    });
    if (q.split(' ').length > 1) {
        let queryStringArray = q.split(' ');
        queryStringArray.forEach(e => {
            let queryLayer = filteredQ.map(ee => {
                const obj = {};
                obj[ee] = { $regex: e.toLowerCase(), $options: 'i' };
                return obj;
            });
            qArray = [...qArray, ...queryLayer]
        });

    }
    return { $or: qArray }
};


const formatObjectIds = query => {
    Object.keys(query).forEach(key => {
        if (key.includes('_ids')) return query[key] = query[key].map(id => ObjectID(id))
        if (key.includes('_id')) return query[key] = ObjectID(query[key])
    })
    return query;
}

const typeCastQuery = (schema, query) => {
    Object.keys(query).forEach(key => {
        if (schema.schema[key] && schema.schema[key].type === 'boolean') query[key] = query[key] === "!!" || query[key] === "true"
        if (schema.schema[key] && schema.schema[key].type === 'number') query[key] = Number(query[key])
    })
    return query;
}


const set = (req, res, next) => {
    if (!Object.keys(req.query).length && !!Object.keys(req.body).length) req.query = req.body;

    if (req.query.$and) req.query.$and = req.query.$and.map(e => formatObjectIds(e))
    if (req.query.$or) req.query.$or = req.query.$or.map(e => formatObjectIds(e))


    let searchQuery;
    let query = Object.assign({}, req.query);
    if (!req.locals) req.locals = {}
    const schema = req.locals.dynamicSchema || require(`../../../api/v1/schemas/${req.params.route}.schema`);
    query = typeCastQuery(schema, query)


    Object.keys(query).forEach(key => {
        if (query[key] === '!!') return query[key] = { $exists: true, $ne: "", $ne: null };
        if (query[key] === '!') return query[key] = null;
    })
    delete query.q;
    delete query.limit;
    delete query.skip;
    delete query.populate;

    Object.keys(query).forEach(key => {
        if (!schema.schema[key]) return;
        if (key === '_id') return query[key] = new ObjectID(query[key])
        if (query[key] === null) return;
        if (key.includes('_id') && Object.keys(query[key]).includes('$exists')) return;
        if (!!schema.schema[key].schema && key.includes('_ids')) return query[key] = query[key].map(e => new ObjectID(e))
        if (!!schema.schema[key].schema && key.includes('_id') && !key.includes('_ids')) return query[key] = new ObjectID(query[key])
    });

    if (!req.locals) req.locals = {};
    if (req.query.q) {
        searchQuery = addSearchQuery(schema.schema, req.query.q);
        req.locals.query = { $and: [searchQuery, query] }
    }
    if (!req.query.q) { req.locals.query = query }
    next();
}
module.exports = set;

