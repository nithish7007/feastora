import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DishCard } from '../components/DishCard';
import {
  Star,
  Clock,
  MapPin,
  Bike,
  ArrowLeft,
  Search,
  Sparkles,
  Info
} from 'lucide-react';

export const RestaurantPage = () => {
  const { selectedRestaurantId, setCurrentView } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getRestaurantById(selectedRestaurantId || 1);
        setRestaurant(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [selectedRestaurantId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 rounded-3xl animate-shimmer mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 rounded-3xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-bold text-slate-800">Restaurant not found.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-2xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Filter menu
  const filteredMenu = (restaurant.menu || []).filter(item => {
    if (vegOnly && !item.isVeg) return false;
    if (menuSearch.trim() && !item.name.toLowerCase().includes(menuSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFDFB] pb-20">

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-100 py-3 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Home / {restaurant.city} / <strong className="text-slate-800">{restaurant.name}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* Restaurant Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

            {/* Left Info Column */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  Open Now
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">{restaurant.cuisine}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {restaurant.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{restaurant.address || `${restaurant.location}, ${restaurant.city}`}</span>
              </div>

              {/* Delivery Stats Grid */}
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                    <span>{restaurant.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{restaurant.ratingCount}+ ratings</span>
                </div>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins</span>
                </div>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Bike className="w-4 h-4 text-orange-500" />
                  <span>₹{restaurant.deliveryFee} Delivery Fee</span>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>

        {/* Menu Search and Quick Veg Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search in menu..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              vegOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-xs border border-emerald-600 p-0.5 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <span>Pure Veg Dishes Only</span>
          </button>
        </div>

        {/* Menu Items Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Recommended Menu Items ({filteredMenu.length})
            </h2>
          </div>

          {filteredMenu.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
              <p className="text-sm font-bold text-slate-600">No dishes match your filter.</p>
              <button
                onClick={() => { setVegOnly(false); setMenuSearch(''); }}
                className="mt-3 px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenu.map(dish => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
