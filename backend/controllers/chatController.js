const Conversation = require('../models/Conversation');
const AIUsage = require('../models/dev/AIUsage');
const aiService = require('../services/aiService');

// ---- PRESERVED: SIMPLE LOCAL RESPONSES ----
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

// ---- PRESERVED: TOKEN ESTIMATION ----
const estimateTokens = (text, hasImage, hasAudio) => {
    let tokens = text ? text.split(" ").length * 1.3 : 0;
    if (hasImage) tokens += 1200;
    if (hasAudio) tokens += 2000;
    return Math.floor(tokens);
};

// ---- UPDATED: SEND MESSAGE (Multi-chat aware) ----
exports.sendMessage = async (req, res) => {
    try {
        const { text, chatId } = req.body; // chatId is now sent from frontend
        const files = req.files || {};
        const imagePath = files.image?.[0]?.path || null;
        const audioPath = files.audio?.[0]?.path || null;

        let aiResponse = "";

        // ---- PRESERVED: USAGE CHECK ----
        let usage = await AIUsage.findOne({ user: req.user._id });
        if (!usage) usage = new AIUsage({ user: req.user._id });

        if (usage.requestsUsed >= 1400) {
            return res.status(429).json({ error: "Daily AI limit reached." });
        }

        // ---- PRESERVED: LOCAL RESPONSE ----
        if (text && !imagePath && !audioPath) {
            aiResponse = getLocalResponse(text);
        }

        // ---- PRESERVED: AI CALL ----
        if (!aiResponse) {
            try {
                const result = await aiService.processMultimodal(text, imagePath, audioPath);
                aiResponse = result.response || "No response generated";
            } catch (aiError) {
                console.error("AI SERVICE ERROR:", aiError.message);
                aiResponse = "AI service unavailable. Please try again.";
            }

            const tokensUsed = estimateTokens(text, !!imagePath, !!audioPath);
            usage.requestsUsed += 1;
            usage.tokensUsed += tokensUsed;
            usage.lastUpdated = new Date();
            await usage.save();
        }

        // ---- MULTI-CHAT LOGIC: SAVE TO SPECIFIC CONVO ----
        let convo;
        if (chatId) {
            convo = await Conversation.findOne({ _id: chatId, user: req.user._id });
        }

        if (!convo) {
            convo = new Conversation({
                user: req.user._id,
                title: text ? (text.length > 30 ? text.substring(0, 30) + "..." : text) : "New Multimedia Query",
                messages: []
            });
        }

        convo.messages.push({
            role: 'user',
            text: text || (imagePath ? "[Image Sent]" : "[Audio Sent]"),
            image: imagePath,
            audio: audioPath,
            createdAt: new Date()
        });

        convo.messages.push({
            role: 'assistant',
            text: aiResponse,
            createdAt: new Date()
        });

        await convo.save();

        // Return chatId so frontend can navigate to the URL if it's a new chat
        res.json({ reply: aiResponse, chatId: convo._id, title: convo.title });

    } catch (err) {
        console.error("CHAT CONTROLLER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// ---- UPDATED: GET SPECIFIC CHAT ----
exports.getConversation = async (req, res) => {
    try {
        const convo = await Conversation.findOne({ _id: req.params.chatId, user: req.user._id });
        res.json(convo || { messages: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---- UPDATED: GET ALL TITLES (HISTORY) ----
exports.getHistory = async (req, res) => {
    try {
        // We only return the titles and IDs to make the sidebar light
        const history = await Conversation.find({ user: req.user._id })
            .select('title createdAt')
            .sort({ createdAt: -1 });
        res.json({ history });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---- NEW: DELETE CHAT ----
exports.deleteConversation = async (req, res) => {
    try {
        await Conversation.deleteOne({ _id: req.params.chatId, user: req.user._id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---- NEW: RENAME CHAT ----
exports.renameConversation = async (req, res) => {
    try {
        const convo = await Conversation.findOneAndUpdate(
            { _id: req.params.chatId, user: req.user._id },
            { title: req.body.title },
            { new: true }
        );
        res.json(convo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};