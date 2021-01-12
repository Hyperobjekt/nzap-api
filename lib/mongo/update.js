/** 
 * Options:
 *  - collection (string)
 *  - data {object}
 *  - query (object)
 *  - many (boolean)
 */
module.exports = (db, options, cb) => {
    const { collection, query, data, many, action } = options;



    let operatorExpression;
    switch (action) {
        case 'addToSet':
            operatorExpression = { $addToSet: data };
            break;
        case 'pull':
            operatorExpression = { $pull: data };
            break;
        default:
            operatorExpression = { $set: data };
            break;
    };


    if (many) {
        return db
            .collection(collection)
            .updateMany(query, operatorExpression, processResponse);
    };
    
    return db
        .collection(collection)
        .updateOne(query, operatorExpression, processResponse);

    function processResponse(err, result) {
        if (err) return cb({ status: 403, err: err });
        return cb({ status: 200, data: result });
    }
};
