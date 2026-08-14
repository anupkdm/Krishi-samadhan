const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../database.sqlite');
let dbInstance = null;

async function getDb() {
    if (dbInstance) return dbInstance;

    const SQL = await initSqlJs();
    let db;
    if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(filebuffer);
    } else {
        db = new SQL.Database();
    }

    dbInstance = db;
    initTables(db);
    seedSchemes(db);
    saveDb();
    
    return db;
}

function initTables(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            email TEXT UNIQUE, 
            password_hash TEXT, 
            role TEXT DEFAULT 'farmer', 
            location TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS farmer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            user_id INTEGER, 
            farm_name TEXT, 
            crop TEXT, 
            location TEXT, 
            farm_area REAL, 
            soil_type TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS advisory_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            farmer_id INTEGER, 
            type TEXT, 
            priority TEXT, 
            title TEXT, 
            description TEXT, 
            action TEXT, 
            source_data TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS market_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            commodity TEXT, 
            market TEXT, 
            district TEXT, 
            state TEXT, 
            min_price REAL, 
            max_price REAL, 
            modal_price REAL, 
            price_date TEXT, 
            source TEXT
        );
        CREATE TABLE IF NOT EXISTS weather_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            latitude REAL, 
            longitude REAL, 
            temperature REAL, 
            humidity REAL, 
            rainfall REAL, 
            wind_speed REAL, 
            weather_code INTEGER, 
            forecast_json TEXT, 
            fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS pest_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            farmer_id INTEGER, 
            crop TEXT, 
            image_url TEXT, 
            prediction TEXT, 
            confidence REAL, 
            severity TEXT, 
            recommendation TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS government_schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            description TEXT, 
            benefits TEXT, 
            eligibility TEXT, 
            category TEXT, 
            official_url TEXT, 
            ministry TEXT, 
            status TEXT DEFAULT 'Active'
        );
    `);
}

function seedSchemes(db) {
    const res = db.exec("SELECT count(*) as count FROM government_schemes");
    const count = res[0].values[0][0];
    
    if (count === 0) {
        const schemes = [
            ["PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", "Income support scheme for farmers.", "6000 INR per year in 3 installments", "All landholding farmers families", "income support", "https://pmkisan.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["PMFBY (Pradhan Mantri Fasal Bima Yojana)", "Crop insurance scheme to protect against natural calamities.", "Financial support in case of crop failure", "All farmers growing notified crops", "crop insurance", "https://pmfby.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)", "Solar irrigation pumps for farmers.", "Subsidy on solar pumps setup", "Individual farmers, water user associations", "solar/irrigation", "https://mnre.gov.in/pm-kusum", "Ministry of New and Renewable Energy"],
            ["Soil Health Card Scheme", "Information on soil health and fertilizer recommendations.", "Optimized use of fertilizers, better yields", "All farmers across the country", "soil health", "https://soilhealth.dac.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["Kisan Credit Card", "Adequate and timely credit support to farmers.", "Low interest loans, easy repayment", "Farmers, individuals/joint borrowers", "credit", "https://www.pmkisan.gov.in/kcc", "Ministry of Finance"],
            ["e-NAM (National Agriculture Market)", "Pan-India electronic trading portal for agricultural commodities.", "Better price discovery, transparent trading", "Farmers, FPOs, traders", "market", "https://enam.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["RKVY (Rashtriya Krishi Vikas Yojana)", "Development of agriculture and allied sectors infrastructure.", "Financial assistance for infrastructure", "States and Union Territories", "infrastructure", "https://rkvy.nic.in", "Ministry of Agriculture and Farmers Welfare"],
            ["PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)", "Focus on end-to-end solutions in irrigation supply chain.", "More crop per drop, water use efficiency", "Farmers across the country", "irrigation", "https://pmksy.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["National Mission on Sustainable Agriculture", "Promote sustainable agriculture practices.", "Climate resilient farming, soil health management", "Farmers and state governments", "sustainability", "https://nmsa.dac.gov.in", "Ministry of Agriculture and Farmers Welfare"],
            ["Agricultural Infrastructure Fund", "Financing facility for post-harvest management infrastructure.", "Interest subvention and credit guarantee", "Farmers, PACS, FPOs, agri-entrepreneurs", "infrastructure", "https://agriinfra.dac.gov.in", "Ministry of Agriculture and Farmers Welfare"]
        ];

        const stmt = db.prepare("INSERT INTO government_schemes (name, description, benefits, eligibility, category, official_url, ministry) VALUES (?, ?, ?, ?, ?, ?, ?)");
        schemes.forEach(s => stmt.run(s));
        stmt.free();
    }
}

function saveDb() {
    if (dbInstance) {
        const data = dbInstance.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

process.on('exit', () => saveDb());
process.on('SIGINT', () => {
    saveDb();
    process.exit();
});

module.exports = { getDb, saveDb };
