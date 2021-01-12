/**
 * Options:
 *  - collection (string)
 *  - query (object)
 */
module.exports = (db, options, cb) => {
    const { collection, query } = options;
    const processResponse = (err, result) => {
        if (err) return cb({ status: 403, err: err });
        if (!result) return cb({ status: 404, query, data: 'No Docs Found' });
        return cb({ status: 200, data: result });
    }

    return db
        .collection(collection)
        .countDocuments(query, processResponse);
}
