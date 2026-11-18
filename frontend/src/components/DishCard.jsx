import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Star, Flame, Sparkles, Heart } from 'lucide-react';

export const DishCard = ({ dish, restaurant }) => {
  const { cart, addToCart, updateQuantity, setCustomizingDish } = useApp();

  // Find if this dish is in cart
  const cartItem = cart.items.find(i => i.dishId === dish.id);
  const cartItemIndex = cart.items.findIndex(i => i.dishId === dish.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    // If dish has customizations, open customization modal
    if (dish.customizations && dish.customizations.length > 0) {
      setCustomizingDish({ dish, restaurant });
    } else {
      addToCart(dish, restaurant, []);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4">

      {/* Top Details & Veg/Non-Veg Tag */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {/* Veg / Non-Veg Icon */}
          <div className={`w-4 h-4 rounded-sm border p-0.5 flex items-center justify-center ${
            dish.isVeg ? 'border-emerald-600' : 'border-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
            }`} />
          </div>

          {/* Bestseller Badge */}
          {dish.isBestseller && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>Bestseller</span>
            </span>
          )}

          {/* Discount Badge */}
          {dish.discountPercentage > 0 && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {dish.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h4 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
          {dish.name}
        </h4>

        {/* Price & Original Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-black text-slate-900">
            ₹{dish.price}
          </span>
          {dish.discountPercentage > 0 && (
            <span className="text-xs text-slate-400 line-through">
              ₹{Math.round(dish.price / (1 - dish.discountPercentage / 100))}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>
      </div>

      {/* Bottom Thumbnail & Action Button */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-50">

        {/* Thumbnail Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />

          {dish.customizations && dish.customizations.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 text-center bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white py-0.5 rounded">
              Customizable
            </div>
          )}
        </div>

        {/* Add To Cart or Quantity Controller */}
        <div className="flex flex-col items-end gap-1.5">
          {currentQuantity > 0 ? (
            <div className="flex items-center gap-2 bg-orange-500 text-white rounded-2xl px-2 py-1.5 shadow-md shadow-orange-500/25">
              <button
                onClick={() => updateQuantity(cartItemIndex, -1)}
                className="p-1 hover:bg-orange-600 rounded-lg transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black min-w-[20px] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => updateQuantity(cartItemIndex, 1)}
                className="p-1 hover:bg-orange-600 rounded-lg transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-orange-500 text-orange-600 hover:text-white font-extrabold text-xs sm:text-sm border-2 border-orange-500 shadow-sm transition-all hover:shadow-md hover:shadow-orange-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          )}

          {dish.customizations && dish.customizations.length > 0 && currentQuantity === 0 && (
            <span className="text-[10px] text-slate-400 font-medium">Customisable</span>
          )}
        </div>

      </div>

    </div>
  );
};
