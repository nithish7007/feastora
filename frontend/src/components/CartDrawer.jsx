import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    updateQuantity,
    clearCart,
    applyCoupon,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">

          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-orange-100 text-orange-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Delicious Cart</h3>
                {cart.restaurantName && (
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[220px]">
                    From: <strong className="text-orange-600">{cart.restaurantName}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body: Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-orange-400" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800 mb-1">Your cart is feeling lonely</h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Explore dishes from top restaurants like MTR, Truffles or Meghana Foods!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Browse Menu Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 pt-3 first:pt-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-3.5 h-3.5 rounded-xs border p-0.5 flex items-center justify-center shrink-0 ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      </div>

                      <div>
                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                          {item.name}
                        </h5>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">
                          ₹{item.price} each
                        </p>

                        {/* Customizations display */}
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.customizations.map((c, cIdx) => (
                              <span key={cIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                + {c.name} (₹{c.additionalPrice})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controller */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2 py-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="p-0.5 text-slate-600 hover:text-orange-600 cursor-pointer"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black min-w-[16px] text-center text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="p-0.5 text-slate-600 hover:text-orange-600 cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer: Bill Breakdown & Checkout */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-4">

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FEAST50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{cart.itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-slate-800">₹{cart.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Taxes (5%)</span>
                  <span className="font-semibold text-slate-800">₹{cart.taxAmount}</span>
                </div>

                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({cart.couponCode})</span>
                    <span>- ₹{cart.discountAmount}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                  <span>To Pay (Grand Total)</span>
                  <span className="text-base text-orange-600">₹{cart.grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
