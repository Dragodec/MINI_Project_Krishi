const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const files = req.files || {};
    const image = files.image?.[0]?.path || null;
    const audio = files.audio?.[0]?.path || null;

    let aiResponse = "No input provided";

    // 🔥 MULTIMODAL HANDLING WITH SAFETY
    try {
      if (image) {
        const result = await aiService.analyzeImage(image);
        aiResponse = `Disease: ${result.disease} (${result.confidence * 100 || result.confidence}%)`;
      } 
      else if (audio) {
        const result = await aiService.processAudio(audio);
        aiResponse = result.response || result.text || "No response from audio AI";
      } 
      else if (text) {
        const result = await aiService.processText(text);
        aiResponse = result.response || result.answer || "No response from AI";
      }
    } catch (aiError) {
      console.error("AI SERVICE ERROR:", aiError.message);
      aiResponse = "AI service unavailable. Please try again.";
    }

    // 🔥 FETCH OR CREATE CONVERSATION
    let convo = await Conversation.findOne({ user: req.user._id });

    if (!convo) {
      convo = new Conversation({
        user: req.user._id,
        messages: []
      });
    }

    // 🔥 PUSH USER MESSAGE
    convo.messages.push({
      role: 'user',
      text: text || null,
      image,
      audio,
      createdAt: new Date()
    });

    // 🔥 PUSH AI RESPONSE
    convo.messages.push({
      role: 'assistant',
      text: aiResponse,
      createdAt: new Date()
    });

    await convo.save();

    res.json({ reply: aiResponse });

  } catch (err) {
    console.error("CHAT CONTROLLER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const convo = await Conversation.findOne({ user: req.user._id });

    res.json(convo || { messages: [] });

  } catch (err) {
    console.error("FETCH CONVO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};