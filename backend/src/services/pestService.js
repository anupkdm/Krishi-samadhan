const { getDb } = require('../db/database');

exports.analyzeImage = async (crop, imageUrl, userId) => {
    try {
        const cropLower = crop.toLowerCase();
        let prediction = 'Unknown Pest/Disease';
        let recommendation = 'Consult a local agricultural expert.';
        
        if (cropLower.includes('rice')) {
            prediction = 'Leaf Blast';
            recommendation = 'Apply Tricyclazole 75% WP @ 120g/acre. Ensure field is not excessively dry.';
        } else if (cropLower.includes('wheat')) {
            prediction = 'Yellow Rust';
            recommendation = 'Spray Propiconazole 25 EC @ 200 ml/acre in 200 litres of water.';
        } else if (cropLower.includes('tomato')) {
            prediction = 'Early Blight';
            recommendation = 'Spray Mancozeb 75% WP @ 2.5g/liter of water. Improve air circulation.';
        } else if (cropLower.includes('cotton')) {
            prediction = 'Pink Bollworm';
            recommendation = 'Install pheromone traps (2-3/acre). Spray Quinalphos 25 EC @ 400 ml/acre.';
        }

        const analysis = {
            prediction,
            confidence: (Math.random() * 0.2 + 0.75).toFixed(2), // 0.75 - 0.95
            severity: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
            recommendation,
            imageUrl,
            analysisType: 'Demo Analysis',
            disclaimer: 'This is a demonstration analysis. Connect a trained ML model for production use.'
        };

        const db = await getDb();
        const stmt = db.prepare("INSERT INTO pest_analysis (farmer_id, crop, image_url, prediction, confidence, severity, recommendation) VALUES (?, ?, ?, ?, ?, ?, ?)");
        stmt.run([userId, crop, imageUrl, analysis.prediction, analysis.confidence, analysis.severity, analysis.recommendation]);
        stmt.free();

        return analysis;
    } catch (error) {
        console.error('Pest analysis error:', error);
        throw new Error('Failed to analyze image');
    }
};
