const weatherService = require('./weatherService');
const soilService = require('./soilService');
const marketService = require('./marketService');

exports.generateAdvisories = async (lat, lon) => {
    try {
        const advisories = [];
        
        // Fetch data in parallel
        const [weather, soil] = await Promise.all([
            weatherService.getCurrentWeather(lat, lon).catch(() => null),
            soilService.getSoilData(lat, lon).catch(() => null)
        ]);

        const currentMonth = new Date().getMonth();

        // Weather + Soil Rules
        if (weather) {
            if (weather.precipitation > 10 && soil && soil.moisture > 30) {
                advisories.push({
                    type: 'Irrigation',
                    priority: 'high',
                    title: 'Heavy Rain Expected',
                    description: 'High precipitation and adequate soil moisture detected.',
                    action: 'Avoid unnecessary irrigation. Review irrigation schedule and ensure proper field drainage.',
                    source: 'Weather & Soil Integration'
                });
            } else if (weather.precipitation > 10) {
                advisories.push({
                    type: 'Weather',
                    priority: 'high',
                    title: 'Heavy Rainfall Alert',
                    description: 'Expected rainfall exceeds 10mm.',
                    action: 'Postpone pesticide application and field operations.',
                    source: 'Weather Data'
                });
            }

            if (weather.temperature > 40) {
                advisories.push({
                    type: 'Weather',
                    priority: 'high',
                    title: 'Extreme Heat Warning',
                    description: 'Temperatures exceeding 40°C create severe heat stress risk for crops.',
                    action: 'Increase irrigation frequency. Provide shade for sensitive crops if possible.',
                    source: 'Weather Data'
                });
            }

            if (weather.humidity > 85) {
                advisories.push({
                    type: 'Pest/Disease',
                    priority: 'medium',
                    title: 'Fungal Disease Risk',
                    description: 'High relative humidity creates favorable conditions for fungal pathogens.',
                    action: 'Monitor crops closely for early signs of fungal diseases. Consider preventive fungicide application.',
                    source: 'Weather Data'
                });
            }
        }

        // Soil Rules
        if (soil) {
            if (soil.pH < 5.5) {
                advisories.push({
                    type: 'Soil Health',
                    priority: 'medium',
                    title: 'High Soil Acidity',
                    description: `Soil pH is low (${soil.pH}), which limits nutrient availability.`,
                    action: 'Soil acidity detected. Consider lime application well before planting.',
                    source: 'Soil Data'
                });
            }

            if (soil.nitrogen < 150) {
                advisories.push({
                    type: 'Nutrition',
                    priority: 'medium',
                    title: 'Nitrogen Deficiency Risk',
                    description: `Available soil nitrogen is low (${soil.nitrogen} mg/kg).`,
                    action: 'Low nitrogen levels. Consider nitrogen-rich fertilizers or legume intercropping.',
                    source: 'Soil Data'
                });
            }

            if (soil.organicMatter < 1.0) {
                advisories.push({
                    type: 'Soil Health',
                    priority: 'low',
                    title: 'Low Organic Matter',
                    description: `Soil organic carbon is very low (${soil.organicMatter}%).`,
                    action: 'Improve organic matter by incorporating compost, farmyard manure, or green manure.',
                    source: 'Soil Data'
                });
            }
        }

        // Seasonal Rules
        if (currentMonth >= 5 && currentMonth <= 8) { // June to Sept (Kharif)
            advisories.push({
                type: 'Seasonal',
                priority: 'medium',
                title: 'Kharif Season Advisory',
                description: 'Active monsoon crop season.',
                action: 'Kharif season monitoring period. Ensure proper drainage during monsoon to prevent waterlogging.',
                source: 'Agronomy Calendar'
            });
        }

        // Market Rules
        advisories.push({
            type: 'Market',
            priority: 'low',
            title: 'Pre-harvest Price Check',
            description: 'Market prices can fluctuate significantly.',
            action: 'Check current market prices before harvesting. Compare nearby mandi rates on the platform to maximize returns.',
            source: 'Market Intelligence'
        });

        // Sort by priority: high -> medium -> low
        const priorityScore = { 'high': 3, 'medium': 2, 'low': 1 };
        advisories.sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority]);

        return advisories;
    } catch (error) {
        console.error('Advisory service error:', error);
        throw new Error('Failed to generate advisories');
    }
};
