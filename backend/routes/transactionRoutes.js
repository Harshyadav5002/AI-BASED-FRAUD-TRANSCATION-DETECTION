const express = require('express');
const { createTransaction, getAllTransactions, getTransactionById } = require('../controllers/transactionController');
const router = express.Router();

// Mock endpoints for the simulation
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/check', createTransaction); // Checks and saves the transaction

module.exports = router;
