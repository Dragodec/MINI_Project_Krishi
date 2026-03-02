const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestsUsed: {
    type: Number,
    default: 0
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIUsage', aiUsageSchema);