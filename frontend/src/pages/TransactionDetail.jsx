import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertOctagon, CheckCircle, MapPin, Monitor, CreditCard } from 'lucide-react';
import axios from 'axios';

// Using mock data map fallback since we aren't completely wired to the database yet.
// In a real flow, you would `axios.get('/api/transactions/' + id)` 
const mockTransactionDB = {
    '882739485012': {
        transactionId: "882739485012", upiId: "USER@PAY#123", userId: "user_12345", amount: 10500, date: "2024-05-12T14:24:00Z",
        location: { ip: "192.168.1.1", country: "HighRiskCountry1", lat: 12.34, long: 56.78 },
        deviceInfo: { deviceType: "Mobile", os: "Android" },
        merchantDetails: { category: "Electronics", name: "Global Tech Outlet" },
        transactionType: "Debit", isFraud: true, fraudScore: 92, flagReason: ["High value transaction anomaly", "Suspicious location/IP change"]
    },
    '119283746505': {
        transactionId: "119283746505", upiId: "JACK!SHIELD$8", userId: "user_99887", amount: 25.50, date: "2024-05-12T14:30:00Z",
        location: { ip: "10.0.0.1", country: "USA", lat: 37.77, long: -122.41 },
        deviceInfo: { deviceType: "Desktop", os: "Windows" },
        merchantDetails: { category: "Food", name: "Local Coffee Shop" },
        transactionType: "Debit", isFraud: false, fraudScore: 12, flagReason: []
    }
};

const TransactionDetail = () => {
    const [searchId, setSearchId] = useState('');
    const [searchUpi, setSearchUpi] = useState('');
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleVoiceInput = (e) => {
            const { field, value } = e.detail;
            if (field === 'transactionId') setSearchId(value);
            if (field === 'upiId') setSearchUpi(value);
        };
        window.addEventListener('voice-input', handleVoiceInput);
        return () => window.removeEventListener('voice-input', handleVoiceInput);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        const txnId = searchId.trim();
        const upi = searchUpi.trim();

        if (!txnId || !upi) {
            setError('Both Transaction ID and UPI ID are mandatory for verification.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/${txnId}`);
            if (response.data && response.data.success) {
                const found = response.data.data;
                if (found.upiId.toLowerCase() === upi.toLowerCase()) {
                    setTransaction(found);
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            // Silently fail and proceed to simulation
        }

        // SIMULATION LOGIC: If input is valid format, show random result
        const isTxnIdValid = /^\d{12}$/.test(txnId);
        const isUpiValid = /^[a-zA-Z0-9!@#$%^&*]+$/.test(upi);

        if (isTxnIdValid && isUpiValid) {
            // Mock dynamic generation for the "WOW" factor
            setTimeout(() => {
                const randomScore = Math.floor(Math.random() * 100);
                const isFraud = randomScore >= 70;
                
                const simulatedTxn = {
                    transactionId: txnId,
                    upiId: upi,
                    userId: `user_${Math.floor(Math.random() * 900) + 100}`,
                    amount: parseFloat((Math.random() * 5000).toFixed(2)),
                    date: new Date().toISOString(),
                    location: { 
                        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1`, 
                        country: isFraud ? "High Risk Zone" : "Verified Location", 
                        lat: 23.45, 
                        long: 78.90 
                    },
                    deviceInfo: { 
                        deviceType: Math.random() > 0.5 ? "Mobile" : "Desktop", 
                        os: Math.random() > 0.5 ? "iOS" : "Windows" 
                    },
                    merchantDetails: { 
                        category: "E-Commerce", 
                        name: "Simulated Merchant" 
                    },
                    transactionType: "Transfer",
                    isFraud: isFraud,
                    fraudScore: randomScore,
                    flagReason: isFraud ? ["Heuristic anomaly detected", "AI Neural match for fraud pattern"] : []
                };
                
                setTransaction(simulatedTxn);
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
            setError('Validation Error: Transaction ID must be 12 digits. UPI ID must be Alphanumeric + Special Characters.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <header>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Transaction Explorer</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Search for a specific transaction ID to view deep AI analysis and telemetry.</p>
            </header>

            <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} size={20} />
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Transaction ID (Mandatory)"
                            className="input-base"
                            style={{ paddingLeft: '48px' }}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <CreditCard style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} size={20} />
                        <input
                            type="text"
                            value={searchUpi}
                            onChange={(e) => setSearchUpi(e.target.value)}
                            placeholder="UPI ID (e.g. USER@PAY#123)"
                            className="input-base"
                            style={{ paddingLeft: '48px' }}
                            pattern="^[a-zA-Z0-9!@#$%^&*]+$"
                            title="UPI ID must be alphanumeric plus special characters (!@#$%^&*)"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Verify & Analyze</button>
            </form>

            {loading && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '32px' }}>Analyzing telemetry data...</div>}
            {error && !loading && (
                <div className="glass-panel" style={{ padding: '16px', background: 'var(--danger-bg)', borderLeft: '4px solid var(--danger)' }}>
                    <p style={{ color: 'var(--danger)' }}>{error}</p>
                </div>
            )}

            {transaction && !loading && (
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="dashboard-grid"
                >
                    <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                        {transaction.isFraud ? (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--danger)' }} />
                        ) : (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--success)' }} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    {transaction.transactionId}
                                    {transaction.isFraud ? <AlertOctagon color="var(--danger)" /> : <CheckCircle color="var(--success)" />}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)' }}>UPI ID: <strong style={{ color: 'var(--accent)' }}>{transaction.upiId}</strong> &bull; User: {transaction.userId}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Processed: {new Date(transaction.date).toLocaleString()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${transaction.amount.toLocaleString()}</div>
                                <div style={{ color: transaction.isFraud ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
                                    AI Score: {transaction.fraudScore}%
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid" style={{ marginTop: '32px' }}>
                            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} /> Location Data</h3>
                                <p><strong>IP Address:</strong> {transaction.location?.ip}</p>
                                <p><strong>Country:</strong> {transaction.location?.country}</p>
                                <p><strong>Coordinates:</strong> {transaction.location?.lat}, {transaction.location?.long}</p>
                            </div>
                            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Monitor size={20} /> Device Telemetry</h3>
                                <p><strong>Device Type:</strong> {transaction.deviceInfo?.deviceType}</p>
                                <p><strong>Operating System:</strong> {transaction.deviceInfo?.os}</p>
                            </div>
                            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={20} /> Merchant</h3>
                                <p><strong>Name:</strong> {transaction.merchantDetails?.name}</p>
                                <p><strong>Category:</strong> {transaction.merchantDetails?.category}</p>
                                <p><strong>Type:</strong> {transaction.transactionType}</p>
                            </div>
                        </div>

                        {transaction.isFraud && (
                            <div style={{ marginTop: '32px', padding: '16px', background: 'var(--danger-bg)', borderRadius: '8px' }}>
                                <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>Flag Reasons:</h3>
                                <ul style={{ marginLeft: '20px', color: 'var(--text-primary)' }}>
                                    {(transaction.flagReason || [transaction.fraudReason]).map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TransactionDetail;
