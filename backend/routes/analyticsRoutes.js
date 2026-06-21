const router = require('express').Router();
const { getOverview, getTrends } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/overview', auth, getOverview);
router.get('/trends', auth, getTrends);

module.exports = router;