const { getDb } = require('../db/database');

exports.getSchemes = async (search, category) => {
    try {
        const db = await getDb();
        let query = "SELECT * FROM government_schemes WHERE 1=1";
        const params = [];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }
        
        if (search) {
            query += " AND (name LIKE ? OR description LIKE ? OR benefits LIKE ?)";
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const result = db.exec(query, params);
        if (result.length === 0) return [];

        const columns = result[0].columns;
        return result[0].values.map(row => {
            const obj = {};
            columns.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
    } catch (error) {
        console.error('Schemes service error:', error);
        throw new Error('Failed to retrieve schemes');
    }
};

exports.getSchemeById = async (id) => {
    try {
        const db = await getDb();
        let result = [];
        if (!isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === String(id).trim()) {
            result = db.exec("SELECT * FROM government_schemes WHERE id = ?", [parseInt(id, 10)]);
        }
        if (result.length === 0) {
            const cleanQuery = String(id).replace(/[-_]/g, '%');
            result = db.exec("SELECT * FROM government_schemes WHERE id = ? OR name LIKE ? OR description LIKE ?", [id, `%${cleanQuery}%`, `%${cleanQuery}%`]);
        }
        if (result.length === 0) return null;

        const row = result[0].values[0];
        const columns = result[0].columns;
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    } catch (error) {
        console.error('Schemes service error:', error);
        throw new Error('Failed to retrieve scheme details');
    }
};
