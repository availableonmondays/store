import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);
    const heroRef = useRef(null);
    const textZoneRef = useRef(null);
    const [textZone, setTextZone] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        const updateTextZone = () => {
            if (textZoneRef.current && heroRef.current) {
                const heroRect = heroRef.current.getBoundingClientRect();
                const textRect = textZoneRef.current.getBoundingClientRect();
                setTextZone({
                    x: textRect.left - heroRect.left,
                    y: textRect.top - heroRect.top,
                    width: textRect.width,
                    height: textRect.height
                });
            }
        };
        updateTextZone();
        window.addEventListener('resize', updateTextZone);
        return () => window.removeEventListener('resize', updateTextZone);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    }, []);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePos({ x: -1000, y: -1000 });
    };

    const rows = 18;
    const cols = 28;

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)'
                }}
            />

            {/* Dot Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <svg className="w-full h-full">
                    {Array.from({ length: rows * cols }, (_, i) => {
                        const row = Math.floor(i / cols);
                        const col = i % cols;

                        const heroWidth = heroRef.current?.offsetWidth || 1200;
                        const heroHeight = heroRef.current?.offsetHeight || 800;

                        const dotX = (col / (cols - 1)) * heroWidth;
                        const dotY = (row / (rows - 1)) * heroHeight;

                        const padding = 60;
                        const isInTextZone =
                            dotX > textZone.x - padding &&
                            dotX < textZone.x + textZone.width + padding &&
                            dotY > textZone.y - padding &&
                            dotY < textZone.y + textZone.height + padding;

                        if (isInTextZone) return null;

                        const dx = dotX - mousePos.x;
                        const dy = dotY - mousePos.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Only fat when very close to cursor
                        const maxDistance = 80;
                        const influence = isHovering && distance < maxDistance ? Math.max(0, 1 - distance / maxDistance) : 0;

                        // Smaller base, moderate max
                        const baseSize = 1.5;
                        const maxSize = 7;
                        const size = baseSize + influence * (maxSize - baseSize);

                        // Subtle opacity
                        const baseOpacity = isHovering ? 0.1 : 0.03;
                        const opacity = baseOpacity + influence * 0.6;

                        return (
                            <circle
                                key={i}
                                cx={dotX}
                                cy={dotY}
                                r={size}
                                fill={`rgba(239, 68, 68, ${opacity})`}
                                style={{ transition: 'r 0.25s ease-out, fill 0.25s ease-out' }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Main Content */}
            <div className="container relative z-10 text-center px-4">
                <div ref={textZoneRef} className="inline-block">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.9]"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        <span className="block text-white">POWER</span>
                        <span className="block">
                            YOUR <span className="gradient-text-accent">PLAY</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Discover elite gaming peripherals crafted for champions.
                        <br className="hidden md:block" />
                        Precision. Speed. Victory.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.a
                            href="#offers"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                        >
                            <span>Shop Now</span>
                        </motion.a>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-secondary"
                        >
                            View Collection
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-2"
                >
                    <div className="w-1 h-2 bg-zinc-500 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
