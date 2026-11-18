import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState(1); // 1: Entrance, 2: Food Montage, 3: Zoom & Boom Out
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 1400);
    const timer2 = setTimeout(() => setPhase(3), 3200);
    const timer3 = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 600);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onFinish, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950 text-white transition-all duration-700 ${
      isExiting ? 'scale-150 opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Floating Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Floating Spice & Herb Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[15%] left-[12%] text-2xl animate-float-slow opacity-60">🌶️</span>
        <span className="absolute top-[25%] right-[18%] text-3xl animate-float-reverse opacity-70">🌿</span>
        <span className="absolute bottom-[20%] left-[20%] text-2xl animate-float-reverse opacity-60">🍅</span>
        <span className="absolute bottom-[28%] right-[15%] text-3xl animate-float-slow opacity-75">✨</span>
        <span className="absolute top-[60%] left-[8%] text-2xl animate-float-slow opacity-50">🧄</span>
        <span className="absolute top-[40%] right-[8%] text-2xl animate-float-reverse opacity-60">🍛</span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">

        {/* Mascot Avatar with Animated Glow Rings */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 opacity-60 blur-lg animate-pulse" />
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-amber-50/10 border-2 border-orange-400/40 p-3 shadow-2xl backdrop-blur-md flex items-center justify-center animate-bounce-slow">
            <img
              src="/logo-icon.svg"
              alt="FEASTORA Chef Mascot"
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="overflow-hidden mb-2">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider font-sans">
            FEAST<span className="text-orange-500">ORA</span>
          </h1>
        </div>

        {/* Tagline with Sparkles */}
        <div className="flex items-center justify-center gap-2 mb-6 text-amber-300 font-medium text-sm md:text-base tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
          <span>Every Craving Has a Destination.</span>
          <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
        </div>

        {/* Floating Delicious Food Previews (Slow-motion pop-in during Phase 2) */}
        {phase >= 2 && (
          <div className="flex items-center justify-center gap-3 my-4 transition-all duration-700 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg transform -rotate-6 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=150&q=80"
                alt="Crispy Dosa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-400/80 shadow-xl transform scale-110 hover:scale-115 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80"
                alt="Royal Biryani"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-red-400/60 shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80"
                alt="Artisanal Burger"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Welcome message */}
        <p className="text-slate-300 text-xs md:text-sm max-w-sm mt-2 mb-8 leading-relaxed">
          From Bangalore’s crispy Benne Dosas to Chennai’s Chettinad feasts & fiery Andhra Biryanis.
        </p>

        {/* Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-orange-500 text-white text-xs md:text-sm font-semibold tracking-wide border border-white/20 transition-all duration-300 shadow-md hover:shadow-orange-500/25 cursor-pointer"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
