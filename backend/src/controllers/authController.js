const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const db = await getDb();
        const existingUser = db.exec("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const userRole = role || 'farmer';

        const stmt = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
        stmt.run([name, email, password_hash, userRole]);
        const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        stmt.free();

        const token = jwt.sign({ id, email, role: userRole }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id, name, email, role: userRole } });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await getDb();
        const result = db.exec("SELECT * FROM users WHERE email = ?", [email]);
        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0].values[0];
        const columns = result[0].columns;
        const userData = {};
        columns.forEach((col, i) => userData[col] = user[i]);

        const isValid = await bcrypt.compare(password, userData.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: userData.id, email: userData.email, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        delete userData.password_hash;
        res.json({ token, user: userData });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const db = await getDb();
        const result = db.exec("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result[0].values[0];
        const columns = result[0].columns;
        const userData = {};
        columns.forEach((col, i) => userData[col] = user[i]);
        delete userData.password_hash;

        res.json({ user: userData });
    } catch (err) {
        next(err);
    }
};
