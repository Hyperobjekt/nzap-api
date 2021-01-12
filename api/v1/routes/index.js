'use strict';

const express = require('express'), router = express.Router();
const mw = require('../../../lib/middlewares'), crud = mw.crud, query = mw.query, protect = mw.protect;

const statusVars = {
  mode: process.env.MODE || "N/A",
  apiVersion: process.env.API_VERSION || "N/A",
  tz: process.env.TZ || "N/A",
  message: "Net Zero America running"
}

const done = (req, res) => {
  let statusCode;
  try {
    if (!res.locals.results) return res.status(404).send({ data: `not found @ ${req.params.route}` });
    if (!res.locals.results[req.params.route]) return res.status(403).send({ data: `bad data match @ ${req.params.route}` });
    if (res.locals.results[req.params.route].status) statusCode = res.locals.results[req.params.route].status;
    res.status(statusCode).send(res.locals.results)
  } catch (error) {
    res.status(500).send({ message: `There was a problem trying to execute a ${req.method} on ${req.params.route}`, error: error })
  }
};


const exists = (req, res, next) => {
  const status = res.locals.results[req.params.route].status;
  if (status === 404) return next();
  if (status !== 404) return done(req, res);
}


router.get('/', (req, res) => { res.status(200).json(statusVars) });

// Get all ? query & populate=true & limit & skip 
router.get('/:route', query.pagination, query.set, crud.get, done);

// Create one or many {body} || [{body}]
router.post('/:route', query.set, crud.get, exists, crud.create, done);

// Update ? query {body}
router.put('/:route', query.set, crud.update, done);

// Count ? query
router.get('/count/:route', query.set, crud.count, done);

// Delete ? _id
router.delete('/:route', query.set, crud.delete, done)

module.exports = router;