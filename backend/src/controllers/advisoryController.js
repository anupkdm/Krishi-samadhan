const advisoryService = require('../services/advisoryService');
const { getDb } = require('../db/database');

exports.getAdvisory = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) are required' });
        }

        const advisories = await advisoryService.generateAdvisories(lat, lon);
        res.json({ advisories });
    } catch (err) {
        next(err);
    }
};

exports.generateAdvisory = async (req, res, next) => {
    try {
        const { lat, lon } = req.body;
        
        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
            return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) are required' });
        }

        const advisories = await advisoryService.generateAdvisories(parseFloat(lat), parseFloat(lon));
        
        if (req.user) {
            const db = await getDb();
            const stmt = db.prepare("INSERT INTO advisory_records (farmer_id, type, priority, title, description, action) VALUES (?, ?, ?, ?, ?, ?)");
            for (const adv of advisories) {
                stmt.run([req.user.id, adv.type, adv.priority, adv.title, adv.description, adv.action]);
            }
            stmt.free();
        }

        res.json({ advisories, message: 'Advisories generated and saved.' });
    } catch (err) {
        next(err);
    }
};
