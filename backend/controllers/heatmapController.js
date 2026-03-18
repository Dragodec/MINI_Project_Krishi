const DiseaseReport = require('../models/DiseaseReport');

exports.reportDisease = async (req, res) => {
    try {
        const { diseaseName, cropName, severity, location } = req.body;
        const newReport = await DiseaseReport.create({
            diseaseName,
            cropName,
            severity,
            location, // expects { type: "Point", coordinates: [lng, lat], district?: string }
            reporterId: req.user._id
        });
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getHeatmapData = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const reports = await DiseaseReport.find({
            createdAt: { $gte: thirtyDaysAgo }
        }).populate('reporterId', 'name');
        
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
