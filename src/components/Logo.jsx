import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "" }) => {
    return (
        <motion.div
            className={`flex items-center gap-3 ${className}`}
            whileHover={{ scale: 1.02 }}
        >
            {/* Logo Icon */}
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30">
                    <span className="text-white font-black text-lg" style={{ fontFamily: 'var(--font-display)' }}>G</span>
                </div>
                {/* Glow */}
                <div className="absolute inset-0 bg-red-600 rounded-xl blur-lg opacity-30 -z-10" />
            </div>

            {/* Typography */}
            <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    GEMEOS
                </span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-medium">
                    Gaming
                </span>
            </div>
        </motion.div>
    );
};

export default Logo;
