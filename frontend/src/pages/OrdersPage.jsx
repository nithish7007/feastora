import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ListOrdered,
  Clock,
  MapPin,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Ban,
  Bike
} from 'lucide-react';

export const OrdersPage = () => {
  const { currentUser, setActiveTrackingOrder, setCurrentView } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await api.getAdminOrders('ALL'); // gets sample/user orders
        setOrders(data || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#FFFDFB] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Back and Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cravings</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-orange-500" />
            <span>My Orders & Live Tracking</span>
          </h1>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-36 rounded-3xl animate-shimmer" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
            <p className="text-base font-bold text-slate-700">You haven't placed any orders yet!</p>
            <p className="text-xs text-slate-500 mt-1">Explore our 20 categories of authentic South Indian cuisine.</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const isDelivered = order.orderStatus === 'DELIVERED';
              const isCancelled = order.orderStatus === 'CANCELLED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{order.orderNumber}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800 animate-pulse'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>

                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{order.createdAt}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {order.restaurantName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="line-clamp-1">{order.deliveryAddressText}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      Paid via <span className="font-bold">{order.paymentMethod}</span> (Status: {order.paymentStatus})
                    </p>
                  </div>

                  {/* Right Actions & Amount */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <p className="text-xl font-black text-slate-900">
                      ₹{order.grandTotal}
                    </p>

                    <button
                      onClick={() => setActiveTrackingOrder(order)}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
