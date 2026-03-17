/**
 * Logic to calculate soil changes based on rainfall, irrigation, or natural drying
 * @param {Object} currentState - The current simulationState from the DB
 * @param {Number} amount - The intensity (mm for rain, liters/10 for irrigation)
 * @param {String} soilType - The type of soil (laterite, black_soil, etc.)
 * @param {String} eventType - The type of event (rain, irrigate, dry, reset)
 */
exports.runSoilSimulation = (currentState, amount, soilType, eventType = 'rain') => {
    // 1. Define Absorption & Retention Rates per Soil Type
    const soilProfiles = {
        laterite: { rate: 0.5, retention: 0.7 },
        black_soil: { rate: 0.85, retention: 0.95 }, // Holds water longest
        alluvial: { rate: 0.7, retention: 0.8 },
        coastal_sand: { rate: 0.2, retention: 0.1 }, // Drains almost instantly
        red_loam: { rate: 0.6, retention: 0.75 },
        forest_loam: { rate: 0.6, retention: 0.85 },
        acid_saline: { rate: 0.4, retention: 0.6 }
    };

    const profile = soilProfiles[soilType] || soilProfiles.laterite;
    
    // 2. Handle the "Reset" Event
    if (eventType === 'reset') {
        return {
            moistureContent: 25, // Baseline moisture
            healthScore: 80,     // Recovered health
            impactDelta: 0,
            recommendations: []
        };
    }

    let newMoisture = currentState?.moistureContent ?? 25;
    let health = currentState?.healthScore ?? 75;
    let delta = 0;

    // 3. Handle Simulation Logic per Event
    switch (eventType) {
        case 'rain':
            // Rain increases moisture based on absorption rate
            delta = Number(amount) * profile.rate * 2.5;
            newMoisture += delta;
            break;

        case 'irrigate':
            // Irrigation is controlled and usually more efficient than rain
            delta = Number(amount) * profile.rate * 3.0;
            newMoisture += delta;
            break;

        case 'dry':
            // Natural drying (Sun/Evapotranspiration)
            // Sandy soil dries 3x faster than Black soil
            const dryBase = 8; 
            delta = -(dryBase / profile.retention);
            newMoisture += delta;
            break;

        default:
            delta = 0;
    }

    // 4. Agronomic Health Logic (The "Stress" Factor)
    // Soil health drops if it's too dry (<15%) or waterlogged (>90%)
    if (newMoisture > 90) health -= 5;
    if (newMoisture < 15) health -= 3;
    
    // Slight health recovery if moisture is in the "Goldilocks zone" (40-65%)
    if (newMoisture > 40 && newMoisture < 65 && health < 95) health += 1;

    // 5. Generate Dynamic Recommendations
    const recommendations = [];
    if (newMoisture < 20) {
        recommendations.push({
            category: "Irrigation",
            priority: "High",
            messageEn: "Soil is dangerously dry. Immediate irrigation required.",
            messageMl: "മണ്ണ് വളരെ വരണ്ടതാണ്. ഉടൻ നനയ്ക്കുക.",
            dosage: "20L per cent"
        });
    } else if (newMoisture > 85) {
        recommendations.push({
            category: "General",
            priority: "Medium",
            messageEn: "Waterlogging detected. Ensure proper drainage to prevent root rot.",
            messageMl: "വെള്ളക്കെട്ട് ശ്രദ്ധിക്കുക. അധിക ജലം ഒഴുക്കിക്കളയുക."
        });
    }

    return {
        moistureContent: Math.min(100, Math.max(0, newMoisture)),
        healthScore: Math.min(100, Math.max(0, health)),
        impactDelta: Math.round(delta),
        recommendations
    };
};