const Transaction = require('../models/Transaction');
const FraudDetectionService = require('../services/fraudDetectionService');
const fs = require('fs');
const path = require('path');

const getLocalData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/sample_transactions.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const transactionData = req.body;
        
        // Fetch past transactions for the user to determine rapid fire anomalies
        const pastTransactions = await Transaction.find({ userId: transactionData.userId })
            .sort({ date: -1 })
            .limit(10);

        // Run Rule-based + AI check
        const { fraudScore, isFraud, reasons } = FraudDetectionService.checkFraud(transactionData, pastTransactions);

        // Create new transaction heavily annotated with fraud data
        const newTransaction = new Transaction({
            ...transactionData,
            isFraud,
            fraudScore,
            flagReason: reasons,
            status: isFraud ? 'Rejected' : 'Approved'
        });

        await newTransaction.save();

        res.status(201).json({
            success: true,
            data: newTransaction,
            message: isFraud ? 'Transaction flagged as fraud' : 'Transaction approved'
        });

    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        let transactions = [];
        // Check if mongoose is connected
        if (require('mongoose').connection.readyState === 1) {
            transactions = await Transaction.find().sort({ date: -1 });
        } else {
            transactions = getLocalData();
        }
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        // Fallback to local data on error
        const transactions = getLocalData();
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        let transaction = null;
        if (require('mongoose').connection.readyState === 1) {
            transaction = await Transaction.findOne({ transactionId: req.params.id });
        }
        
        if (!transaction) {
            const localData = getLocalData();
            transaction = localData.find(t => t.transactionId === req.params.id);
        }

        if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
        
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
