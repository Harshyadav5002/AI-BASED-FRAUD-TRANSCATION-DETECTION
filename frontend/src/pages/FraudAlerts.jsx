import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const FraudAlerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 'TXN-982', score: 92, reason: 'High Value Anomaly from Nigeria', status: 'Pending' },
    { id: 'TXN-112', score: 85, reason: 'Suspicious IP Address in Russia', status: 'Flagged' },
    { id: 'TXN-445', score: 78, reason: 'Rapid Frequency of Micro-transactions', status: 'Review' },
    { id: 'TXN-312', score: 99, reason: 'AI Model: Impossible Travel (NY to Tokyo)', status: 'Critical' },
    { id: 'TXN-556', score: 88, reason: 'Large Transfer to New Recipient', status: 'Flagged' },
  ]);

  const handleAction = (id, type) => {
    // In a real app, you would call an API here
    // For now, we'll just filter them out with an animation
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Fraud Alerts</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and manage flagged transactions.</p>
      </header>
      
      <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <CheckCircle color="var(--success)" size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>All clear! No pending alerts.</h3>
          </div>
        ) : (
          <AnimatePresence>
            {alerts.map((alert, i) => (
                <motion.div 
                  key={alert.id} 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="alert-item"
                  style={{ marginBottom: '16px' }}
                >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', background: alert.score > 90 ? 'var(--danger-bg)' : 'rgba(99, 102, 241, 0.1)', borderRadius: '16px' }}>
                          <AlertOctagon color={alert.score > 90 ? "var(--danger)" : "var(--accent)"} size={32} />
                        </div>
                        <div>
                        <h4 style={{ fontSize: '18px', marginBottom: '6px', fontWeight: '600' }}>{alert.reason}</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>ID: <strong>{alert.id}</strong> &bull; AI Risk Score: <span style={{ color: alert.score > 90 ? 'var(--danger)' : 'var(--accent)', fontWeight: 'bold' }}>{alert.score}%</span> &bull; Status: {alert.status}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          className="btn-primary" 
                          style={{ background: 'var(--danger)', borderRadius: '12px' }}
                          onClick={() => handleAction(alert.id, 'block')}
                        >
                          Block Account
                        </button>
                        <button 
                          className="btn-primary" 
                          style={{ background: 'transparent', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: '12px' }}
                          onClick={() => handleAction(alert.id, 'safe')}
                        >
                          Verify Safe
                        </button>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default FraudAlerts;
