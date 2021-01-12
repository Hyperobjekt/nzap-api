const set = (req, res, next) => {
    !req.locals ? req.locals = {} : null
    if (req.query.skip) req.locals.skip = Number(req.query.skip)
    if (req.query.limit) req.locals.limit = Number(req.query.limit)
    next();
}

module.exports = set;