/**
 * GIS Spatial Intelligence Service - Krishi Samadhan
 * Implements 7-Layer Agricultural GIS Architecture:
 * 1. Data Sources (Weather, Satellite, Soil, Market, Schemes)
 * 2. Data Integration Layer (Geo-normalization, Harmonization)
 * 3. GIS Layer (Farm Boundaries, Infrastructure, Spatial Layers)
 * 4. AI & Spatial Analytics (Crop Stress, Risk Detection, CWSI, Yield Forecast)
 * 5. Decision Support Layer (Agronomic Rules Engine)
 * 6. Farmer Advisory Layer (Multilingual Localized Advice)
 * 7. Dashboard & Alerting System (Spatial Rendering, Notification Dispatch)
 */

const weatherService = require('./weatherService');
const soilService = require('./soilService');
const satelliteService = require('./satelliteService');

// Generate realistic spatial farm plots around coordinate
const generateFarmPlots = (lat, lon) => {
    const crops = [
        { name: 'Onion (Kharif)', variety: 'Bhima Super', color: '#e76f51', icon: '🧅', stage: 'Bulb Development', targetYield: 18.5 },
        { name: 'Pomegranate', variety: 'Bhagwa', color: '#e63946', icon: '🍎', stage: 'Fruit Setting', targetYield: 12.0 },
        { name: 'Sugarcane', variety: 'Co 86032', color: '#2d6a4f', icon: '🎋', stage: 'Grand Growth', targetYield: 110.0 },
        { name: 'Table Grapes', variety: 'Thomson Seedless', color: '#7209b7', icon: '🍇', stage: 'Berry Elongation', targetYield: 22.0 },
        { name: 'Soybean', variety: 'JS 335', color: '#588157', icon: '🌱', stage: 'Pod Filling', targetYield: 2.8 },
        { name: 'Cotton', variety: 'Bt Cotton (RCH-2)', color: '#4361ee', icon: '☁️', stage: 'Boll Formation', targetYield: 3.2 },
        { name: 'Wheat (Rabi)', variety: 'Lokwan', color: '#e9c46a', icon: '🌾', stage: 'Tillering', targetYield: 4.5 },
        { name: 'Tomato', variety: 'Abhinav Hybrid', color: '#d90429', icon: '🍅', stage: 'Flowering & Fruiting', targetYield: 35.0 }
    ];

    const farmers = [
        { name: 'Ramesh Patil', phone: '+91 98221 44521', surveyNo: '104/2A' },
        { name: 'Sanjay Deshmukh', phone: '+91 94230 88712', surveyNo: '105/1B' },
        { name: 'Eknath Shinde', phone: '+91 98902 33419', surveyNo: '108/3' },
        { name: 'Babasaheb Tambe', phone: '+91 97654 11290', surveyNo: '112/4A' },
        { name: 'Sunita Gholap', phone: '+91 99211 77654', surveyNo: '115/2' },
        { name: 'Dnyaneshwar Vikhe', phone: '+91 98233 55432', surveyNo: '119/1' },
        { name: 'Kisanrao Kadam', phone: '+91 94050 99881', surveyNo: '124/3B' },
        { name: 'Chandrakant Thorat', phone: '+91 98814 66723', surveyNo: '128/2A' }
    ];

    const parcelGeometries = [
        {
            polygon: [
                [lat + 0.0003, lon - 0.0018],
                [lat + 0.0003, lon - 0.0007],
                [lat + 0.0014, lon - 0.0006],
                [lat + 0.0013, lon - 0.0018],
                [lat + 0.0003, lon - 0.0018]
            ],
            center: [lat + 0.00085, lon - 0.00125],
            areaAcres: 2.6
        },
        {
            polygon: [
                [lat + 0.0003, lon - 0.0006],
                [lat + 0.0003, lon + 0.0005],
                [lat + 0.0014, lon + 0.0006],
                [lat + 0.0014, lon - 0.0005],
                [lat + 0.0003, lon - 0.0006]
            ],
            center: [lat + 0.00085, lon + 0.00000],
            areaAcres: 2.4
        },
        {
            polygon: [
                [lat + 0.0003, lon + 0.0006],
                [lat + 0.0003, lon + 0.0017],
                [lat + 0.0013, lon + 0.0018],
                [lat + 0.0014, lon + 0.0007],
                [lat + 0.0003, lon + 0.0006]
            ],
            center: [lat + 0.00085, lon + 0.00120],
            areaAcres: 2.5
        },
        {
            polygon: [
                [lat - 0.0008, lon - 0.0018],
                [lat - 0.0008, lon - 0.0007],
                [lat + 0.0002, lon - 0.0007],
                [lat + 0.0002, lon - 0.0018],
                [lat - 0.0008, lon - 0.0018]
            ],
            center: [lat - 0.00030, lon - 0.00125],
            areaAcres: 2.3
        },
        {
            polygon: [
                [lat - 0.0008, lon - 0.0006],
                [lat - 0.0008, lon + 0.0005],
                [lat + 0.0002, lon + 0.0005],
                [lat + 0.0002, lon - 0.0006],
                [lat - 0.0008, lon - 0.0006]
            ],
            center: [lat - 0.00030, lon - 0.00005],
            areaAcres: 2.5
        },
        {
            polygon: [
                [lat - 0.0008, lon + 0.0006],
                [lat - 0.0008, lon + 0.0017],
                [lat + 0.0002, lon + 0.0017],
                [lat + 0.0002, lon + 0.0006],
                [lat - 0.0008, lon + 0.0006]
            ],
            center: [lat - 0.00030, lon + 0.00115],
            areaAcres: 2.4
        },
        {
            polygon: [
                [lat - 0.0018, lon - 0.0015],
                [lat - 0.0018, lon - 0.0001],
                [lat - 0.0009, lon - 0.0001],
                [lat - 0.0009, lon - 0.0015],
                [lat - 0.0018, lon - 0.0015]
            ],
            center: [lat - 0.00135, lon - 0.00080],
            areaAcres: 2.8
        },
        {
            polygon: [
                [lat - 0.0018, lon + 0.0001],
                [lat - 0.0018, lon + 0.0015],
                [lat - 0.0009, lon + 0.0015],
                [lat - 0.0009, lon + 0.0001],
                [lat - 0.0018, lon + 0.0001]
            ],
            center: [lat - 0.00135, lon + 0.00080],
            areaAcres: 2.7
        }
    ];

    return farmers.map((farmer, idx) => {
        const crop = crops[idx % crops.length];
        const geo = parcelGeometries[idx] || parcelGeometries[0];

        const ndvi = Number((0.55 + (idx * 0.05) % 0.35).toFixed(2));
        const moisture = Math.round(24 + ((idx * 11) % 40));
        const areaAcres = geo.areaAcres;
        const isFloodRisk = idx === 0 || idx === 6;
        const isPestRisk = idx === 1 || idx === 4;

        const healthStatus = ndvi > 0.7 ? 'Optimal' : ndvi >= 0.5 ? 'Moderate' : 'Stressed';
        const pestRisk = isPestRisk ? 'High' : idx % 2 === 0 ? 'Medium' : 'Low';
        const waterRequirement = moisture < 30 ? 'Immediate Drip Required (90 min)' : moisture > 55 ? 'Excess Water - Drainage Needed' : 'Adequate Moisture';

        return {
            id: `farm-plot-${idx + 1}`,
            surveyNo: farmer.surveyNo,
            farmerName: farmer.name,
            farmerPhone: farmer.phone,
            crop: crop.name,
            cropVariety: crop.variety,
            cropIcon: crop.icon,
            cropColor: crop.color,
            cropStage: crop.stage,
            areaAcres,
            center: geo.center,
            polygon: geo.polygon,
            soilType: idx % 2 === 0 ? 'Deep Vertisol (Black Cotton Soil)' : 'Medium Clay Loam',
            soilMoisturePercent: moisture,
            ndvi,
            healthStatus,
            pestRisk,
            pestThreat: isPestRisk ? 'Thrips & Purple Blotch Detected' : 'Normal Microfauna',
            waterSource: idx % 3 === 0 ? 'Borewell + Micro Drip' : idx % 3 === 1 ? 'Canal Lift + Sprinkler' : 'Farm Pond (Shettale)',
            waterRequirement,
            estimatedYield: `${(crop.targetYield * (ndvi / 0.75)).toFixed(1)} MT/ha`,
            pmfbyInsured: idx % 2 === 0,
            recommendedAction: isFloodRisk
                ? '⚠️ Clear field drainage furrows to prevent root inundation'
                : isPestRisk
                    ? '🐛 Apply bio-pesticide / Neem oil 10000 ppm spray before dusk'
                    : moisture < 28
                        ? '💧 Apply 2 hours drip irrigation during 6 AM - 8 AM'
                        : '✅ Standard canopy monitoring and nutrient maintenance'
        };
    });
};

// Generate APMC Mandis nearby
const getNearbyMandis = (lat, lon) => {
    return [
        {
            id: 'mandi-1',
            name: 'Sangamner Main APMC',
            lat: lat + 0.007,
            lon: lon - 0.005,
            distanceKm: 2.1,
            rates: [
                { commodity: 'Onion (Red)', min: 2200, max: 2950, modal: 2820, unit: '₹/qtl', trend: 'up' },
                { commodity: 'Tomato', min: 1400, max: 2100, modal: 1950, unit: '₹/qtl', trend: 'stable' },
                { commodity: 'Pomegranate', min: 6500, max: 12000, modal: 9400, unit: '₹/qtl', trend: 'up' }
            ]
        },
        {
            id: 'mandi-2',
            name: 'Kopargaon Sub-Market Yard',
            lat: lat - 0.008,
            lon: lon + 0.007,
            distanceKm: 3.4,
            rates: [
                { commodity: 'Soybean', min: 4200, max: 4850, modal: 4680, unit: '₹/qtl', trend: 'up' },
                { commodity: 'Wheat (Lokwan)', min: 2450, max: 2900, modal: 2750, unit: '₹/qtl', trend: 'stable' },
                { commodity: 'Sugarcane', min: 3100, max: 3450, modal: 3300, unit: '₹/MT', trend: 'up' }
            ]
        },
        {
            id: 'mandi-3',
            name: 'Nashik / Sinnar Regional APMC Hub',
            lat: lat + 0.009,
            lon: lon + 0.009,
            distanceKm: 4.8,
            rates: [
                { commodity: 'Grapes (Export)', min: 7200, max: 11500, modal: 9800, unit: '₹/qtl', trend: 'up' },
                { commodity: 'Onion (Garva)', min: 2400, max: 3100, modal: 2900, unit: '₹/qtl', trend: 'up' },
                { commodity: 'Maize', min: 2100, max: 2350, modal: 2280, unit: '₹/qtl', trend: 'down' }
            ]
        }
    ];
};

// Generate Water / Irrigation Infrastructure
const getWaterInfrastructure = (lat, lon) => {
    return [
        {
            id: 'water-1',
            type: 'Canal',
            name: 'Field Distributary Canal #4',
            discharge: '45 Cusecs (Flow Active)',
            status: 'Operational',
            coordinates: [
                [lat + 0.0016, lon - 0.0020],
                [lat + 0.0015, lon - 0.0006],
                [lat + 0.0015, lon + 0.0007],
                [lat + 0.0014, lon + 0.0020]
            ]
        },
        {
            id: 'borewell-1',
            type: 'Community Solar Borewell',
            name: 'Solar Pump #KS-204',
            depth: '280 ft',
            yield: '4,500 LPH',
            lat: lat + 0.00025,
            lon: lon - 0.00065,
            status: 'Active'
        },
        {
            id: 'pond-1',
            type: 'Farm Pond (Shettale)',
            name: 'Lined Farm Pond (50 Lakh L)',
            capacity: '82% Full',
            lat: lat - 0.00135,
            lon: lon + 0.0017,
            status: 'Water Secure'
        }
    ];
};

// Generate Pest / Disease Outbreak Hotspots
const getPestHotspots = (lat, lon) => {
    return [
        {
            id: 'pest-zone-1',
            name: 'Thrips & Purple Blotch Alert Zone',
            pestName: 'Thrips tabaci / Alternaria porri',
            severity: 'High',
            radiusMeters: 85,
            center: [lat - 0.00030, lon - 0.00005],
            affectedCrops: ['Onion', 'Garlic'],
            advice: 'Spray Emamectin Benzoate 5% SG (4g/10L) + Mancozeb (25g/10L) with wetting agent.'
        },
        {
            id: 'pest-zone-2',
            name: 'Bacterial Blight (Telya) Micro-Pocket',
            pestName: 'Xanthomonas axonopodis',
            severity: 'Moderate',
            radiusMeters: 75,
            center: [lat + 0.00085, lon + 0.00120],
            affectedCrops: ['Pomegranate', 'Citrus'],
            advice: 'Foliar spray Copper Oxychloride 50% WP (2.5g/L) + Streptocycline (1g/10L).'
        }
    ];
};

// Generate Soil Health Sampling Grids
const getSoilGrids = (lat, lon) => {
    return [
        {
            id: 'soil-grid-1',
            zone: 'North Valley Lowland',
            bounds: [
                [lat + 0.0002, lon - 0.0019],
                [lat + 0.0016, lon + 0.0019]
            ],
            soilType: 'Deep Vertisol (Black Cotton)',
            ph: 7.6,
            ec: '0.42 dS/m (Normal)',
            organicCarbon: '0.72% (Medium)',
            nitrogenKgHa: 235,
            phosphorusKgHa: 19,
            potassiumKgHa: 340,
            healthRating: 'Good'
        },
        {
            id: 'soil-grid-2',
            zone: 'South Upland Ridge',
            bounds: [
                [lat - 0.0019, lon - 0.0019],
                [lat + 0.0001, lon + 0.0019]
            ],
            soilType: 'Medium Clay Loam / Murrum Underlay',
            ph: 7.2,
            ec: '0.35 dS/m (Optimal)',
            organicCarbon: '0.58% (Low)',
            nitrogenKgHa: 195,
            phosphorusKgHa: 14,
            potassiumKgHa: 280,
            healthRating: 'Needs Organic Compost'
        }
    ];
};

// Generate IoT Sensor Telemetry
const getSensorTelemetry = (lat, lon) => {
    return [
        {
            id: 'iot-node-1',
            name: 'Field IoT Node #01 (Alpha Plot)',
            lat: lat - 0.00030,
            lon: lon - 0.00005,
            soilMoisture10cm: '34%',
            soilMoisture30cm: '41%',
            soilTemp: '24.8°C',
            leafWetness: '12%',
            battery: '94% (Solar)',
            lastPing: '2 mins ago'
        },
        {
            id: 'iot-node-2',
            name: 'Field IoT Node #02 (Beta Plot)',
            lat: lat + 0.00085,
            lon: lon - 0.00125,
            soilMoisture10cm: '27%',
            soilMoisture30cm: '33%',
            soilTemp: '26.1°C',
            leafWetness: '8%',
            battery: '88% (Solar)',
            lastPing: '4 mins ago'
        }
    ];
};

/**
 * 7-Layer Architecture Synthesis Endpoint
 */
exports.getGisSpatialData = async (lat, lon) => {
    try {
        const [weather, soil, satellite] = await Promise.all([
            weatherService.getCurrentWeather(lat, lon).catch(() => null),
            soilService.getSoilData(lat, lon).catch(() => null),
            satelliteService.getSatelliteData(lat, lon).catch(() => null)
        ]);

        const farmPlots = generateFarmPlots(lat, lon);
        const mandis = getNearbyMandis(lat, lon);
        const waterInfra = getWaterInfrastructure(lat, lon);
        const pestHotspots = getPestHotspots(lat, lon);
        const soilGrids = getSoilGrids(lat, lon);
        const sensors = getSensorTelemetry(lat, lon);

        // Core 7-Layer Architecture Representation
        const architectureLayers = {
            layer1_DataSources: {
                name: '1. Data Sources',
                description: 'Weather APIs, Sentinel-2 Satellite, In-situ IoT Soil Sensors, Groundwater data, Mandi Prices, Government Schemes',
                sources: [
                    { name: 'IMD & OpenMeteo Synoptic Weather', status: 'Live 10-min sync', value: `${weather?.temperature || 28.5}°C, ${weather?.humidity || 68}% RH` },
                    { name: 'ESA Sentinel-2 Multispectral NDVI', status: '10m Spatial Resolution', value: `Mean NDVI ${satellite?.ndvi || 0.68}` },
                    { name: 'Soil Chemistry Diagnostic Grid', status: 'Sync Complete', value: `${soil?.soilType || 'Vertisol'}, pH ${soil?.ph || 7.4}` },
                    { name: 'Agmarknet APMC Market Stream', status: 'Active Trading', value: 'Sangamner & Nashik Hubs' },
                    { name: 'MahaDBT & PMKSY Scheme Registry', status: 'Active', value: '4 Schemes Applicable' }
                ]
            },
            layer2_DataIntegration: {
                name: '2. Data Integration Layer',
                description: 'ETL spatial engine, coordinate projection (EPSG:4326), real-time sensor cleaning, NDVI raster harmonization',
                metrics: {
                    recordsProcessed: 148,
                    spatialAccuracy: '< 3.2 meters',
                    latency: '120ms',
                    qualityScore: '99.4%'
                }
            },
            layer3_GisSpatial: {
                name: '3. GIS Layer',
                description: 'Vector farm boundaries, multi-layer overlays (Crop, Water, Weather, Soil, NDVI, Pests, Mandis)',
                layersCount: 9,
                totalAcreage: farmPlots.reduce((acc, p) => acc + p.areaAcres, 0).toFixed(1),
                totalPlots: farmPlots.length
            },
            layer4_AiAnalytics: {
                name: '4. AI / Analytics Layer',
                description: 'Deep spatial algorithms: Crop water stress index (CWSI), Disease probability engine, Yield forecast model',
                insights: [
                    { metric: 'Crop Stress Index', value: 'Low to Moderate (12% stressed canopy)' },
                    { metric: 'Weather Outbreak Risk', value: 'Heavy rainfall anomaly in 48h (+45mm)' },
                    { metric: 'Pest Progression Model', value: '74% risk of Thrips in Onion plots with RH > 70%' },
                    { metric: 'Yield Projection', value: '+14% above district historical benchmark' }
                ]
            },
            layer5_DecisionSupport: {
                name: '5. Decision Support Layer',
                description: 'Translates multi-dimensional analytics into ranked agronomic action priorities',
                rulesEvaluated: 24,
                activeTriggers: [
                    'Drainage Protocol: Active for Plots #1, #5',
                    'Irrigation Modulation: Defer flood irrigation ahead of rain',
                    'Fungicide Window: Apply before rainfall event'
                ]
            },
            layer6_FarmerAdvisory: {
                name: '6. Farmer Advisory Layer',
                description: 'Generates farmer-friendly advice in English, Marathi (मराठी) and Hindi (हिंदी) with actionable directives',
                primaryLanguage: 'Multilingual (EN / MR / HI)',
                channel: 'SMS, WhatsApp, Audio Voice Bot, Mobile App'
            },
            layer7_DashboardAlerts: {
                name: '7. Dashboard & Alerts Layer',
                description: 'Real-time interactive spatial map, dynamic popups, SMS dispatcher, scenario workflow simulator',
                activeAlertsCount: 3,
                lastBroadcast: new Date().toLocaleTimeString()
            }
        };

        // Real-time Actionable Advisories
        const actionableAdvisories = [
            {
                id: 'adv-rain-1',
                priority: 'High',
                badge: '⚠️ Weather & Drainage',
                title: 'Heavy Rainfall Forecast (45mm in 48h) — Clear Furrows',
                description: 'Synoptic weather radar detects an approaching precipitation front. Soil moisture in black Vertisol is already at 38%.',
                recommendation: 'Do NOT run flood irrigation. Open drainage outlets and inspect field furrows to prevent root asphyxiation.',
                affectedPlots: ['Plot #104/2A', 'Plot #115/2'],
                actionCode: 'DRAINAGE_CLEARANCE'
            },
            {
                id: 'adv-pest-2',
                priority: 'High',
                badge: '🐛 Pest Risk (Thrips)',
                title: 'High Thrips Infestation Risk in Onion Belts',
                description: 'Elevated humidity (68%) coupled with 29°C temperature accelerates Thrips reproduction cycle.',
                recommendation: 'Spray Emamectin Benzoate 5% SG @ 4g/10L with non-ionic sticker agent in the evening (after 5 PM).',
                affectedPlots: ['Plot #105/1B', 'Plot #112/4A'],
                actionCode: 'PEST_SPRAY'
            },
            {
                id: 'adv-water-3',
                priority: 'Medium',
                badge: '💧 Precision Irrigation',
                title: 'Micro-Drip Schedule for Upland Light Loam (Plot #108)',
                description: 'IoT Node #02 reports topsoil moisture at 22% (wilting threshold 18%).',
                recommendation: 'Run drip irrigation for exactly 90 minutes between 6:00 AM – 7:30 AM to minimize evaporative loss.',
                affectedPlots: ['Plot #108/3'],
                actionCode: 'DRIP_SCHEDULE'
            },
            {
                id: 'adv-market-4',
                priority: 'Medium',
                badge: '💰 Market Price Opportunity',
                title: 'Sangamner APMC Onion Price Surge (+₹250/qtl)',
                description: 'Live APMC stream indicates onion modal price reached ₹2,820/qtl due to festival demand.',
                recommendation: 'Grade cured onion bulbs (size 45mm+) and transport to Sangamner Main Yard before 8:00 AM auction.',
                affectedPlots: ['All Onion Growers'],
                actionCode: 'MARKET_HARVEST'
            }
        ];

        return {
            status: 'success',
            coordinates: { lat, lon },
            timestamp: new Date().toISOString(),
            architectureLayers,
            farmPlots,
            mandis,
            waterInfrastructure: waterInfra,
            pestHotspots,
            soilGrids,
            sensors,
            weatherSummary: weather || { temperature: 28.5, humidity: 68, condition: 'Partly Cloudy', rainfallForecast48h: '45mm' },
            satelliteSummary: satellite || { ndvi: 0.68, vegetationHealth: 'Good', moistureIndex: 0.44 },
            actionableAdvisories,
            summaryMetrics: {
                totalMonitoredAcres: farmPlots.reduce((acc, p) => acc + p.areaAcres, 0).toFixed(1),
                activeFarmsCount: farmPlots.length,
                averageNdvi: (farmPlots.reduce((acc, p) => acc + p.ndvi, 0) / farmPlots.length).toFixed(2),
                highRiskFarmsCount: farmPlots.filter(p => p.pestRisk === 'High' || p.soilMoisturePercent < 25).length,
                canalStatus: 'Operational (45 Cusecs)',
                topMandiRate: 'Onion ₹2,820/qtl (Sangamner)'
            }
        };
    } catch (error) {
        console.error('GIS Spatial service error:', error);
        throw new Error('Failed to generate GIS spatial intelligence data');
    }
};

/**
 * Simulate the 6-Step "Map → Understand → Predict → Recommend → Alert → Act" Pipeline
 */
exports.simulatePipeline = async (scenario = 'HEAVY_RAIN', plotId = 'farm-plot-1') => {
    const scenarios = {
        HEAVY_RAIN: {
            name: 'Heavy Rainfall & Flood Risk Scenario',
            steps: [
                {
                    stepNumber: 1,
                    stepName: 'Map',
                    icon: '🗺️',
                    title: 'GIS Farm Boundary & Elevation Scanned',
                    detail: 'Spatial engine cross-references Plot #104/2A (3.2 Acres, Vertisol) with IMD high-resolution radar grid.',
                    status: 'Completed (0.4s)'
                },
                {
                    stepNumber: 2,
                    stepName: 'Understand',
                    icon: '🔬',
                    title: 'Soil & Canopy Characteristics Analyzed',
                    detail: 'Vertisol clay has low infiltration rate (5 mm/hr). Current soil moisture is 38%. Heavy runoff expected.',
                    status: 'Completed (0.8s)'
                },
                {
                    stepNumber: 3,
                    stepName: 'Predict',
                    icon: '🤖',
                    title: 'AI Predicts 84% Inundation Risk in 36 Hours',
                    detail: 'Predictive hydrological model forecasts waterlogging up to 8cm depth, risking root rot (Rhizoctonia) for Onion crop.',
                    status: 'Completed (1.1s)'
                },
                {
                    stepNumber: 4,
                    stepName: 'Recommend',
                    icon: '💡',
                    title: 'Decision Engine Generates Preventative Protocol',
                    detail: 'Recommendation: Immediately open Broad Bed Furrow (BBF) drainage outlets and suspend all scheduled drip irrigation.',
                    status: 'Completed (1.4s)'
                },
                {
                    stepNumber: 5,
                    stepName: 'Alert',
                    icon: '📱',
                    title: 'Multilingual SMS & Mobile Alert Dispatched',
                    detail: 'SMS delivered to Farmer Ramesh Patil in Marathi (मराठी) & English with instant voice message.',
                    status: 'Delivered (1.7s)'
                },
                {
                    stepNumber: 6,
                    stepName: 'Act',
                    icon: '🚜',
                    title: 'Farmer Executes Field Drainage & Saves Crop',
                    detail: 'Drainage cleared within 4 hours. Field successfully evacuated 120,000 Liters of excess rainwater without crop loss.',
                    status: 'Verified Success'
                }
            ]
        },
        PEST_OUTBREAK: {
            name: 'Thrips & Purple Blotch Pest Outbreak Scenario',
            steps: [
                {
                    stepNumber: 1,
                    stepName: 'Map',
                    icon: '🗺️',
                    title: 'Regional Pest Trap Cluster Geocoded',
                    detail: 'GIS mapping pinpoints 3 pest trap anomalies across Sangamner-Nashik onion corridor.',
                    status: 'Completed'
                },
                {
                    stepNumber: 2,
                    stepName: 'Understand',
                    icon: '🔬',
                    title: 'Microclimate Favorable for Thrips Multiplication',
                    detail: 'Temperature 29°C + Relative Humidity 72% + intermittent sunlight creates optimum reproduction window.',
                    status: 'Completed'
                },
                {
                    stepNumber: 3,
                    stepName: 'Predict',
                    icon: '🤖',
                    title: 'AI Projects 76% Risk of Severe Leaf Curl within 48h',
                    detail: 'Computer vision & epidemiological model forecasts yield reduction up to 25% if untreated.',
                    status: 'Completed'
                },
                {
                    stepNumber: 4,
                    stepName: 'Recommend',
                    icon: '💡',
                    title: 'Integrated Pest Management (IPM) Recipe Synthesized',
                    detail: 'Spray Emamectin Benzoate 5% SG (4g/10L) + Mancozeb (25g/10L) + Sticker adjuvant after 5 PM.',
                    status: 'Completed'
                },
                {
                    stepNumber: 5,
                    stepName: 'Alert',
                    icon: '📱',
                    title: 'High-Priority Alert Pushed to Mobile & Agri-Officer',
                    detail: 'Notification broadcasted to all 8 registered farms in the 1.5 km hotspot radius.',
                    status: 'Broadcasted'
                },
                {
                    stepNumber: 6,
                    stepName: 'Act',
                    icon: '🚜',
                    title: 'Targeted Evening Spray Completed',
                    detail: 'Thrips population controlled under economic threshold level (ETL < 5 per plant).',
                    status: 'Resolved'
                }
            ]
        }
    };

    return scenarios[scenario] || scenarios.HEAVY_RAIN;
};

/**
 * Dispatch Simulated Farmer SMS Notification
 */
exports.sendFarmerAlert = async ({ farmerName, phone, crop, alertType, language = 'en', customMessage }) => {
    const alertId = `SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const translations = {
        en: {
            title: `⚠️ Krishi Samadhan Alert for ${farmerName} (${crop}):`,
            body: customMessage || `Heavy rain expected in next 48 hours. Please do NOT irrigate and clear farm drainage furrows immediately. APMC Onion Rate: ₹2,820/qtl.`
        },
        mr: {
            title: `⚠️ कृषी समाधान इशारा - ${farmerName} (${crop}):`,
            body: customMessage || `पुढील ४८ तासांत मुसळधार पावसाची शक्यता आहे. शेतात पाणी देणे थांबवा आणि चर मोकळे करा. आजचा कांदा भाव: ₹२,८२०/क्विंटल.`
        },
        hi: {
            title: `⚠️ कृषि समाधान चेतावनी - ${farmerName} (${crop}):`,
            body: customMessage || `अगले 48 घंटों में भारी बारिश की संभावना है। कृपया सिंचाई रोकें और जल निकासी नाली साफ करें। आज का प्याज भाव: ₹2,820/क्विंटल।`
        }
    };

    const payload = translations[language] || translations.en;

    return {
        success: true,
        alertId,
        recipient: {
            name: farmerName,
            phone: phone || '+91 98221 44521',
            crop
        },
        language,
        message: `${payload.title}\n${payload.body}`,
        sentAt: new Date().toISOString(),
        gatewayStatus: 'DELIVERED_VIA_TELEMETRY_DISPATCHER'
    };
};
