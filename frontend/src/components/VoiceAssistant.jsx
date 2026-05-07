import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Click to talk');
  const navigate = useNavigate();

  const handleVoiceCommand = useCallback((command) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('dashboard') || cmd.includes('home')) {
      setStatus('Navigating to Dashboard...');
      setTimeout(() => navigate('/'), 1000);
    } else if (cmd.includes('alert') || cmd.includes('fraud')) {
      setStatus('Checking Fraud Alerts...');
      setTimeout(() => navigate('/alerts'), 1000);
    } else if (cmd.includes('scan') || cmd.includes('test')) {
      setStatus('Opening Manual Scan...');
      setTimeout(() => navigate('/test-scan'), 1000);
    } else if (cmd.includes('transaction list')) {
      setStatus('Viewing Transactions...');
      setTimeout(() => navigate('/transactions'), 1000);
    } else if (cmd.includes('transaction id') || cmd.includes('id is') || cmd.includes('set id')) {
        const match = cmd.match(/\d+/g);
        if (match) {
            const id = match.join(''); // Join all digits found
            setStatus(`ID Detected: ${id}`);
            window.dispatchEvent(new CustomEvent('voice-input', { detail: { field: 'transactionId', value: id } }));
        }
    } else if (cmd.includes('upi id') || cmd.includes('upi is') || cmd.includes('set upi')) {
        let upi = cmd.split(/upi id|upi is|set upi/).pop().trim();
        // Simple NLP cleanup for special characters
        upi = upi.replace(/ at /g, '@').replace(/ hash /g, '#').replace(/ dollar /g, '$').replace(/ star /g, '*').replace(/ percent /g, '%').replace(/ dot /g, '.');
        if (upi) {
            setStatus(`UPI Detected: ${upi.toUpperCase()}`);
            window.dispatchEvent(new CustomEvent('voice-input', { detail: { field: 'upiId', value: upi.toUpperCase() } }));
        }
    } else if (cmd.includes('help')) {
      setStatus('Try: "Set Transaction ID 123...", "UPI ID is USER at PAY", "Go to Scan"');
    } else {
      setStatus(`I heard: "${command}"`);
    }
  }, [navigate]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setTranscript(command);
      handleVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setStatus('Error occurred. Try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      <AnimatePresence>
        {isListening || transcript ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="voice-status-popover"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={18} color="var(--accent)" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{status}</span>
            </div>
            {transcript && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                "{transcript}"
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button 
        className={`voice-assistant-fab ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        title="Voice Assistant"
      >
        {isListening ? <Mic size={28} /> : <MicOff size={28} />}
      </button>
    </>
  );
};

export default VoiceAssistant;
