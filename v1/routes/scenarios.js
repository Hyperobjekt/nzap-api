'use strict';

const router = require('express').Router();
const mw = require('../../../lib/middlewares');

const done = (req, res) => {
  let statusCode;
  try {
    if (!res.locals.results) return res.status(404).send({ data: `not found @ ${req.locals.route}` });
    if (!res.locals.results[req.locals.route]) return res.status(403).send({ data: `bad data match @ ${req.locals.route}` });
    if (res.locals.results[req.locals.route].status) statusCode = res.locals.results[req.locals.route].status;
    res.status(statusCode).send(res.locals.results)

  } catch (error) {
    res.status(500).send({ message: `There was a problem trying to execute a ${req.method} on ${req.locals.route}`, error: error })
  }

};


const exists = (req, res, next) => {
  const status = res.locals.results[req.locals.route].status;
  if (status === 404) return next();
  if (status !== 404) return done(req, res);
}


// Get all ? query & populate=true & limit & skip 
router.get('/', mw.protect.default, mw.config, mw.query.set, mw.query.pagination, mw.query.set, mw.crud.get, done);

// Count ? query
router.get('/count', mw.protect.default, mw.config, mw.query.set, mw.crud.count, done);

// Get by Id
router.get('/:_id', mw.protect.default, mw.config, mw.query.pagination, mw.query.set, mw.crud.get, done);

// Create one {body}
router.post('/', mw.protect.default, mw.config, mw.query.set, mw.crud.get, exists, mw.crud.create, done);

// Update ? query {body}
router.put('/:_id', mw.protect.default, mw.config, mw.query.set, mw.crud.update, done);

// Delete ? _id
router.delete('/:_id', mw.protect.default, mw.config, mw.query.set, mw.crud.delete, done)

module.exports = router;