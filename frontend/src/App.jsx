import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomizationModal } from './components/CustomizationModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { RestaurantPage } from './pages/RestaurantPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { currentView, toasts } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#FAF8F5]">

      {/* Animated Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Persistent Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 p-3.5 rounded-2xl shadow-xl text-xs font-bold text-white transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-600'
                : toast.type === 'info'
                ? 'bg-slate-900'
                : 'bg-emerald-600'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header Navigation Bar (Hidden when inside full Admin Dashboard view) */}
      {currentView !== 'admin' && <Navbar />}

      {/* Main Routed Page Views */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'restaurant' && <RestaurantPage />}
        {currentView === 'orders' && <OrdersPage />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <CustomizationModal />
      <AuthModal />

      {/* Footer (Hidden when inside full Admin Dashboard view) */}
      {currentView !== 'admin' && <Footer />}

    </div>
  );
}

export default App;
