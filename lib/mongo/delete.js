/**
 * Options:
 *  - collection (string)
 *  - query (object)
 */
module.exports = (db, options, cb) => {
    const processResponse = (err, result) => {
        if (err) return cb({ status: 403, err: err });
        return cb({ status: 200, data: result });
    }
    const { collection, query } = options;

    return db
        .collection(collection)
        .deleteMany(query, processResponse);
};
