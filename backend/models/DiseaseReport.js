const mongoose = require('mongoose');

const DiseaseReportSchema = new mongoose.Schema({
  diseaseName: { type: String, required: true },
  cropName: { type: String, required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    district: String
  }
}, { timestamps: true });

DiseaseReportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);
