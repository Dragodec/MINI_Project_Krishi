const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/setup', soilController.createPlot);
router.get('/status', soilController.getPlotStatus);
router.post('/simulate-rain', soilController.simulateRain);
router.post('/irrigate', soilController.simulateIrrigation);
router.post('/dry', soilController.simulateDry); // The "Sun" button
router.post('/reset', soilController.resetSimulation); // The "Reset" button

module.exports = router;