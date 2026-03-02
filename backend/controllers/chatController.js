const Conversation = require('../models/Conversation');
const AIUsage = require('../models/dev/AIUsage');
const aiService = require('../services/aiService');

// ---- SIMPLE LOCAL RESPONSES (NO API CALL) ----
const getLocalResponse = (text) => {
    const input = text.toLowerCase().trim();
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'];
    const closures = ['bye', 'goodbye', 'see you', 'exit'];
    const thanks = ['thanks', 'thank you', 'nanni', 'shukriya'];

    if (greetings.includes(input))
        return "Hello! I am your AI Krishi Officer 🌾. How is your crop doing today?";

    if (closures.includes(input))
        return "Goodbye! Take care of your farm 🌱.";

    if (thanks.includes(input))
        return "You're welcome! Always here to help you grow better 🌿.";

    return null;
};

// ---- TOKEN ESTIMATION ----
const estimateTokens = (text, hasImage, hasAudio) => {
    let tokens = text ? text.split(" ").length * 1.3 : 0;

    if (hasImage) tokens += 1200;
    if (hasAudio) tokens += 2000;

    return Math.floor(tokens);
};

exports.sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const files = req.files || {};
        const imagePath = files.image?.[0]?.path || null;
        const audioPath = files.audio?.[0]?.path || null;

        let aiResponse = "";

        // ---- GET OR CREATE USAGE ----
        let usage = await AIUsage.findOne({ user: req.user._id });
        if (!usage) {
            usage = new AIUsage({ user: req.user._id });
        }

        // ---- HARD LIMIT PROTECTION ----
        if (usage.requestsUsed >= 1400) {
            return res.status(429).json({
                error: "Daily AI limit reached. Try again tomorrow."
            });
        }

        // ---- LOCAL RESPONSE (NO COST) ----
        if (text && !imagePath && !audioPath) {
            aiResponse = getLocalResponse(text);
        }

        // ---- AI CALL ----
        if (!aiResponse) {
            try {
                const result = await aiService.processMultimodal(text, imagePath, audioPath);
                aiResponse = result.response || "No response generated";
            } catch (aiError) {
                console.error("AI SERVICE ERROR:", aiError.message);
                aiResponse = "AI service unavailable. Please try again.";
            }

            // ---- UPDATE USAGE ONLY IF AI CALLED ----
            const tokensUsed = estimateTokens(text, !!imagePath, !!audioPath);

            usage.requestsUsed += 1;
            usage.tokensUsed += tokensUsed;
            usage.lastUpdated = new Date();

            await usage.save();
        }

        // ---- SAVE CONVERSATION ----
        let convo = await Conversation.findOne({ user: req.user._id });

        if (!convo) {
            convo = new Conversation({
                user: req.user._id,
                messages: []
            });
        }

        // USER MESSAGE
        convo.messages.push({
            role: 'user',
            text: text || (imagePath ? "[Image Sent]" : "[Audio Sent]"),
            image: imagePath,
            audio: audioPath,
            createdAt: new Date()
        });

        // AI MESSAGE
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

// ---- GET FULL CHAT ----
exports.getConversation = async (req, res) => {
    try {
        const convo = await Conversation.findOne({ user: req.user._id });
        res.json(convo || { messages: [] });
    } catch (err) {
        console.error("FETCH CONVO ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// ---- GET HISTORY ----
exports.getHistory = async (req, res) => {
    try {
        const convo = await Conversation.findOne({ user: req.user._id });

        if (!convo) return res.json({ history: [] });

        const historyData = [{
            _id: convo._id,
            createdAt: convo.createdAt,
            messages: convo.messages
        }];

        res.json({ history: historyData });

    } catch (err) {
        console.error("FETCH HISTORY ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};