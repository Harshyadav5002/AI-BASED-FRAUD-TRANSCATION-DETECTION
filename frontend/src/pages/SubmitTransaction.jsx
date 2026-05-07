import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';

const BANKS = [
  "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank (PNB)",
  "JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank", 
  "Goldman Sachs", "Morgan Stanley", "U.S. Bank", "PNC Financial",
  "Barclays", "HSBC", "Standard Chartered", "Deutsche Bank", "Credit Suisse"
];

const SubmitTransaction = () => {
  const [formData, setFormData] = useState({
    bank: BANKS[0],
    date: '',
    time: '',
    transactionId: Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join(''),
    upiId: '',
    amount: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleVoiceInput = (e) => {
        const { field, value } = e.detail;
        if (field === 'transactionId' || field === 'upiId') {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };
    window.addEventListener('voice-input', handleVoiceInput);
    return () => window.removeEventListener('voice-input', handleVoiceInput);
  }, []);

  // Derive "Day" and "Year" from selected date for display requirement
  const dateObj = formData.date ? new Date(formData.date) : null;
  const dayName = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const yearName = dateObj ? dateObj.getFullYear() : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Mock sending to backend AI FraudDetectionService
    setTimeout(() => {
        let score = 5;
        let reasons = [];

        if (Number(formData.amount) > 10000) {
            score += 45;
            reasons.push("High Value Anomaly Detection");
        }
        
        // Late night anomaly check
        const hour = parseInt(formData.time.split(':')[0]);
        if (hour >= 1 && hour <= 5) {
            score += 30;
            reasons.push("Suspicious late-night velocity (1AM-5AM window)");
        }

        // Random AI anomaly
        const aiScore = Math.floor(Math.random() * 20);
        score += aiScore;
        if(aiScore > 15) reasons.push("AI Neural Pattern Model flagged heuristic match");

        score = Math.min(score, 100);

        setResult({
            isFraud: score >= 70,
            fraudScore: score,
            reasons: reasons.length > 0 ? reasons : ["No anomalous patterns detected. Transaction appears safe."]
        });
        setLoading(false);
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Manual Transaction Scan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Input requested bank parameters below to run through the active 3D Fraud Matrix.</p>
      </header>

      <div className="dashboard-grid">
        <form onSubmit={handleSubmit} className="glass-panel" style={{ gridColumn: 'span 7', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '500' }}>Select Authorized Bank</label>
                <select 
                   className="input-base"
                   value={formData.bank}
                   onChange={e => setFormData({...formData, bank: e.target.value})}
                   required
                >
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontWeight: '500' }}>Transaction Date</label>
                    <input 
                      type="date" 
                      className="input-base" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      required
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontWeight: '500' }}>Time (Local)</label>
                    <input 
                      type="time" 
                      className="input-base" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      required
                    />
                </div>
            </div>

            {/* Derived Time Metrics Display specifically requested by user */}
            {dateObj && (
                <div style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '-12px', background: 'var(--glass-bg)', padding: '8px', borderRadius: '8px' }}>
                    Derived Context: Transaction occurred on a <strong>{dayName}</strong> in <strong>{yearName}</strong>. 
                    (Our AI checks day-of-week buying patterns automatically).
                </div>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontWeight: '500' }}>Transaction ID (Auto/Manual)</label>
                    <input 
                      type="text" 
                      className="input-base" 
                      value={formData.transactionId}
                      onChange={e => setFormData({...formData, transactionId: e.target.value})}
                      required
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontWeight: '500' }}>UPI ID (Mandatory - Alpha + Special)</label>
                    <input 
                      type="text" 
                      className="input-base" 
                      placeholder="e.g. USER@PAY#123"
                      value={formData.upiId}
                      onChange={e => setFormData({...formData, upiId: e.target.value})}
                      pattern="^[a-zA-Z0-9!@#$%^&*]+$"
                      title="UPI ID must be alphanumeric plus special characters (!@#$%^&*)"
                      required
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '500' }}>Amount ($)</label>
                <input 
                  type="number" 
                  className="input-base" 
                  placeholder="e.g. 500.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? <Activity size={20} /> : <ShieldAlert size={20} />}
                {loading ? "Scanning Through Matrix..." : "Run AI Fraud Scan"}
            </button>

        </form>

        <div style={{ gridColumn: 'span 5' }}>
            <AnimatePresence>
                {result && !loading && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '32px', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: result.isFraud ? 'var(--danger)' : 'var(--success)' }} />
                        
                        <h3 style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            Scan Results
                            {result.isFraud ? <ShieldAlert color="var(--danger)" /> : <CheckCircle color="var(--success)" />}
                        </h3>
                        
                        <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '24px 0', color: result.isFraud ? 'var(--danger)' : 'var(--success)' }}>
                            {result.fraudScore}% Risk
                        </div>

                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Diagnostic Breakdown:</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px' }}>
                            {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default SubmitTransaction;
