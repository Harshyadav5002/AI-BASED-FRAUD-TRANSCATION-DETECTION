const fs = require('fs');

const transactions = [];
const countries = ['USA', 'India', 'UK', 'China', 'Brazil', 'Nigeria', 'Russia', 'Canada', 'Australia', 'Germany', 'Japan', 'France'];
const deviceTypes = ['Mobile', 'Desktop', 'Tablet'];
const osTypes = ['iOS', 'Android', 'Windows', 'macOS', 'Linux'];
const categories = ['Retail', 'Electronics', 'Food', 'Travel', 'Entertainment', 'Finance', 'Luxury'];
const txnTypes = ['Debit', 'Credit', 'Transfer', 'Subscription'];

const generateRandomDigits = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
};

const generateUPI = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

for (let i = 1; i <= 100; i++) {
  const isFraud = Math.random() < 0.2; // 20% fraud rate
  const amount = parseFloat((Math.random() * (isFraud ? 15000 : 2000)).toFixed(2));
  const country = isFraud && Math.random() > 0.5 ? 'Nigeria' : countries[Math.floor(Math.random() * countries.length)];
  const upiId = generateUPI(12); // UPI ID with special characters
  
  const txn = {
    transactionId: generateRandomDigits(12),
    upiId: upiId,
    userId: `user_${100 + i}`,
    amount: amount,
    date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    location: {
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: country,
      lat: parseFloat((Math.random() * 180 - 90).toFixed(4)),
      long: parseFloat((Math.random() * 360 - 180).toFixed(4))
    },
    deviceInfo: {
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      os: osTypes[Math.floor(Math.random() * osTypes.length)]
    },
    merchantDetails: {
      category: categories[Math.floor(Math.random() * categories.length)],
      name: `Merchant ${i}`
    },
    transactionType: txnTypes[Math.floor(Math.random() * txnTypes.length)],
    isFraud: isFraud
  };

  if (isFraud) {
    const reasons = [
      "High value from high-risk IP",
      "Anomalous location and OS",
      "Rapid succession of high-value purchases",
      "Large transfer to new recipient",
      "Unusual international purchase",
      "Impossible travel speed from previous txn",
      "Massive transfer to high-risk region"
    ];
    txn.fraudReason = reasons[Math.floor(Math.random() * reasons.length)];
  }

  transactions.push(txn);
}

fs.writeFileSync('c:/Users/harsh/Documents/fraud checker/backend/data/sample_transactions.json', JSON.stringify(transactions, null, 2));
console.log('Generated 100 transactions with Alphanumeric UPI IDs.');
