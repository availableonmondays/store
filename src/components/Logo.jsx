import React from 'react';

const Logo = ({ className = "", size = "default" }) => {
    const imgSize = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Real Logo */}
            <img
                src="/gemeos-logo.png"
                alt="Gemeos Gaming"
                className={`${imgSize} rounded-xl object-cover`}
            />
            {/* Typography */}
            <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    GEMEOS
                </span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-medium">
                    Gaming
                </span>
            </div>
        </div>
    );
};

export default Logo;
