const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const AIUsage = require('../../models/dev/AIUsage');

router.get('/', protect, async (req, res) => {
  const usage = await AIUsage.findOne({ user: req.user._id });

  res.json({
    requestsUsed: usage?.requestsUsed || 0,
    tokensUsed: usage?.tokensUsed || 0,
    remainingRequests: 1500 - (usage?.requestsUsed || 0),
    approxCallsLeft: Math.floor((1000000 - (usage?.tokensUsed || 0)) / 800)
  });
});

module.exports = router;