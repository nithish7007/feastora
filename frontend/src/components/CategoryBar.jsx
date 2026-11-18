import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Utensils, ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryBar = () => {
  const { activeCategory, setActiveCategory } = useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('category-scroll-container');
    if (container) {
      const amount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                <Utensils className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Inspirations for Your Appetite
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore 20 signature culinary categories freshly prepared for you
            </p>
          </div>

          {/* Left / Right Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-slate-200 hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
              title="Previous categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-slate-200 hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
              title="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Row */}
        <div
          id="category-scroll-container"
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none no-scrollbar scroll-smooth"
        >
          {/* 'All' Category Reset Pill */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex flex-col items-center shrink-0 group cursor-pointer transition-transform ${
              activeCategory === null ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all ${
              activeCategory === null
                ? 'ring-4 ring-orange-500 ring-offset-2 shadow-lg bg-orange-500'
                : 'border border-slate-200 group-hover:border-orange-400 bg-slate-50'
            }`}>
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                ALL FOOD
              </div>
            </div>
            <span className={`mt-2 text-xs font-bold transition-colors ${
              activeCategory === null ? 'text-orange-600' : 'text-slate-700 group-hover:text-orange-600'
            }`}>
              All Categories
            </span>
          </button>

          {/* Individual Category Items */}
          {categories.map(cat => {
            const isSelected = activeCategory === cat.name || activeCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => setActiveCategory(isSelected ? null : cat.name)}
                className={`flex flex-col items-center shrink-0 group cursor-pointer transition-transform ${
                  isSelected ? 'scale-105' : 'hover:scale-105'
                }`}
              >
                {/* Circular Category Thumbnail with Border */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all ${
                  isSelected
                    ? 'ring-4 ring-orange-500 ring-offset-2 shadow-lg bg-orange-500'
                    : 'border border-slate-200 group-hover:border-orange-400 bg-white'
                }`}>
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span className={`mt-2 text-xs font-bold text-center max-w-[90px] truncate transition-colors ${
                  isSelected ? 'text-orange-600' : 'text-slate-700 group-hover:text-orange-600'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
