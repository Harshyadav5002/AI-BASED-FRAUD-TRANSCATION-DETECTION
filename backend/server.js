require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Setup DB connection (MongoDB)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fraud_checker';
mongoose.connect(MONGO_URI, { 
    serverSelectionTimeoutMS: 3000, // Fail fast if no Mongo found
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.log('---');
    console.log('NOTICE: MongoDB not detected on localhost. API is operating in [LOCAL JSON FALLBACK] mode.');
    console.log('Incoming transactions will be validated using sample_transactions.json.');
    console.log('---');
});

// Basic route
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// General Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
