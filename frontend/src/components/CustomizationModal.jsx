import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export const CustomizationModal = () => {
  const { customizingDish, setCustomizingDish, addToCart } = useApp();
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);

  if (!customizingDish) return null;

  const { dish, restaurant } = customizingDish;

  const toggleCustomization = (custom) => {
    setSelectedCustomizations(prev => {
      const exists = prev.some(c => c.id === custom.id);
      if (exists) {
        return prev.filter(c => c.id !== custom.id);
      } else {
        return [...prev, custom];
      }
    });
  };

  const extraCost = selectedCustomizations.reduce((acc, c) => acc + (c.additionalPrice || 0), 0);
  const totalItemPrice = dish.price + extraCost;

  const handleConfirm = () => {
    addToCart(dish, restaurant, selectedCustomizations);
    setCustomizingDish(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3.5 h-3.5 rounded-xs border p-0.5 flex items-center justify-center ${
                dish.isVeg ? 'border-emerald-600' : 'border-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{dish.name}</h3>
            </div>
            <p className="text-xs text-slate-500">Customize your preference & add-ons</p>
          </div>

          <button
            onClick={() => setCustomizingDish(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Options List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Add-ons & Extras
          </p>

          <div className="space-y-2">
            {dish.customizations && dish.customizations.map(c => {
              const isChecked = selectedCustomizations.some(item => item.id === c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCustomization(c)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {c.name}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    +₹{c.additionalPrice}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer with Price Summary and Add Button */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Item Price</p>
            <p className="text-xl font-black text-slate-900">₹{totalItemPrice}</p>
          </div>

          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Add Item to Cart
          </button>
        </div>

      </div>
    </div>
  );
};
