const mongoose = require("mongoose");

const SoilSimulationSchema = new mongoose.Schema({
  // ===== USER LINK =====
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  // ===== PLOT INFORMATION =====
  plotInfo: {
    name: { type: String, required: true },
    size: {
      value: Number,
      unit: { type: String, enum: ["cent", "acre", "hectare"], default: "cent" }
    },
    soilType: {
      type: String,
      enum: [
        "laterite", "alluvial", "red_loam", "coastal_sand", 
        "forest_loam", "black_soil", "acid_saline"
      ],
      default: "laterite"
    },
    irrigationType: {
      type: String,
      enum: ["rainfed", "drip", "flood", "sprinkler", "manual"], // Added manual
      default: "rainfed"
    }
  },

  // ===== GEO LOCATION =====
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    district: String
  },

  // ===== CROP HISTORY =====
  cropHistory: {
    currentCrop: String,
    lastCrop: String,
    lastHarvestDate: Date
  },

  // ===== SOIL STATE (SIMULATED SENSOR DATA) =====
  simulationState: {
    estimatedNutrients: {
      nitrogen: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      phosphorus: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      potassium: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      pH: { type: Number, default: 6.5 }
    },
    moistureContent: { type: Number, min: 0, max: 100, default: 25 },
    healthScore: { type: Number, min: 0, max: 100, default: 70 },
    simulationSource: {
      type: String,
      enum: ["rule_engine", "ai_model"],
      default: "rule_engine"
    }
  },

  // ===== WEATHER INFLUENCE =====
  weatherContext: {
    lastRainfallMM: { type: Number, default: 0 },
    lastRainDate: Date,
    // FIX: Changed from enum to String so we can store descriptive results
    rainImpact: {
      type: String,
      default: "none"
    }
  },

  // ===== IRRIGATION HISTORY =====
  irrigationLog: [
    {
      date: { type: Date, default: Date.now },
      method: {
        type: String,
        // Match the controller logic
        enum: ["drip", "flood", "sprinkler", "manual", "rainfed"]
      },
      waterAmountLiters: Number
    }
  ],

  // ===== AI RECOMMENDATIONS =====
  recommendations: [
    {
      category: {
        type: String,
        enum: ["Fertilizer", "Lime", "Irrigation", "General"]
      },
      priority: { type: String, enum: ["Low", "Medium", "High"] },
      messageEn: String,
      messageMl: String,
      dosage: String
    }
  ],

  // ===== TIMESTAMPS =====
  lastSimulatedAt: { type: Date, default: Date.now }

}, { timestamps: true });

// Geospatial index for distance-based queries
SoilSimulationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("SoilSimulation", SoilSimulationSchema);