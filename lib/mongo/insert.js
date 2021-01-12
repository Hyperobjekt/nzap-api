const moment = require('moment-timezone');
const findLimited = require('./find');
const TZ = process.env.TZ;
const NODE_ENV = process.env.NODE_ENV;

/**
 * Options:
 *  - collection (string)
 *  - query (object)
 *  - data (array)
 */
module.exports = (db, options, cb) => {
    const findOptions = { collection: options.collection, query: options.query, limit: 1 };

    const processResponse = (err, result) => {
        if (err) return cb({ status: 403, err: err });
        return cb({ status: 200, data: result });
    }

    const queryMongo = (db) => {
        if (options.data.length === 1) {
            options.data[0].created = moment().tz(TZ).format();
            options.data[0].environment = NODE_ENV;
        }
        if (options.data.length > 1) {
            options.data = options.data.map(e => {
                e.created = moment().tz(TZ).format();
                e.environment = NODE_ENV;
                return e;
            });
        }
        return db
            .collection(options.collection)
            .insertMany(options.data, { ordered: false }, processResponse);
    }

    const checkAndSave = (obj) => {
        return obj.status === 404 ?
            queryMongo(db) :
            cb({ status: 409, reason: "duplicate", query: options.query });
    }

    return options.query ? findLimited(db, findOptions, checkAndSave) : queryMongo(db);
}
