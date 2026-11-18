import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, Bike } from 'lucide-react';

export const RestaurantCard = ({ restaurant }) => {
  const { setSelectedRestaurantId, setCurrentView } = useApp();

  const handleCardClick = () => {
    setSelectedRestaurantId(restaurant.id);
    setCurrentView('restaurant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer"
    >
      {/* Restaurant Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

        {/* Featured Ribbon */}
        {restaurant.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            FEATURED
          </div>
        )}

        {/* Delivery Time Badge overlay bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-xl shadow-md">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min</span>
        </div>

        {/* Cost For Two overlay bottom left */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow-md">
          ₹{restaurant.costForTwo} for two
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Rating Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0 shadow-xs">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">
            {restaurant.cuisine}
          </p>

          {/* Location & City */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{restaurant.location}, {restaurant.city}</span>
          </div>
        </div>

        {/* Footer Row: Delivery Fee and Status */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-600">
            <Bike className="w-4 h-4 text-orange-500" />
            <span>₹{restaurant.deliveryFee} delivery</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600">OPEN NOW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
