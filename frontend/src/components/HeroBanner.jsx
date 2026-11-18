import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Clock, ShieldCheck, Flame, ArrowRight, Tag } from 'lucide-react';

export const HeroBanner = () => {
  const { applyCoupon, setActiveCategory } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/40 to-white py-8 sm:py-12 border-b border-orange-100/60">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-red-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Offer Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200/80 text-xs font-bold tracking-wide mb-4 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
              <span>SUPER DEAL: 50% OFF Up to ₹100 with code</span>
              <span className="px-2 py-0.5 rounded bg-white font-mono text-orange-600 font-extrabold border border-orange-300">
                FEAST50
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
              Every Craving Has a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-red-600">
                Delicious Destination.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-6 font-normal">
              Order fresh, steaming delights from legendary heritage joints like <strong className="text-slate-800">MTR</strong>, <strong className="text-slate-800">Vidyarthi Bhavan</strong>, and fiery <strong className="text-slate-800">Meghana Biryanis</strong> straight to your doorstep.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg mb-8">
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-800">25 Mins</p>
                  <p className="text-[9px] text-slate-500">Superfast Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-800">100% Hygienic</p>
                  <p className="text-[9px] text-slate-500">Safety Certified</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-800">Live Kitchen</p>
                  <p className="text-[9px] text-slate-500">7-Step Tracking</p>
                </div>
              </div>
            </div>

            {/* Quick Cravings Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Popular:</span>
              {['Biryani', 'South Indian', 'Burger', 'Tamil Nadu Special', 'Fresh Juices'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveCategory(tag)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 transition-all shadow-2xs cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Visual Collage & Chef Mascot Highlight */}
          <div className="lg:col-span-5 relative flex justify-center">

            {/* Large Mascot Card with Floating Badge */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-red-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-[22px] bg-slate-900/90 overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">

                {/* Background Food Picture blend */}
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Indian Feast Kitchen"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                />

                {/* Animated Chef Mascot in Center */}
                <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 mb-3 animate-float-slow">
                  <img
                    src="/logo-icon.svg"
                    alt="FEASTORA Chef Mascot"
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                  />
                </div>

                <div className="relative z-10 text-white">
                  <p className="text-xs uppercase font-extrabold tracking-widest text-amber-300 mb-1">
                    Authentic South & North Indian Cuisines
                  </p>
                  <p className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Bangalore, Chennai & Karnataka Specials
                  </p>
                </div>

                {/* Floating Discount Tag */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg transform -rotate-6 animate-pulse">
                  <Tag className="w-3.5 h-3.5" />
                  <span>UP TO 50% OFF</span>
                </div>

                {/* Floating Live Rating Tag */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-lg transform rotate-3">
                  <span className="text-amber-500">★</span>
                  <span>4.8 / 5 (12K+ Reviews)</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
