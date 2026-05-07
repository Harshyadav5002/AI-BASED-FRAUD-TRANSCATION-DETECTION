/**
 * Fraud Detection Logic (Rule-based + Mock AI)
 */
class FraudDetectionService {
    static checkFraud(transaction, userPastTransactions = []) {
        let fraudScore = 0;
        let reasons = [];

        // Rule 1: High-value transaction anomaly (Amount > 10,000)
        if (transaction.amount > 10000) {
            fraudScore += 40;
            reasons.push("High value transaction anomaly");
        }

        // Rule 2: Multiple rapid transactions check
        // Assuming userPastTransactions are sorted by date desc
        const recentTxns = userPastTransactions.filter(t => 
            (new Date(transaction.date) - new Date(t.date)) < 5 * 60 * 1000 // 5 minutes
        );
        if (recentTxns.length >= 2) {
            fraudScore += 30;
            reasons.push("Rapid successive transactions");
        }

        // Rule 3: Unusual location/Country
        if (transaction.location && transaction.location.country && ['HighRiskCountry1', 'HighRiskCountry2'].includes(transaction.location.country)) {
            fraudScore += 25;
            reasons.push("Suspicious location/IP change");
        }

        // Mock AI Model integration
        // In a real app, you would send data to a Python Flask ML microservice here
        // e.g. const aiResponse = await axios.post('http://localhost:8000/predict', transaction);
        const mockAiScore = Math.floor(Math.random() * 20); 
        fraudScore += mockAiScore;
        if (mockAiScore > 15) {
            reasons.push("AI Model labeled as high-risk anomaly");
        }

        // Cap at 100%
        fraudScore = Math.min(fraudScore, 100);

        // Threshold for fraud is 70%
        const isFraud = fraudScore >= 70; 

        return {
            fraudScore,
            isFraud,
            reasons
        };
    }
}

module.exports = FraudDetectionService;
