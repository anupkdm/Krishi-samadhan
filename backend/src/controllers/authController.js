const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, saveDb } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'krishi-samadhan-jwt-secret-key-2026';

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, location } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Please enter your full name.' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = await getDb();
        
        // Check if user already exists
        const existingResult = db.exec("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
        if (existingResult.length > 0 && existingResult[0].values.length > 0) {
            return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const userRole = role || 'farmer';
        const userLocation = location || 'Maharashtra, India';

        const stmt = db.prepare("INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)");
        stmt.run([name.trim(), normalizedEmail, password_hash, userRole, userLocation]);
        const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        stmt.free();

        // Create default farmer profile if role is farmer
        if (userRole === 'farmer') {
            const profileStmt = db.prepare("INSERT INTO farmer_profiles (user_id, farm_name, crop, location, farm_area, soil_type) VALUES (?, ?, ?, ?, ?, ?)");
            profileStmt.run([id, `${name.trim()}'s Farm`, 'Onion & Wheat', userLocation, 5.0, 'Vertisol (Black Soil)']);
            profileStmt.free();
        }

        // Persist to disk
        saveDb();

        const token = jwt.sign(
            { id, email: normalizedEmail, role: userRole, name: name.trim() },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Account registered successfully!',
            token,
            user: {
                id,
                name: name.trim(),
                email: normalizedEmail,
                role: userRole,
                location: userLocation
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = await getDb();
        
        const result = db.exec("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
        }

        const userRow = result[0].values[0];
        const columns = result[0].columns;
        const userData = {};
        columns.forEach((col, i) => userData[col] = userRow[i]);

        const isMatch = await bcrypt.compare(password, userData.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
        }

        const token = jwt.sign(
            { id: userData.id, email: userData.email, role: userData.role, name: userData.name },
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        delete userData.password_hash;
        
        res.json({
            status: 'success',
            message: 'Logged in successfully!',
            token,
            user: userData
        });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const db = await getDb();
        const result = db.exec("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userRow = result[0].values[0];
        const columns = result[0].columns;
        const userData = {};
        columns.forEach((col, i) => userData[col] = userRow[i]);
        delete userData.password_hash;

        // Fetch associated farmer profile if available
        const profileResult = db.exec("SELECT * FROM farmer_profiles WHERE user_id = ?", [req.user.id]);
        if (profileResult.length > 0 && profileResult[0].values.length > 0) {
            const profileRow = profileResult[0].values[0];
            const pCols = profileResult[0].columns;
            const profileData = {};
            pCols.forEach((col, i) => profileData[col] = profileRow[i]);
            userData.profile = profileData;
        }

        res.json({ status: 'success', user: userData });
    } catch (err) {
        next(err);
    }
};
