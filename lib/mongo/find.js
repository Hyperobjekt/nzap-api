/**
 * Options:
 *  - collection (string)
 *  - query (object)
 *  - skip (number)
 *  - limit (number)
 *  - sort (object)
 */
module.exports = (db, options, cb) => {
    const processResponse = (err, result) => {
        if (err) return cb({ status: 403, err: err });
        if (!result.length) return cb({ status: 404, query: options.query, data: 'No Docs Found' });
        return cb({ status: 200, data: result });
    };

    const { collection, query, skip = 0, limit, sort } = options;
    if (limit) {
        return db
            .collection(collection)
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray(processResponse);
    };
    if (sort) {
        return db
            .collection(collection)
            .find(query)
            .sort(sort)
            .toArray(processResponse);
    };
    return db
        .collection(collection)
        .find(query)
        .toArray(processResponse);
};
