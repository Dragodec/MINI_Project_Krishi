const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/report', protect, heatmapController.reportDisease);
router.get('/data', protect, heatmapController.getHeatmapData);

module.exports = router;
