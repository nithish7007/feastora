import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  MapPin,
  Utensils,
  ChevronRight,
  AlertTriangle,
  Ban
} from 'lucide-react';

export const OrderTrackingModal = () => {
  const { activeTrackingOrder, setActiveTrackingOrder, addToast } = useApp();
  const [currentOrder, setCurrentOrder] = useState(activeTrackingOrder);
  const [cancelling, setCancelling] = useState(false);

  const steps = [
    { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Received by Feastora system' },
    { key: 'ORDER_CONFIRMED', label: 'Order Confirmed', desc: 'Accepted by kitchen staff' },
    { key: 'FOOD_PREPARING', label: 'Food Preparing', desc: 'Chef cooking with fresh ingredients' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Neatly packed in eco boxes' },
    { key: 'DELIVERY_PARTNER_ASSIGNED', label: 'Delivery Partner Assigned', desc: 'Partner en route to kitchen' },
    { key: 'OUT_FOR DELIVERY', label: 'Out for Delivery', desc: 'Rider is zooming to your doorstep' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your delicious feast!' }
  ];

  useEffect(() => {
    setCurrentOrder(activeTrackingOrder);
  }, [activeTrackingOrder]);

  if (!currentOrder) return null;

  // Find step index
  const getStepIndex = (status) => {
    if (status === 'OUT_FOR_DELIVERY') status = 'OUT_FOR DELIVERY';
    const idx = steps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const activeIndex = currentOrder.orderStatus === 'CANCELLED' ? -1 : getStepIndex(currentOrder.orderStatus);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? Stock will be restored to inventory.")) {
      return;
    }
    setCancelling(true);
    try {
      await api.cancelOrder(currentOrder.id, "Customer requested cancellation");
      setCurrentOrder(prev => ({ ...prev, orderStatus: 'CANCELLED' }));
      addToast("Order cancelled successfully.", "info");
    } catch (err) {
      addToast(err.message || "Failed to cancel order", "error");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8">

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Live Tracking
              </span>
              <span className="text-xs opacity-90 font-mono">#{currentOrder.orderNumber}</span>
            </div>
            <h3 className="text-xl font-black tracking-tight mt-1">
              Estimated Delivery: {currentOrder.estimatedDeliveryTime || '25-30 Mins'}
            </h3>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

          {/* Cancelled Banner if applicable */}
          {currentOrder.orderStatus === 'CANCELLED' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
              <Ban className="w-6 h-6 shrink-0 text-rose-600" />
              <div>
                <p className="text-sm font-bold">This order has been cancelled.</p>
                <p className="text-xs text-rose-600 mt-0.5">Inventory stock was automatically restored.</p>
              </div>
            </div>
          ) : (
            /* Visual 7-Step Timeline */
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Live Order Progress (7-Step Visual Pipeline)</span>
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-3">
                {steps.map((step, idx) => {
                  const isDone = idx < activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={step.key} className="relative group">
                      {/* Step Indicator Bullet */}
                      <div className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-orange-500 text-white ring-4 ring-orange-200 animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-slate-300'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-black">{idx + 1}</span>
                        )}
                      </div>

                      <div>
                        <p className={`text-xs sm:text-sm font-extrabold ${
                          isCurrent ? 'text-orange-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Partner Demo Module */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Delivery Partner</p>
                <p className="text-sm font-black text-slate-900">
                  {currentOrder.deliveryPartnerName || 'Rajesh Kumar (KA-01-EZ-4521)'}
                </p>
                <p className="text-xs text-emerald-600 font-semibold">★ 4.9 Rating • 1,400+ deliveries</p>
              </div>
            </div>

            <a
              href={`tel:${currentOrder.deliveryPartnerPhone || '+919886012345'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Partner</span>
            </a>
          </div>

          {/* Restaurant & Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-white">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Pick up From</p>
              <p className="font-black text-slate-900 text-sm">{currentOrder.restaurantName}</p>
              <p className="text-slate-500 mt-0.5">Freshly packed in kitchen</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-100 bg-white">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Delivering To</p>
              <p className="font-bold text-slate-800 line-clamp-2">{currentOrder.deliveryAddressText}</p>
            </div>
          </div>

          {/* Bill & Cancellation Section */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payment Method</p>
              <p className="text-xs font-bold text-slate-800">
                {currentOrder.paymentMethod} • <span className="text-emerald-600">{currentOrder.paymentStatus}</span>
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5">₹{currentOrder.grandTotal}</p>
            </div>

            {currentOrder.orderStatus !== 'DELIVERED' && currentOrder.orderStatus !== 'CANCELLED' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
