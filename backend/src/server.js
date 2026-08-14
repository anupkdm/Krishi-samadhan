const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { getDb } = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // To allow loading images

// Enable flexible CORS for local development, local Wi-Fi / multi-device network, and deployed domains
app.use(cors({
    origin: true, // Automatically reflect request origin
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint for multi-device & cloud verification
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', name: 'Krishi Samadhan API', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const soilRoutes = require('./routes/soil');
const satelliteRoutes = require('./routes/satellite');
const pestRoutes = require('./routes/pest');
const schemesRoutes = require('./routes/schemes');
const advisoryRoutes = require('./routes/advisory');
const chatbotRoutes = require('./routes/chatbot');
const inputStoreRoutes = require('./routes/inputStore');

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/pest', pestRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/input-stores', inputStoreRoutes);

app.use(errorHandler);

async function startServer() {
    try {
        await getDb(); // Initialize database
        console.log('Database initialized.');
        // Bind to 0.0.0.0 to allow access from other devices on the same Wi-Fi / Local Network
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
