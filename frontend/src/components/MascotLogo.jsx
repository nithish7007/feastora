import React from 'react';

export const MascotLogo = ({ size = 'md', showTagline = true, light = false }) => {
  // Dimensions
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tag: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-2xl', tag: 'text-xs' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', tag: 'text-sm' },
    hero: { icon: 'w-24 h-24 md:w-32 md:h-32', text: 'text-4xl md:text-5xl', tag: 'text-sm md:text-base' }
  };

  const current = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Cartoon Chef Mascot Illustration Container */}
      <div className={`relative ${current.icon} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
        <img
          src="/logo-icon.svg"
          alt="FEASTORA Indian Chef Mascot"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
        {/* Subtle glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-ping opacity-25 pointer-events-none" />
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-extrabold tracking-wider ${current.text} font-sans ${
            light ? 'text-white' : 'text-slate-900'
          }`}>
            FEAST<span className="text-orange-500">ORA</span>
          </span>
          <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {showTagline && (
          <span className={`font-medium tracking-wide uppercase italic ${current.tag} ${
            light ? 'text-orange-200' : 'text-orange-600'
          }`}>
            Every Craving Has a Destination.
          </span>
        )}
      </div>
    </div>
  );
};
