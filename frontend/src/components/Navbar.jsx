import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MascotLogo } from './MascotLogo';
import {
  MapPin,
  Search,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Percent,
  Server,
  LogOut,
  ShieldCheck,
  ListOrdered
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentUser,
    logoutUser,
    backendStatus,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    cart,
    setIsCartOpen,
    setIsAuthOpen,
    setAuthMode,
    currentView,
    setCurrentView,
    setActiveTrackingOrder
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const cities = ['All', 'Bengaluru', 'Chennai', 'Mysore', 'Udupi'];

  const totalCartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">

          {/* Brand Logo & Mascot */}
          <div onClick={() => setCurrentView('home')}>
            <MascotLogo size="md" showTagline={true} />
          </div>

          {/* Location Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-orange-50 hover:bg-orange-100/70 border border-orange-200/60 rounded-full transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>{selectedCity === 'All' ? 'All Locations' : selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Delivery City
                </div>
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === city
                        ? 'bg-orange-500 text-white font-semibold'
                        : 'text-slate-700 hover:bg-orange-50'
                    }`}
                  >
                    <span>{city}</span>
                    {city === 'Bengaluru' && <span className="text-[10px] opacity-75">Karnataka</span>}
                    {city === 'Chennai' && <span className="text-[10px] opacity-75">Tamil Nadu</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dosas, biryani, burgers or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Backend Connectivity Status Badge */}
            <div
              title={backendStatus.connected ? "Connected to Apache Tomcat 10.1+ Java REST Servlets" : "Running in Resilient Demo Mode"}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                backendStatus.connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Server className="w-3 h-3" />
              <span>{backendStatus.connected ? 'Java Tomcat: LIVE' : 'Java Server: Standby'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-white text-orange-600 rounded-full text-xs font-black shadow-inner animate-scale">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                  />
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                        {currentUser.roleName || 'CUSTOMER'}
                      </span>
                    </div>

                    {/* Admin Dashboard Navigation */}
                    {currentUser.roleName === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-orange-600 hover:bg-orange-50 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setCurrentView('orders');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <ListOrdered className="w-4 h-4 text-slate-500" />
                      <span>My Orders</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
