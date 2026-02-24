const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  imagePath: String,
  cropType: String,
  analysis: {
    disease: String,
    confidence: Number,
    detectedAt: Date
  },
  solution: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  errorLog: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'reports' });

module.exports = mongoose.model('Report', reportSchema);