const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true }, // Simple string for Demo
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    location: {
        ip: { type: String },
        country: { type: String },
        lat: { type: Number },
        long: { type: Number }
    },
    deviceInfo: {
        deviceType: { type: String }, // Mobile, Desktop
        os: { type: String }
    },
    merchantDetails: {
        category: { type: String },
        name: { type: String }
    },
    transactionType: { type: String, enum: ['Debit', 'Credit'], default: 'Debit' },
    
    // Fraud related fields
    isFraud: { type: Boolean, default: false },
    fraudScore: { type: Number, default: 0 },
    flagReason: { type: [String], default: [] },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
