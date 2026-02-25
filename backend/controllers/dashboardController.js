const Report = require('../models/Report');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Run queries in parallel for maximum speed
        const [totalQueries, diseasesDetected, recentAnalyses, user] = await Promise.all([
            Report.countDocuments({ user: userId }),
            Report.countDocuments({ user: userId, status: { $ne: 'Healthy' } }),
            Report.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(4)
                .select('cropType status confidence createdAt'),
            User.findById(userId).select('name role')
        ]);

        res.json({
            user: {
                name: user.name,
                role: user.role
            },
            stats: {
                totalQueries,
                diseasesDetected,
                pendingAlerts: 3 // Placeholder
            },
            recentAnalyses: recentAnalyses.map(report => ({
                crop: report.cropType,
                issue: report.status,
                score: report.confidence ? `${(report.confidence * 100).toFixed(0)}%` : 'N/A',
                date: report.createdAt
            })),
            advisories: [
                { title: "Weather Alert: Heavy Monsoon", desc: "Ensure proper drainage in banana plantations.", type: "amber" },
                { title: "Market Update", desc: "Wholesale prices for organic tomatoes have risen by 12%.", type: "blue" }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};