const Report = require('../models/Report');
const aiService = require('../services/aiService');

const solutionsMap = {
  "Late Blight": "Apply fungicides and improve air circulation.",
  "Leaf Spot": "Remove infected leaves and avoid overhead watering.",
  "Healthy": "No action needed. Maintain current care."
};

exports.analyzeCrop = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image required" });

  const report = new Report({
    imagePath: req.file.path,
    cropType: req.body.cropType || "Unknown",
    status: "pending"
  });

  try {
    await report.save();

    const aiResult = await aiService.analyzeImage(req.file.path);

    report.analysis = {
      disease: aiResult.disease,
      confidence: aiResult.confidence,
      detectedAt: new Date()
    };
    report.solution = solutionsMap[aiResult.disease] || "Consult an agronomist for specific treatment.";
    report.status = "completed";
    
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    report.status = "failed";
    report.errorLog = error.message;
    await report.save();
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
};

exports.getReports = async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
};