import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FraudAlerts from './pages/FraudAlerts';
import TransactionDetail from './pages/TransactionDetail';
import SubmitTransaction from './pages/SubmitTransaction';
import ChatbotWidget from './components/ChatbotWidget';
import NeuralNetwork3D from './components/NeuralNetwork3D';
import VoiceAssistant from './components/VoiceAssistant';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="app-container">
        <NeuralNetwork3D theme={theme} />
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test-scan" element={<SubmitTransaction />} />
            <Route path="/alerts" element={<FraudAlerts />} />
            <Route path="/transactions" element={<TransactionDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ChatbotWidget />
        <VoiceAssistant />
      </div>
    </Router>
  );
}

export default App;
