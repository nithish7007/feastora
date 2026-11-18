import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, MapPin, Phone, User, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';

export const CheckoutModal = () => {
  const {
    cart,
    clearCart,
    currentUser,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setActiveTrackingOrder,
    setCurrentView,
    addToast
  } = useApp();

  const [name, setName] = useState(currentUser?.fullName || 'Rahul Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9845012345');
  const [address, setAddress] = useState('#42, 4th Cross, 100ft Road, Indiranagar, Bengaluru');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'UPI' | 'CARD'
  const [paymentConfig, setPaymentConfig] = useState({
    upi_id: 'feastora@icici',
    upi_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=feastora@icici&pn=FEASTORA&cu=INR'
  });
  const [upiReference, setUpiReference] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen) {
      api.getPaymentConfig().then(cfg => {
        if (cfg) setPaymentConfig(cfg);
      });
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(paymentConfig.upi_id || 'feastora@icici');
    addToast("Copied UPI ID to clipboard!");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      addToast("Please fill in delivery details", "error");
      return;
    }

    if (paymentMethod === 'UPI' && !upiReference.trim()) {
      addToast("Please enter your UPI Transaction / UTR reference number", "error");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: name,
        customerPhone: phone,
        deliveryAddress: address,
        paymentMethod,
        couponCode: cart.couponCode,
        specialInstructions,
        upiReference: paymentMethod === 'UPI' ? upiReference : null,
        grandTotal: cart.grandTotal
      };

      const placedOrder = await api.checkout(orderPayload);

      addToast("🎉 Order placed successfully! Tracking your food now.");
      clearCart();
      setIsCheckoutOpen(false);
      setActiveTrackingOrder(placedOrder);
      setCurrentView('orders');
    } catch (err) {
      addToast(err.message || "Failed to place order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8">

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Checkout & Delivery</h3>
            <p className="text-xs text-slate-500">Order from: <strong className="text-orange-600">{cart.restaurantName}</strong></p>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">

          {/* 1. Contact & Address Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>1. Delivery Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Delivery Address</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No, Street, Landmark, Area"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Notes (Optional)</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please do not ring the doorbell, leave at security"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>2. Payment Method</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'COD' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500">Pay cash upon arrival</p>
                </div>
              </div>

              {/* Direct UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">UPI / QR Code</p>
                  <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Cards / Online */}
              <div
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-rose-600" />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'CARD' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Credit / Debit</p>
                  <p className="text-[10px] text-slate-500">Razorpay Architecture</p>
                </div>
              </div>
            </div>

            {/* UPI Dynamic QR Code & Verification Input */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                <div className="w-32 h-32 bg-white rounded-xl p-2 border border-indigo-200 shadow-sm shrink-0">
                  <img
                    src={paymentConfig.upi_qr_url || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=feastora@icici&pn=FEASTORA&cu=INR'}
                    alt="FEASTORA Dynamic UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2 text-left w-full">
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
                    <span className="text-xs font-bold text-indigo-900 font-mono">
                      {paymentConfig.upi_id || 'feastora@icici'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Scan via GPay, PhonePe or Paytm. Enter your 12-digit UTR/Ref ID below for instant admin verification:
                  </p>

                  <input
                    type="text"
                    required
                    placeholder="Enter UPI Reference / UTR Number (e.g. 438192847192)"
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value)}
                    className="w-full p-2 text-xs font-mono font-bold bg-white border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Order Summary & Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Grand Total</p>
              <p className="text-2xl font-black text-orange-600">₹{cart.grandTotal}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>{loading ? 'Confirming...' : 'Place Order Now'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
