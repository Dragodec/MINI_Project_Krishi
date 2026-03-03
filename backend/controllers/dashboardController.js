const Conversation = require('../models/Conversation');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch data in parallel
        const [user, conversations] = await Promise.all([
            User.findById(userId).select('name role'),
            Conversation.find({ user: userId }).sort({ updatedAt: -1 })
        ]);

        if (!user) return res.status(404).json({ error: "User not found" });

        // 2. Initialize Stats
        let diseasesDetected = 0;
        let recentAnalyses = [];
        const totalQueries = conversations.length;

        // Keywords to identify a "Disease Detected" in the AI response
        const diseaseKeywords = ['disease', 'infection', 'fungal', 'possible', 'signs of', 'affected'];

        conversations.forEach((convo) => {
            // Find if any user message in this convo has an image
            const hasImage = convo.messages.some(m => m.role === 'user' && m.image);
            
            // Get the latest assistant response
            const lastAssistantMsg = [...convo.messages].reverse().find(m => m.role === 'assistant');
            const assistantText = lastAssistantMsg?.text?.toLowerCase() || "";

            // Logic: It's a disease detection if there's an image AND AI mentions disease keywords
            const isDisease = hasImage && diseaseKeywords.some(kw => assistantText.includes(kw));

            if (isDisease) {
                diseasesDetected++;
            }

            // Populate Recent Logs (limit to top 4)
            if (recentAnalyses.length < 4) {
                recentAnalyses.push({
                    crop: convo.title.split(' ').slice(0, 3).join(' ') + "...", // Shorten title
                    issue: isDisease ? "Issue Detected" : "Healthy / Info",
                    score: hasImage ? "AI Analyzed" : "Text Query",
                    date: convo.updatedAt
                });
            }
        });

        // 3. Dynamic Alerts (e.g. any disease detected in the last 24 hours)
        const activeAlerts = conversations.filter(convo => {
            const isRecent = new Date(convo.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
            const assistantText = convo.messages.find(m => m.role === 'assistant')?.text?.toLowerCase() || "";
            return isRecent && diseaseKeywords.some(kw => assistantText.includes(kw));
        }).length;

        res.json({
            user: {
                name: user.name,
                role: user.role
            },
            stats: {
                totalQueries,
                diseasesDetected,
                pendingAlerts: activeAlerts
            },
            recentAnalyses,
            advisories: [
                { title: "Monsoon Watch", desc: "Heavy rains expected. Check for root rot in sensitive crops.", type: "amber" },
                { title: "System Unified", desc: "Your multimodal logs are now synced across all devices.", type: "blue" }
            ]
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};