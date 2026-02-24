const VoiceQuery = require('../models/VoiceQuery');
const aiService = require('../services/aiService');

exports.handleVoiceQuery = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Audio file required" });

  const queryRecord = new VoiceQuery({
    audioPath: req.file.path,
    status: "processing"
  });

  try {
    await queryRecord.save();
    const aiData = await aiService.processAudio(req.file.path);

    queryRecord.transcription = aiData.text;
    queryRecord.aiResponse = aiData.response;
    queryRecord.status = "completed";
    
    await queryRecord.save();
    res.status(200).json(queryRecord);
  } catch (err) {
    queryRecord.status = "error";
    queryRecord.error = err.message;
    await queryRecord.save();
    res.status(500).json({ error: "AI Processing Failed", details: err.message });
  }
};

exports.getQueryHistory = async (req, res) => {
  const history = await VoiceQuery.find().sort({ createdAt: -1 });
  res.json(history);
};