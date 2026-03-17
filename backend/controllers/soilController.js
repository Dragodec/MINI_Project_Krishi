const SoilSimulation = require('../models/SoilSimulation');
const { runSoilSimulation } = require('../services/simulationService');

// 🌧️ Simulate Rain
exports.simulateRain = async (req, res) => {
    try {
        const { amountMm } = req.body;
        const plot = await SoilSimulation.findOne({ userId: req.user._id });
        if (!plot) return res.status(404).json({ error: "Field setup required." });

        const results = runSoilSimulation(plot.simulationState, amountMm, plot.plotInfo.soilType, 'rain');

        plot.simulationState.moistureContent = results.moistureContent;
        plot.simulationState.healthScore = results.healthScore;
        plot.weatherContext.lastRainfallMM = amountMm;
        plot.weatherContext.lastRainDate = new Date();
        plot.weatherContext.rainImpact = `Rainfall of ${amountMm}mm increased moisture by ${results.impactDelta}%`;
        plot.recommendations = results.recommendations;
        plot.lastSimulatedAt = new Date();

        await plot.save();
        res.json({ message: "Rain Simulation Successful", data: plot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 💧 Simulate Irrigation
exports.simulateIrrigation = async (req, res) => {
    try {
        const { method, waterAmountLiters } = req.body;
        const plot = await SoilSimulation.findOne({ userId: req.user._id });
        if (!plot) return res.status(404).json({ error: "Field setup required." });

        const intensity = waterAmountLiters / 10;
        const results = runSoilSimulation(plot.simulationState, intensity, plot.plotInfo.soilType, 'irrigate');

        plot.simulationState.moistureContent = results.moistureContent;
        plot.simulationState.healthScore = results.healthScore;
        plot.recommendations = results.recommendations;
        
        plot.irrigationLog.push({
            method: method || 'manual',
            waterAmountLiters: waterAmountLiters,
            date: new Date()
        });

        await plot.save();
        res.json({ message: "Irrigation Successful", data: plot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ☀️ Simulate Drying (Sun/Evaporation)
exports.simulateDry = async (req, res) => {
    try {
        const plot = await SoilSimulation.findOne({ userId: req.user._id });
        if (!plot) return res.status(404).json({ error: "Field setup required." });

        const results = runSoilSimulation(plot.simulationState, 0, plot.plotInfo.soilType, 'dry');

        plot.simulationState.moistureContent = results.moistureContent;
        plot.simulationState.healthScore = results.healthScore;
        plot.weatherContext.rainImpact = `High heat caused moisture to drop by ${Math.abs(results.impactDelta)}%`;
        plot.recommendations = results.recommendations;

        await plot.save();
        res.json({ message: "Soil dried due to heat", data: plot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🧹 Reset Simulation
exports.resetSimulation = async (req, res) => {
    try {
        const plot = await SoilSimulation.findOne({ userId: req.user._id });
        if (!plot) return res.status(404).json({ error: "Field setup required." });

        const results = runSoilSimulation(null, 0, null, 'reset');

        plot.simulationState.moistureContent = results.moistureContent;
        plot.simulationState.healthScore = results.healthScore;
        plot.weatherContext.rainImpact = "Simulation reset to baseline.";
        plot.recommendations = [];
        plot.irrigationLog = []; 

        await plot.save();
        res.json({ message: "Simulation reset", data: plot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlotStatus = async (req, res) => {
    try {
        const plot = await SoilSimulation.findOne({ userId: req.user._id });
        if (!plot) return res.status(404).json({ error: "No plot data found" });
        res.json(plot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPlot = async (req, res) => {
    try {
        const existing = await SoilSimulation.findOne({ userId: req.user._id });
        if (existing) return res.status(400).json({ error: "Plot exists" });
        const plot = await SoilSimulation.create({ userId: req.user._id, ...req.body });
        res.status(201).json(plot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};