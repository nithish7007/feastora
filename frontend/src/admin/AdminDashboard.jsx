import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Pizza,
  ShoppingBag,
  Boxes,
  CreditCard,
  Users,
  FileBarChart,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Search,
  RefreshCw,
  Clock,
  QrCode,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logoutUser, setCurrentView, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'restaurants' | 'foods' | 'orders' | 'inventory' | 'payments' | 'customers' | 'reports'

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({
    cod_enabled: 'true',
    upi_enabled: 'true',
    upi_id: 'feastora@icici',
    upi_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=upi://pay?pa=feastora@icici&pn=FEASTORA&cu=INR'
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals inside Admin
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedFoodForRestock, setSelectedFoodForRestock] = useState(null);
  const [newStockValue, setNewStockValue] = useState(100);

  // New Restaurant Form State
  const [newRest, setNewRest] = useState({
    name: '',
    city: 'Bengaluru',
    location: '',
    address: '',
    cuisine: '',
    deliveryFee: 35,
    costForTwo: 400,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  // New Food Form State
  const [newFood, setNewFood] = useState({
    restaurantId: 1,
    categoryId: 1,
    name: '',
    price: 150,
    discountPercentage: 0,
    isVeg: true,
    isBestseller: false,
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
    description: ''
  });

  useEffect(() => {
    loadAllAdminData();
  }, [activeTab]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const d = await api.getAdminDashboard();
        setDashboardData(d);
      } else if (activeTab === 'restaurants') {
        const r = await api.getRestaurants({ city: 'All' });
        setRestaurants(r || []);
      } else if (activeTab === 'foods') {
        const f = await api.getFoods();
        setFoods(f || []);
        const r = await api.getRestaurants({ city: 'All' });
        setRestaurants(r || []);
      } else if (activeTab === 'orders') {
        const o = await api.getAdminOrders('ALL');
        setOrders(o || []);
      } else if (activeTab === 'inventory') {
        const inv = await api.getAdminInventory();
        setInventory(inv || []);
      } else if (activeTab === 'payments') {
        const p = await api.getAdminPayments();
        setPayments(p || []);
        const ps = await api.getAdminPaymentSettings();
        if (ps) setPaymentSettings(ps);
      } else if (activeTab === 'customers') {
        const c = await api.getAdminCustomers();
        setCustomers(c || []);
      } else if (activeTab === 'reports') {
        const d = await api.getAdminDashboard();
        setDashboardData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, `Admin transitioned status to ${newStatus}`);
      addToast(`Order #${orderId} status updated to: ${newStatus}`);
      loadAllAdminData();
    } catch (e) {
      addToast(e.message || "Failed to update status", "error");
    }
  };

  const handleVerifyPayment = async (paymentId, approve) => {
    try {
      await api.verifyPayment(paymentId, approve);
      addToast(approve ? "UPI Payment verified and marked SUCCESS!" : "Payment marked REJECTED.");
      loadAllAdminData();
    } catch (e) {
      addToast("Error verifying payment", "error");
    }
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateAdminPaymentSettings(paymentSettings);
      addToast("Payment gateway & UPI settings updated globally!");
    } catch (e) {
      addToast("Error updating settings", "error");
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFoodForRestock) return;
    try {
      await api.restockItem(selectedFoodForRestock.foodItemId, Number(newStockValue));
      addToast(`Stock for ${selectedFoodForRestock.foodName} updated to ${newStockValue}`);
      setIsRestockModalOpen(false);
      loadAllAdminData();
    } catch (e) {
      addToast("Failed to restock item", "error");
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const created = {
        ...newRest,
        id: Date.now(),
        rating: 4.8,
        ratingCount: 10,
        deliveryTimeMin: 20,
        deliveryTimeMax: 35,
        isOpen: true,
        isFeatured: false
      };
      setRestaurants(prev => [created, ...prev]);
      setIsAddRestaurantOpen(false);
      addToast(`Restaurant "${newRest.name}" registered successfully!`);
    } catch (e) {
      addToast("Error creating restaurant", "error");
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const created = {
        ...newFood,
        id: Date.now(),
        isAvailable: true
      };
      setFoods(prev => [created, ...prev]);
      setIsAddFoodOpen(false);
      addToast(`Food dish "${newFood.name}" added to menu!`);
    } catch (e) {
      addToast("Error adding food dish", "error");
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Order ID,Customer,Phone,Restaurant,Total Amount,Payment Method,Status,Date\n" +
      orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.restaurantName}",${o.grandTotal},"${o.paymentMethod}","${o.orderStatus}","${o.createdAt}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FEASTORA_Sales_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Sales CSV Report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Admin Badge */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  FEAST<span className="text-orange-500">ORA</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold border border-orange-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Platform Control & Operations</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'restaurants', label: 'Restaurants Management', icon: UtensilsCrossed },
              { id: 'foods', label: 'Food Dishes & Menus', icon: Pizza },
              { id: 'orders', label: 'Live Orders Management', icon: ShoppingBag },
              { id: 'inventory', label: 'Stock & Inventory Alerts', icon: Boxes },
              { id: 'payments', label: 'Payments & UPI Verification', icon: CreditCard },
              { id: 'customers', label: 'Customer Management', icon: Users },
              { id: 'reports', label: 'Sales Reports & CSV Export', icon: FileBarChart }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Exit */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[11px] font-bold text-white truncate">Feastora Admin</p>
            <p className="text-[10px] text-slate-400 font-mono">admin@feastora.com</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Role: ADMIN (Full Control)</span>
            </p>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Feastora Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

        {/* SECTION A: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Platform Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live metrics across restaurants, orders, inventory and revenue</p>
              </div>

              <button
                onClick={loadAllAdminData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-emerald-400">₹{dashboardData?.kpis?.totalRevenue || '64,280'}</p>
                <p className="text-[10px] text-slate-500">Today: ₹{dashboardData?.kpis?.todaySales || '8,940'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-black text-orange-400">{dashboardData?.kpis?.totalOrders || '148'}</p>
                <p className="text-[10px] text-slate-500">Delivered: {dashboardData?.kpis?.deliveredOrders || '122'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Restaurants</p>
                <p className="text-2xl font-black text-amber-400">{dashboardData?.kpis?.totalRestaurants || '16'}</p>
                <p className="text-[10px] text-slate-500">Across Bangalore & Chennai</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Foodies</p>
                <p className="text-2xl font-black text-indigo-400">{dashboardData?.kpis?.totalCustomers || '92'}</p>
                <p className="text-[10px] text-slate-500">100% Verified Users</p>
              </div>
            </div>

            {/* Status Breakdown Bar */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-black text-amber-400">{dashboardData?.kpis?.pendingOrders || 14}</p>
                <p className="text-xs font-bold text-slate-400">Kitchen Preparing</p>
              </div>
              <div>
                <p className="text-xl font-black text-cyan-400">{dashboardData?.kpis?.outForDeliveryOrders || 5}</p>
                <p className="text-xs font-bold text-slate-400">Out for Delivery</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-400">{dashboardData?.kpis?.deliveredOrders || 122}</p>
                <p className="text-xs font-bold text-slate-400">Delivered Safely</p>
              </div>
              <div>
                <p className="text-xl font-black text-rose-400">{dashboardData?.kpis?.cancelledOrders || 12}</p>
                <p className="text-xs font-bold text-slate-400">Cancelled / Restored</p>
              </div>
            </div>

            {/* Sales Trend Chart & Top Sellers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Sales Chart */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  <span>Recent Daily Sales (14-Day Trajectory)</span>
                </h3>

                <div className="space-y-2 pt-2">
                  {(dashboardData?.salesChart || []).map((day, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-400 w-24 shrink-0">{day.date}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (day.revenue / 10000) * 100)}%` }}
                        />
                      </div>
                      <span className="font-black text-slate-200 w-16 text-right">₹{day.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Dishes */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Pizza className="w-4 h-4 text-amber-400" />
                  <span>Best-Selling Dishes</span>
                </h3>

                <div className="divide-y divide-slate-800">
                  {(dashboardData?.bestsellers || []).map((b, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-extrabold text-white">{b.dishName}</p>
                        <p className="text-[11px] text-slate-400">{b.restaurantName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-400">{b.totalSold} sold</p>
                        <p className="text-[10px] text-emerald-400 font-mono">₹{b.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION B: RESTAURANTS MANAGEMENT */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Restaurant Management</h2>
                <p className="text-xs text-slate-400">Add, edit, and toggle operating status for all restaurants</p>
              </div>

              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Restaurant</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Restaurant</th>
                    <th className="p-3.5">City / Location</th>
                    <th className="p-3.5">Cuisine</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Delivery Fee</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {restaurants.map(r => (
                    <tr key={r.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white flex items-center gap-3">
                        <img src={r.imageUrl} alt={r.name} className="w-9 h-9 rounded-lg object-cover" />
                        <span>{r.name}</span>
                      </td>
                      <td className="p-3.5">{r.location}, {r.city}</td>
                      <td className="p-3.5 text-slate-400">{r.cuisine}</td>
                      <td className="p-3.5 font-bold text-amber-400">★ {r.rating}</td>
                      <td className="p-3.5">₹{r.deliveryFee}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {r.isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setRestaurants(prev => prev.map(item => item.id === r.id ? { ...item, isOpen: !item.isOpen } : item));
                            addToast(`Toggled status for ${r.name}`);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION C: FOOD MANAGEMENT */}
        {activeTab === 'foods' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Food Menu & Dishes</h2>
                <p className="text-xs text-slate-400">Control prices, discounts, veg tags, and availability</p>
              </div>

              <button
                onClick={() => setIsAddFoodOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Dish</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Dish Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Discount</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {foods.map(f => (
                    <tr key={f.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                        <img src={f.imageUrl} alt={f.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span>{f.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.isVeg ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {f.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>
                      <td className="p-3.5 font-black text-white">₹{f.price}</td>
                      <td className="p-3.5 font-semibold text-rose-400">{f.discountPercentage || 0}%</td>
                      <td className="p-3.5 font-mono">{f.stockQuantity || 100}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          AVAILABLE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION D: ORDER MANAGEMENT (7-STEP PIPELINE) */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Order Management & 7-Step Status Pipeline</h2>
                <p className="text-xs text-slate-400">Advance order states to update live customer tracking</p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-400">#{o.orderNumber}</span>
                      <h4 className="text-base font-black text-white">{o.customerName} ({o.customerPhone})</h4>
                      <p className="text-xs text-slate-400">{o.restaurantName} • {o.deliveryAddressText}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-400">₹{o.grandTotal}</p>
                      <p className="text-xs text-slate-400">Method: <strong className="text-slate-200">{o.paymentMethod}</strong> ({o.paymentStatus})</p>
                    </div>
                  </div>

                  {/* Status Pipeline Step Updater */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 mr-2">Transition Order:</span>
                    {[
                      'ORDER_PLACED',
                      'ORDER_CONFIRMED',
                      'FOOD_PREPARING',
                      'READY_FOR_PICKUP',
                      'DELIVERY_PARTNER_ASSIGNED',
                      'OUT_FOR DELIVERY',
                      'DELIVERED',
                      'CANCELLED'
                    ].map(st => {
                      const isCurrent = o.orderStatus === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(o.id, st)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION E: STOCK MANAGEMENT & INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Stock & Inventory Management</h2>
                <p className="text-xs text-slate-400">Real-time sold count, remaining stock & low-stock alerts</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Food Item</th>
                    <th className="p-3.5">Restaurant</th>
                    <th className="p-3.5">Initial Stock</th>
                    <th className="p-3.5">Sold Qty</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Alert Status</th>
                    <th className="p-3.5 text-right">Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white">{item.foodName}</td>
                      <td className="p-3.5 text-slate-400">{item.restaurantName}</td>
                      <td className="p-3.5 font-mono">{item.initialStock}</td>
                      <td className="p-3.5 font-mono text-orange-400 font-bold">{item.soldQuantity}</td>
                      <td className="p-3.5 font-mono font-black text-white">{item.currentStock}</td>
                      <td className="p-3.5">
                        {item.isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            OUT OF STOCK
                          </span>
                        ) : item.isLowStock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            LOW STOCK ALERT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedFoodForRestock(item);
                            setNewStockValue(item.currentStock + 50);
                            setIsRestockModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                        >
                          Restock +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION F: PAYMENT MANAGEMENT & MANUAL UPI VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Payment Gateways & UPI Verification</h2>
                <p className="text-xs text-slate-400">Manual verification of UPI UTR numbers and gateway settings</p>
              </div>
            </div>

            {/* Global Settings Form */}
            <form onSubmit={handleSavePaymentSettings} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span>Global Payment Gateway Settings</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Cash on Delivery (COD)</label>
                  <select
                    value={paymentSettings.cod_enabled}
                    onChange={(e) => setPaymentSettings(p => ({ ...p, cod_enabled: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Direct UPI Gateway</label>
                  <select
                    value={paymentSettings.upi_enabled}
                    onChange={(e) => setPaymentSettings(p => ({ ...p, upi_enabled: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Active Merchant UPI ID</label>
                  <input
                    type="text"
                    value={paymentSettings.upi_id}
                    onChange={(e) => setPaymentSettings(p => ({ ...p, upi_id: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </form>

            {/* UPI Transactions Awaiting Manual Verification */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>UPI Transactions Verification Queue</span>
              </h3>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Order</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">UPI / UTR Reference</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="p-3.5 font-mono text-orange-400 font-bold">#{p.orderNumber}</td>
                        <td className="p-3.5">{p.paymentMethod}</td>
                        <td className="p-3.5 font-black text-white">₹{p.amount}</td>
                        <td className="p-3.5 font-mono text-slate-200">{p.upiReference || p.transactionId}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.paymentStatus === 'VERIFIED_BY_ADMIN' || p.paymentStatus === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400 animate-pulse'
                          }`}>
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {p.paymentStatus !== 'VERIFIED_BY_ADMIN' && (
                            <>
                              <button
                                onClick={() => handleVerifyPayment(p.id, true)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Approve UPI
                              </button>
                              <button
                                onClick={() => handleVerifyPayment(p.id, false)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION G: CUSTOMER MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Customer Accounts</h2>
                <p className="text-xs text-slate-400">View customer lifetime orders, total spend and toggle status</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Orders</th>
                    <th className="p-3.5">Total Spent</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-bold text-white">{c.fullName}</td>
                      <td className="p-3.5 text-slate-400">{c.email}</td>
                      <td className="p-3.5 font-mono">{c.phone}</td>
                      <td className="p-3.5 font-black text-orange-400">{c.orderCount} orders</td>
                      <td className="p-3.5 font-black text-emerald-400">₹{c.totalSpent}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION H: REPORTS & CSV EXPORT */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Financial Reports & Data Export</h2>
                <p className="text-xs text-slate-400">Download formatted CSV reports for audit and analytics</p>
              </div>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Orders CSV Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase">Daily Revenue (Today)</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">₹{dashboardData?.kpis?.todaySales || '8,940'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase">Weekly Revenue (7 Days)</p>
                <p className="text-2xl font-black text-orange-400 mt-1">₹{dashboardData?.kpis?.weeklySales || '38,200'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase">Monthly Revenue (30 Days)</p>
                <p className="text-2xl font-black text-amber-400 mt-1">₹{dashboardData?.kpis?.monthlySales || '64,280'}</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* RESTOCK MODAL */}
      {isRestockModalOpen && selectedFoodForRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h4 className="text-lg font-black text-white">Restock Food Inventory</h4>
            <p className="text-xs text-slate-400">{selectedFoodForRestock.foodName} ({selectedFoodForRestock.restaurantName})</p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">New Total Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD RESTAURANT MODAL */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 my-8">
            <h4 className="text-lg font-black text-white">Add New Restaurant to Feastora</h4>

            <form onSubmit={handleAddRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangeetha Veg Restaurant"
                  value={newRest.name}
                  onChange={(e) => setNewRest(r => ({ ...r, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City</label>
                  <select
                    value={newRest.city}
                    onChange={(e) => setNewRest(r => ({ ...r, city: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Mysore">Mysore</option>
                    <option value="Coimbatore">Coimbatore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Location / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indiranagar"
                    value={newRest.location}
                    onChange={(e) => setNewRest(r => ({ ...r, location: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Cuisines</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Indian, Tamil Nadu Special"
                  value={newRest.cuisine}
                  onChange={(e) => setNewRest(r => ({ ...r, cuisine: e.target.value }))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl"
                >
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FOOD MODAL */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 my-8">
            <h4 className="text-lg font-black text-white">Add Food Dish to Menu</h4>

            <form onSubmit={handleAddFood} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Podi Ghee Roast Dosa"
                  value={newFood.name}
                  onChange={(e) => setNewFood(f => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newFood.price}
                    onChange={(e) => setNewFood(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Diet Type</label>
                  <select
                    value={newFood.isVeg ? 'true' : 'false'}
                    onChange={(e) => setNewFood(f => ({ ...f, isVeg: e.target.value === 'true' }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="true">Pure Veg (Green)</option>
                    <option value="false">Non-Veg (Red)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFoodOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
