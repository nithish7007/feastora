import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryBar } from '../components/CategoryBar';
import { RestaurantCard } from '../components/RestaurantCard';
import { DishCard } from '../components/DishCard';
import {
  Flame,
  Star,
  Award,
  Sparkles,
  Filter,
  Check,
  TrendingUp,
  IceCream,
  Quote
} from 'lucide-react';

export const HomePage = () => {
  const { selectedCity, activeCategory, searchQuery } = useApp();

  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'rating' | 'time' | 'cost_asc'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rData, fData] = await Promise.all([
          api.getRestaurants({
            city: selectedCity,
            search: searchQuery,
            sortBy: sortBy
          }),
          api.getFoods({
            search: searchQuery,
            category: activeCategory
          })
        ]);
        setRestaurants(rData || []);
        setFoods(fData || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCity, activeCategory, searchQuery, sortBy]);

  // Client-side quick filtering
  let filteredRestaurants = restaurants.filter(r => {
    if (filterRating4Plus && r.rating < 4.5) return false;
    if (filterFastDelivery && r.deliveryTimeMin > 25) return false;
    return true;
  });

  const trendingDishes = [
    {
      id: 8,
      name: 'Meghana Special Chicken Biryani',
      description: 'Succulent boneless chicken cubes tossed in spicy Andhra masala layered over fragrant basmati rice.',
      price: 340,
      discountPercentage: 15,
      isVeg: false,
      isBestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
      restaurantName: 'Meghana Foods',
      restaurantId: 5
    },
    {
      id: 2,
      name: 'Pure Ghee Masala Dosa',
      description: 'Crisp golden crepe roasted in aromatic desi ghee, stuffed with potato palya and served with coconut chutney.',
      price: 110,
      discountPercentage: 0,
      isVeg: true,
      isBestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80',
      restaurantName: 'Mavalli Tiffin Room (MTR)',
      restaurantId: 1
    },
    {
      id: 11,
      name: 'All American Cheese Burger',
      description: 'Juicy grilled patty topped with melted cheddar, crisp lettuce, caramelized onions, and garlic mayo.',
      price: 260,
      discountPercentage: 10,
      isVeg: false,
      isBestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
      restaurantName: 'Truffles Burgers & Shakes',
      restaurantId: 8
    },
    {
      id: 1,
      name: 'MTR Special Rava Idli',
      description: 'The world-famous invention of MTR. Steamed semolina cakes spiced with cashews and pure cow ghee.',
      price: 75,
      discountPercentage: 10,
      isVeg: true,
      isBestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
      restaurantName: 'Mavalli Tiffin Room (MTR)',
      restaurantId: 1
    }
  ];

  const customerReviews = [
    {
      name: 'Ananya Deshpande',
      city: 'Indiranagar, Bengaluru',
      rating: 5,
      comment: 'The MTR Rava Idlis were delivered steaming hot in 22 minutes! Golden desi ghee aroma was extraordinary.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Karthik Subramanian',
      city: 'T. Nagar, Chennai',
      rating: 5,
      comment: 'Feastora is hands down the cleanest food app. Ordering Junior Kuppanna biryani with live tracking was seamless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Shreya Hegde',
      city: 'Malleshwaram, Bengaluru',
      rating: 5,
      comment: 'CTR buttery benne dosa tasted straight out of the tawa! Super excited to have UPI & COD payment options.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFB]">

      {/* Hero Banner with Food Photography & Mascot */}
      <HeroBanner />

      {/* 20 Food Categories Carousel */}
      <CategoryBar />

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              <span>Filters:</span>
            </span>

            <button
              onClick={() => setFilterRating4Plus(!filterRating4Plus)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filterRating4Plus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Ratings 4.5+ ★
            </button>

            <button
              onClick={() => setFilterFastDelivery(!filterFastDelivery)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filterFastDelivery
                  ? 'bg-orange-50 text-orange-700 border-orange-300 ring-2 ring-orange-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              ⚡ Fast Delivery (&lt; 25 mins)
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating: High to Low</option>
              <option value="time">Delivery Time</option>
              <option value="cost_asc">Cost: Low to High</option>
              <option value="cost_desc">Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* Trending Dishes Carousel Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Flame className="w-4 h-4 fill-orange-500" />
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Trending Dishes Near You
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Most ordered and critically acclaimed delicacies in South India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDishes.map(dish => (
              <DishCard
                key={dish.id}
                dish={dish}
                restaurant={{ id: dish.restaurantId, name: dish.restaurantName, deliveryFee: 35 }}
              />
            ))}
          </div>
        </div>

        {/* Popular Restaurants Catalogue */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeCategory ? `${activeCategory} Special Restaurants` : `Top Restaurants in ${selectedCity === 'All' ? 'South India' : selectedCity}`}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {filteredRestaurants.length} iconic heritage restaurants ready to serve
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 rounded-3xl animate-shimmer" />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
              <p className="text-base font-bold text-slate-700">No restaurants match your active filters</p>
              <button
                onClick={() => {
                  setFilterRating4Plus(false);
                  setFilterFastDelivery(false);
                }}
                className="mt-3 px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRestaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>

        {/* Fresh Juices & Ice Cream Spotlight Section */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-orange-200/50">
          <div className="flex items-center gap-2 mb-2">
            <IceCream className="w-5 h-5 text-orange-600" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Desserts & Fresh Cold-Pressed Juices
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xl">
            Complete your meal with chilled Ratnagiri Alphonso juice, Belgian gelato, or authentic Mysore Pak.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=150&q=80"
                alt="Alphonso Juice"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Alphonso Mango Nectar</p>
                <p className="text-[11px] text-slate-500">100% natural, no sugar</p>
                <p className="text-xs font-black text-orange-600 mt-1">₹120</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=150&q=80"
                alt="Ferrero Shake"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Ferrero Rocher Shake</p>
                <p className="text-[11px] text-slate-500">Thick artisanal shake</p>
                <p className="text-xs font-black text-orange-600 mt-1">₹190</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=150&q=80"
                alt="Belgian Sundae"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Belgian Dark Gelato</p>
                <p className="text-[11px] text-slate-500">70% dark cocoa hot fudge</p>
                <p className="text-xs font-black text-orange-600 mt-1">₹160</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=150&q=80"
                alt="Mysore Pak"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Mylari Mysore Pak</p>
                <p className="text-[11px] text-slate-500">Melt-in-mouth ghee delicacy</p>
                <p className="text-xs font-black text-orange-600 mt-1">₹90</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div>
          <div className="text-center max-w-lg mx-auto mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Loved by Foodies Across India</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Real ratings and experiences from verified FEASTORA customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{rev.name}</p>
                    <p className="text-[11px] text-slate-400">{rev.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
