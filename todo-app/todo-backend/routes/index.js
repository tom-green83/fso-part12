const express = require('express');
const redis = require('../redis')
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET todos statisics */
router.get('/statistics', async (req, res) => {
  const toDosAdded = JSON.parse(await redis.getAsync("toDosAdded"))
  res.send({"added_todos": toDosAdded})
});

module.exports = router;
