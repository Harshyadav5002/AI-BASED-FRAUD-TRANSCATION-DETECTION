import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from 'lucide-react';
import axios from 'axios';

const mockData = [
  { name: 'Mon', transactions: 4000, fraud: 240 },
  { name: 'Tue', transactions: 3000, fraud: 139 },
  { name: 'Wed', transactions: 2000, fraud: 980 },
  { name: 'Thu', transactions: 2780, fraud: 390 },
  { name: 'Fri', transactions: 1890, fraud: 480 },
  { name: 'Sat', transactions: 2390, fraud: 380 },
  { name: 'Sun', transactions: 3490, fraud: 430 },
];

const mockAlerts = [
  { id: '882739485012', score: 92, reason: 'High Value Anomaly' },
  { id: '119283746505', score: 85, reason: 'Suspicious IP' },
  { id: '993847562019', score: 78, reason: 'Rapid Frequency' },
  { id: '772635481023', score: 99, reason: 'AI Model Flag' },
];

const liveTransactions = [
  { id: '102938475612', upiId: 'USER@PAY#123', amount: '$1,200', user: 'user_101', status: 'Safe', time: 'Just now' },
  { id: '998877665544', upiId: 'PAY!SCAN$99', amount: '$5,000', user: 'user_102', status: 'Fraud', time: '1m ago' },
  { id: '112233445566', upiId: 'TEST%VALUE&0', amount: '$45', user: 'user_103', status: 'Safe', time: '2m ago' },
  { id: '554433221100', upiId: 'FRAUD*VOID^8', amount: '$890', user: 'user_104', status: 'Fraud', time: '5m ago' },
];

const Dashboard = () => {
  const [liveTps, setLiveTps] = useState(12450);
  const [liveFraudTps, setLiveFraudTps] = useState(42);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions');
        if (response.data && response.data.success) {
          setTransactions(response.data.data.slice(0, 10)); // Just show latest 10
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        // On error, the empty array will just show the live feed as empty or we could use mock
        setTransactions(liveTransactions); 
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    const interval = setInterval(() => {
      // Simulate live network telemetry fluctuation
      const tpsChange = Math.floor(Math.random() * 300) - 150; // fluctuate by -150 to +150
      const fraudChange = Math.floor(Math.random() * 10) - 4; // fluctuate by -4 to +6
      setLiveTps(prev => Math.max(1000, prev + tpsChange));
      setLiveFraudTps(prev => Math.max(0, prev + fraudChange));
    }, 1000); // Ticks every 1 second
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <header>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Security Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here is the latest fraud telemetry.</p>
      </header>

      <div className="dashboard-grid">
        <div className="stat-card glass-panel" style={{ gridColumn: 'span 3' }}>
          <span className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="var(--accent)" /> Global TPS (Live)
          </span>
          <span className="stat-value">{liveTps.toLocaleString()}</span>
        </div>
        <div className="stat-card glass-panel" style={{ gridColumn: 'span 3' }}>
          <span className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="var(--danger)" /> Fraud DPS (Live)
          </span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>{liveFraudTps.toLocaleString()}</span>
        </div>
        <div className="stat-card glass-panel" style={{ gridColumn: 'span 3' }}>
          <span className="stat-title">Total Vol Processed</span>
          <span className="stat-value">$1,204,500</span>
        </div>
        <div className="stat-card glass-panel" style={{ gridColumn: 'span 3' }}>
          <span className="stat-title">AI Confidence Avg</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>98.2%</span>
        </div>

        <div className="chart-card glass-panel">
          <h3 style={{ marginBottom: '24px' }}>Transaction Volume vs Fraud Detection</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorTxn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Area type="monotone" dataKey="transactions" stroke="var(--accent)" fillOpacity={1} fill="url(#colorTxn)" />
              <Area type="monotone" dataKey="fraud" stroke="var(--danger)" fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="table-card glass-panel" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ marginBottom: '24px', letterSpacing: '-0.5px' }}>Critical Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockAlerts.map((alert, i) => (
              <motion.div 
                key={alert.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '16px', borderLeft: '4px solid var(--danger)', boxShadow: 'var(--shadow)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px' }}>{alert.id}</strong>
                  <span style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>{alert.score}% Risk</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{alert.reason}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="table-card glass-panel" style={{ gridColumn: 'span 8', height: 'auto' }}>
          <h3 style={{ marginBottom: '24px' }}>Live Transaction Feed</h3>
          <div className="live-feed">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <th style={{ padding: '12px' }}>TXN ID</th>
                  <th style={{ padding: '12px' }}>UPI ID</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {(transactions.length > 0 ? transactions : liveTransactions).map(txn => (
                  <tr key={txn.transactionId || txn.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '14px' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{txn.transactionId || txn.id}</td>
                    <td style={{ padding: '12px', fontStyle: 'italic', color: 'var(--accent)' }}>{txn.upiId}</td>
                    <td style={{ padding: '12px' }}>{txn.userId || txn.user}</td>
                    <td style={{ padding: '12px' }}>{typeof txn.amount === 'number' ? `$${txn.amount.toLocaleString()}` : txn.amount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: txn.isFraud || txn.status === 'Fraud' ? 'var(--danger-bg)' : 'rgba(16, 185, 129, 0.1)',
                        color: txn.isFraud || txn.status === 'Fraud' ? 'var(--danger)' : 'var(--success)'
                      }}>
                        {txn.isFraud ? 'Fraud' : (txn.status || 'Safe')}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{txn.date ? new Date(txn.date).toLocaleTimeString() : (txn.time || 'Just now')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
