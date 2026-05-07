import React, { useEffect, useRef } from 'react';

const NeuralNetwork3D = ({ theme }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const nodes = [];
        const numNodes = 120; // Particle density

        // 3D matrix boundaries
        const fov = 300;
        let angleX = 0;
        let angleY = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Generate random nodes in 3D space
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: (Math.random() - 0.4) * 800,
                y: (Math.random() - 0.4) * 800,
                z: (Math.random() - 0.4) * 800,
                speedX: (Math.random() - 0.5) * 0.02, // Set to ultra-slow 0.02
                speedY: (Math.random() - 0.5) * 0.02,
                speedZ: (Math.random() - 0.5) * 0.02,
            });
        }

        // Mouse tracking for parallax rotation
        const handleMouseMove = (e) => {
            mouseX = (e.clientX - width / 2) * 0.0001; // Slowed from 0.0005
            mouseY = (e.clientY - height / 2) * 0.0001;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId;

        const render = () => {
            const isDark = theme === 'dark';

            // Blur trail effect (glassmorphic 3D background)
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.15)' : 'rgba(240, 242, 245, 0.15)';
            ctx.fillRect(0, 0, width, height);

            // Continuously rotate ultra-slowly + add mouse parallax
            angleX += 0.0001 + mouseY;
            angleY += 0.0002 + mouseX;

            const cx = width / 2;
            const cy = height / 2;

            const projectedNodes = nodes.map(node => {
                // Subtle random floating
                node.x += node.speedX;
                node.y += node.speedY;
                node.z += node.speedZ;

                // Loop boundaries bounds
                if (node.x > 400 || node.x < -400) node.speedX *= -1;
                if (node.y > 400 || node.y < -400) node.speedY *= -1;
                if (node.z > 400 || node.z < -400) node.speedZ *= -1;

                // 3D Rotation Matrix Y
                let x1 = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
                let z1 = node.x * Math.sin(angleY) + node.z * Math.cos(angleY);

                // 3D Rotation Matrix X
                let y2 = node.y * Math.cos(angleX) - z1 * Math.sin(angleX);
                let z2 = node.y * Math.sin(angleX) + z1 * Math.cos(angleX);

                // Screen Projection
                const scale = fov / (fov + z2 + 400);
                const px = cx + x1 * scale;
                const py = cy + y2 * scale;

                return { px, py, scale, z: z2 };
            });

            // Draw connecting lines in 3D space
            ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.25)';
            ctx.lineWidth = 1;

            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const dx = projectedNodes[i].px - projectedNodes[j].px;
                    const dy = projectedNodes[i].py - projectedNodes[j].py;
                    const dist = dx * dx + dy * dy;

                    // Connect nodes that are close to each other in 2D projection
                    if (dist < 12000) {
                        ctx.beginPath();
                        ctx.moveTo(projectedNodes[i].px, projectedNodes[i].py);
                        ctx.lineTo(projectedNodes[j].px, projectedNodes[j].py);
                        ctx.stroke();
                    }
                }
            }

            // Draw data nodes
            projectedNodes.forEach(pNode => {
                const size = Math.max(0.5, pNode.scale * 3);
                // Color gets darker the further back it is on Z axis
                const opac = Math.max(0.1, pNode.scale);
                ctx.fillStyle = `rgba(96, 165, 250, ${opac})`;
                ctx.beginPath();
                ctx.arc(pNode.px, pNode.py, size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [theme]); // Re-bind if theme changes

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default NeuralNetwork3D;
