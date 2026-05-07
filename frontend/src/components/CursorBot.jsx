import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CursorBot = () => {
    const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    const [status, setStatus] = useState('Idle');
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('Scanning for threats...');
    const containerRef = useRef(null);

    // Autonomous movement logic
    useEffect(() => {
        const moveAgent = () => {
            const padding = 100;
            const newX = Math.random() * (window.innerWidth - padding * 2) + padding;
            const newY = Math.random() * (window.innerHeight - padding * 2) + padding;
            
            setPosition({ x: newX, y: newY });
            
            // Randomly show a message
            if (Math.random() > 0.7) {
                const messages = [
                    "Analyzing network telemetry...",
                    "UPI IDs look secure.",
                    "No fraud detected in this sector.",
                    "System integrity at 99.8%.",
                    "Monitoring live transactions.",
                    "Hello! I'm your Security Agent.",
                    "Deep AI scan in progress..."
                ];
                setBubbleText(messages[Math.floor(Math.random() * messages.length)]);
                setShowBubble(true);
                setTimeout(() => setShowBubble(false), 3000);
            }
        };

        const interval = setInterval(moveAgent, 8000); // Move every 8 seconds
        return () => clearInterval(interval);
    }, []);

    // Initial message
    useEffect(() => {
        setTimeout(() => {
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 4000);
        }, 2000);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
            <motion.div
                animate={{ 
                    x: position.x, 
                    y: position.y,
                }}
                transition={{ 
                    duration: 5, // Slow movement
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'auto', // Allow interaction with the agent
                    cursor: 'pointer'
                }}
                onMouseEnter={() => {
                    setBubbleText("At your service!");
                    setShowBubble(true);
                }}
                onMouseLeave={() => setShowBubble(false)}
            >
                <AnimatePresence>
                    {showBubble && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--glass-border)',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                marginBottom: '10px',
                                boxShadow: 'var(--shadow)',
                                pointerEvents: 'none'
                            }}
                        >
                            {bubbleText}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.img 
                    src="/agent.png" 
                    alt="AI Agent"
                    animate={{
                        y: [0, -10, 0] // Bobbing animation
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 15px rgba(99, 102, 241, 0.4))'
                    }}
                />
                
                {/* Shadow underneath */}
                <motion.div 
                    animate={{
                        scale: [1, 0.8, 1],
                        opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: 40,
                        height: 10,
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                        marginTop: -5
                    }}
                />
            </motion.div>
        </div>
    );
};

export default CursorBot;
