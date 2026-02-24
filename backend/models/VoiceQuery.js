const mongoose = require('mongoose');

const voiceQuerySchema = new mongoose.Schema({
  audioPath: String,
  transcription: String,
  aiResponse: String,
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "error"],
    default: "pending" 
  },
  error: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'voice_queries' });

module.exports = mongoose.model('VoiceQuery', voiceQuerySchema);