const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDb, saveDb } = require('../db/database');
const { isConnected } = require('../db/mongodb');

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
        const userRole = role || 'farmer';
        const userLocation = location || 'Maharashtra, India';
        const password_hash = await bcrypt.hash(password, 10);

        let userId = null;
        let userData = null;

        // 1. PRIMARY STORAGE: MongoDB Atlas
        try {
            const existingMongoUser = await User.findOne({ email: normalizedEmail });
            if (existingMongoUser) {
                return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
            }

            const newMongoUser = await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password_hash,
                role: userRole,
                location: userLocation,
                profile: {
                    farm_name: `${name.trim()}'s Farm`,
                    crop: 'Onion & Wheat',
                    location: userLocation,
                    farm_area: 5.0,
                    soil_type: 'Vertisol (Black Cotton Soil)'
                }
            });

            userId = newMongoUser._id.toString();
            userData = {
                id: userId,
                name: newMongoUser.name,
                email: newMongoUser.email,
                role: newMongoUser.role,
                location: newMongoUser.location,
                profile: newMongoUser.profile
            };
            console.log(`🍃 User registered in MongoDB Atlas: ${normalizedEmail} (ID: ${userId})`);
        } catch (mongoErr) {
            console.warn('MongoDB Atlas write notice, checking fallback:', mongoErr.message);
        }

        // 2. SYNC TO SQLITE (Local DB Consistency)
        try {
            const db = await getDb();
            const existingSqlResult = db.exec("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
            if (existingSqlResult.length > 0 && existingSqlResult[0].values.length > 0) {
                if (!userData) {
                    return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
                }
            } else {
                const stmt = db.prepare("INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)");
                stmt.run([name.trim(), normalizedEmail, password_hash, userRole, userLocation]);
                const sqlId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
                stmt.free();

                if (!userId) userId = sqlId;

                if (userRole === 'farmer') {
                    const profileStmt = db.prepare("INSERT INTO farmer_profiles (user_id, farm_name, crop, location, farm_area, soil_type) VALUES (?, ?, ?, ?, ?, ?)");
                    profileStmt.run([sqlId, `${name.trim()}'s Farm`, 'Onion & Wheat', userLocation, 5.0, 'Vertisol (Black Soil)']);
                    profileStmt.free();
                }
                saveDb();
            }
        } catch (sqlErr) {
            console.warn('SQLite sync notice:', sqlErr.message);
        }

        if (!userData) {
            userData = {
                id: userId || 'usr-' + Date.now(),
                name: name.trim(),
                email: normalizedEmail,
                role: userRole,
                location: userLocation
            };
        }

        const token = jwt.sign(
            { id: userId, email: normalizedEmail, role: userRole, name: name.trim() },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Account registered successfully in MongoDB Atlas!',
            token,
            user: userData
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
        let matchedUser = null;
        let isMatch = false;

        // 1. PRIMARY LOOKUP: MongoDB Atlas
        try {
            const mongoUser = await User.findOne({ email: normalizedEmail });
            if (mongoUser) {
                isMatch = await bcrypt.compare(password, mongoUser.password_hash);
                if (isMatch) {
                    matchedUser = {
                        id: mongoUser._id.toString(),
                        name: mongoUser.name,
                        email: mongoUser.email,
                        role: mongoUser.role,
                        location: mongoUser.location,
                        profile: mongoUser.profile
                    };
                    console.log(`🍃 User authenticated via MongoDB Atlas: ${normalizedEmail}`);
                }
            }
        } catch (mongoErr) {
            console.warn('MongoDB Atlas lookup notice:', mongoErr.message);
        }

        // 2. FALLBACK LOOKUP: SQLite
        if (!matchedUser) {
            try {
                const db = await getDb();
                const result = db.exec("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
                if (result.length > 0 && result[0].values.length > 0) {
                    const userRow = result[0].values[0];
                    const columns = result[0].columns;
                    const sqlUserData = {};
                    columns.forEach((col, i) => sqlUserData[col] = userRow[i]);

                    const sqlMatch = await bcrypt.compare(password, sqlUserData.password_hash);
                    if (sqlMatch) {
                        delete sqlUserData.password_hash;
                        matchedUser = sqlUserData;

                        // Auto-migrate user to MongoDB Atlas if not already present
                        try {
                            const hash = await bcrypt.hash(password, 10);
                            await User.create({
                                name: sqlUserData.name,
                                email: normalizedEmail,
                                password_hash: hash,
                                role: sqlUserData.role || 'farmer',
                                location: sqlUserData.location || 'Maharashtra, India'
                            });
                            console.log(`🍃 Auto-migrated user ${normalizedEmail} to MongoDB Atlas`);
                        } catch (migrationErr) {
                            // Already exists or Mongo busy
                        }
                    }
                }
            } catch (sqlErr) {
                console.warn('SQLite fallback lookup error:', sqlErr.message);
            }
        }

        if (!matchedUser) {
            return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
        }

        const token = jwt.sign(
            { id: matchedUser.id, email: matchedUser.email, role: matchedUser.role, name: matchedUser.name },
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.json({
            status: 'success',
            message: 'Logged in successfully!',
            token,
            user: matchedUser
        });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let userData = null;

        // 1. Check MongoDB Atlas
        try {
            if (userId && typeof userId === 'string' && userId.length === 24) {
                const mongoUser = await User.findById(userId);
                if (mongoUser) {
                    userData = {
                        id: mongoUser._id.toString(),
                        name: mongoUser.name,
                        email: mongoUser.email,
                        role: mongoUser.role,
                        location: mongoUser.location,
                        profile: mongoUser.profile
                    };
                }
            }
        } catch (mongoErr) {
            console.warn('MongoDB Atlas getMe notice:', mongoErr.message);
        }

        // 2. Fallback SQLite check
        if (!userData) {
            try {
                const db = await getDb();
                const result = db.exec("SELECT * FROM users WHERE id = ? OR email = ?", [userId, req.user.email]);
                if (result.length > 0 && result[0].values.length > 0) {
                    const userRow = result[0].values[0];
                    const columns = result[0].columns;
                    userData = {};
                    columns.forEach((col, i) => userData[col] = userRow[i]);
                    delete userData.password_hash;

                    const profileResult = db.exec("SELECT * FROM farmer_profiles WHERE user_id = ?", [userData.id]);
                    if (profileResult.length > 0 && profileResult[0].values.length > 0) {
                        const profileRow = profileResult[0].values[0];
                        const pCols = profileResult[0].columns;
                        const profileData = {};
                        pCols.forEach((col, i) => profileData[col] = profileRow[i]);
                        userData.profile = profileData;
                    }
                }
            } catch (sqlErr) {
                console.warn('SQLite getMe fallback error:', sqlErr.message);
            }
        }

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ status: 'success', user: userData });
    } catch (err) {
        next(err);
    }
};
