const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { getWeatherData } = require('../services/weatherService');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch User, Convos, and Weather in parallel for max performance
        const [user, conversations, weather] = await Promise.all([
            User.findById(userId).select('name role'),
            Conversation.find({ user: userId }).sort({ updatedAt: -1 }),
            getWeatherData().catch(() => null) // Fallback if API fails
        ]);

        if (!user) return res.status(404).json({ error: "User not found" });

        // 2. Process Conversation Stats
        let diseasesDetected = 0;
        let recentAnalyses = [];
        const totalQueries = conversations.length;
        const diseaseKeywords = ['disease', 'infection', 'fungal', 'possible', 'signs of', 'affected', 'deficiency', 'pests'];

        conversations.forEach((convo) => {
            const hasImage = convo.messages.some(m => m.role === 'user' && m.image);
            const lastAssistantMsg = [...convo.messages].reverse().find(m => m.role === 'assistant');
            const assistantText = lastAssistantMsg?.text?.toLowerCase() || "";

            const isDisease = diseaseKeywords.some(kw => assistantText.includes(kw));
            if (isDisease) diseasesDetected++;

            if (recentAnalyses.length < 4) {
                recentAnalyses.push({
                    crop: convo.title.length > 25 ? convo.title.substring(0, 25) + "..." : convo.title,
                    issue: isDisease ? "Issue Detected" : "Healthy / Info",
                    score: hasImage ? "AI Image Analysis" : "Voice/Text Query",
                    date: convo.updatedAt
                });
            }
        });

        // 3. Generate Weather-Based Advisories
        const advisories = [];
        
        if (weather) {
            const { current } = weather;
            if (current.rain > 60) {
                advisories.push({ title: "Weather Alert: Heavy Rain", desc: "60%+ chance of rain. Postpone pesticide spraying to avoid chemical runoff.", type: "amber" });
            } else if (current.temp > 32) {
                advisories.push({ title: "Heat Stress Alert", desc: `High temp (${current.temp}°C). Ensure morning irrigation for moisture retention.`, type: "amber" });
            } else if (current.humidity > 80) {
                advisories.push({ title: "Fungal Risk High", desc: "High humidity detected. Inspect banana/tomato leaves for early fungal spots.", type: "amber" });
            } else {
                advisories.push({ title: "Optimal Conditions", desc: "Weather is stable. Good window for general maintenance and fertilization.", type: "blue" });
            }
        }

        // Keep one persistent market advisory as requested
        advisories.push({ title: "Market Update", desc: "Wholesale prices for organic tomatoes rose by 12% in the local market.", type: "blue" });

        res.json({
            user: { name: user.name, role: user.role },
            stats: {
                totalQueries,
                diseasesDetected,
                pendingAlerts: diseasesDetected // Dynamic alerts based on total detections
            },
            weather: weather ? {
                temp: weather.current.temp,
                condition: weather.recommendations[0] || "All systems stable"
            } : null,
            recentAnalyses,
            advisories
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};