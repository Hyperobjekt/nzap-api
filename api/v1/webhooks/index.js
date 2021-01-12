'use strict';

/**
 * Require Modules
 -------------------------*/
// NPM Modules
const express = require('express'),
  router = express.Router();

const done = (req, res) => {
  res.status(200).send("Web hook...")
};

router.post('/:hook', done);

module.exports = router;