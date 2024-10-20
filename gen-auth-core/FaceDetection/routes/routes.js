const router = require('express').Router();
const main = require('../controllers/main');

router.get('/main', main.main);

module.exports = router;