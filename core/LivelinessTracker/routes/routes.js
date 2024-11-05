const router = require('express').Router();
const livelinessTracker = require('../controllers/livelinessTracker');

router.get('/create', livelinessTracker.createSessionAWSReckgnito);

module.exports = router;