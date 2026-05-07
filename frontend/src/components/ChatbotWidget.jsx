import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const QA_DATABASE = {
  "Why was TXN981273912A flagged?": "TXN981273912A was flagged primarily due to an anomaly in the amount ($10,500) combined with a suspicious IP location change to HighRiskCountry1.",
  "What are the common signs of fraud?": "Common indicators include: Rapid successive transactions, unusually high transfer amounts, shipping or IP address mismatches, and multiple failed CVV attempts.",
  "How do I unblock a user?": "To unblock an account, navigate to the 'Fraud Alerts' page via the sidebar, locate the flagged transaction, and carefully review the telemetry before clicking 'Mark Safe'.",
  "Show summary of alerts today": "Our AI model has caught 142 flagged transactions today. The average confidence score is 98.2%. The highest risk anomaly detected was a series of rapid location jumps."
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am WatchDog AI. I can answer specific questions regarding your transaction telemetry. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    if (!text) setInput('');

    // Simulate AI thinking and responding
    setTimeout(() => {
      let botResponse = QA_DATABASE[userMessage];
      if (!botResponse) {
        botResponse = "I'm a localized demo AI agent. Try asking me specific questions from the suggested list above!";
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Glass Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="glass-panel"
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '400px',
              height: '550px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1000,
              background: 'var(--bg-primary)' // Solid fall-back behind glass
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px', background: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Bot size={24} /> WatchDog Agent
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat Bubble Area */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '16px', 
                    background: msg.sender === 'user' ? 'var(--text-secondary)' : 'var(--accent)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    background: msg.sender === 'user' ? 'var(--accent)' : 'var(--glass-bg)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                    maxWidth: '80%',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Predefined Quick Questions */}
            <div style={{ padding: '8px 16px', display: 'flex', overflowX: 'auto', gap: '8px', borderTop: '1px solid var(--glass-border)' }}>
              {Object.keys(QA_DATABASE).map((q, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => handleSend(q)}
                    style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}
                 >
                    {q}
                 </button>
              ))}
            </div>

            {/* Bottom Input Area */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 placeholder="Type your question..."
                 style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
