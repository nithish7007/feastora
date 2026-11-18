import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('feastora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('feastora_token') || '');

  // Backend Connectivity state
  const [backendStatus, setBackendStatus] = useState({ connected: false, checked: false });

  // Filters & Global Navigation
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('feastora_cart');
    return saved ? JSON.parse(saved) : {
      restaurantId: null,
      restaurantName: '',
      items: [],
      itemTotal: 0,
      deliveryFee: 35,
      taxAmount: 0,
      discountAmount: 0,
      couponCode: null,
      grandTotal: 0
    };
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'admin'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [customizingDish, setCustomizingDish] = useState(null);

  // Active View: 'home' | 'restaurant' | 'admin' | 'orders'
  const [currentView, setCurrentView] = useState('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Check backend health on mount
  useEffect(() => {
    const checkConn = async () => {
      const res = await api.checkHealth();
      setBackendStatus({ connected: res.connected, checked: true });
    };
    checkConn();
    const timer = setInterval(checkConn, 15000);
    return () => clearInterval(timer);
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('feastora_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Recalculate Cart Totals
  const recalculateCart = (items, deliveryFee = 35, discount = 0, coupon = null) => {
    const itemTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = Math.round(itemTotal * 0.05 * 100) / 100;
    const finalDelivery = items.length > 0 ? deliveryFee : 0;
    const grandTotal = Math.max(0, itemTotal + finalDelivery + taxAmount - discount);

    return {
      itemTotal,
      deliveryFee: finalDelivery,
      taxAmount,
      discountAmount: discount,
      couponCode: coupon,
      grandTotal
    };
  };

  // Add Item to Cart
  const addToCart = (dish, restaurant, selectedCustomizations = []) => {
    const extraPrice = selectedCustomizations.reduce((acc, c) => acc + (c.additionalPrice || 0), 0);
    const finalPrice = (dish.price || 0) + extraPrice;

    // Check if adding from different restaurant
    if (cart.restaurantId && cart.restaurantId !== restaurant.id && cart.items.length > 0) {
      if (!window.confirm(`Your cart already contains delicious items from "${cart.restaurantName}". Clear your cart and start a new order from "${restaurant.name}"?`)) {
        return false;
      }
      // Clear previous cart
      const newItem = {
        dishId: dish.id,
        name: dish.name,
        price: finalPrice,
        basePrice: dish.price,
        imageUrl: dish.imageUrl,
        isVeg: dish.isVeg,
        quantity: 1,
        customizations: selectedCustomizations
      };
      const totals = recalculateCart([newItem], restaurant.deliveryFee || 35);
      setCart({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: [newItem],
        ...totals
      });
      addToast(`Added "${dish.name}" to cart!`);
      return true;
    }

    setCart(prev => {
      const existingIndex = prev.items.findIndex(i =>
        i.dishId === dish.id && JSON.stringify(i.customizations) === JSON.stringify(selectedCustomizations)
      );

      let updatedItems = [...prev.items];
      if (existingIndex > -1) {
        updatedItems[existingIndex].quantity += 1;
      } else {
        updatedItems.push({
          dishId: dish.id,
          name: dish.name,
          price: finalPrice,
          basePrice: dish.price,
          imageUrl: dish.imageUrl,
          isVeg: dish.isVeg,
          quantity: 1,
          customizations: selectedCustomizations
        });
      }

      const totals = recalculateCart(updatedItems, restaurant.deliveryFee || prev.deliveryFee || 35, prev.discountAmount, prev.couponCode);
      return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: updatedItems,
        ...totals
      };
    });

    addToast(`Added "${dish.name}" to cart!`);
    return true;
  };

  // Update item quantity
  const updateQuantity = (index, delta) => {
    setCart(prev => {
      let updatedItems = [...prev.items];
      const newQty = updatedItems[index].quantity + delta;
      if (newQty <= 0) {
        updatedItems.splice(index, 1);
      } else {
        updatedItems[index].quantity = newQty;
      }

      if (updatedItems.length === 0) {
        return {
          restaurantId: null,
          restaurantName: '',
          items: [],
          itemTotal: 0,
          deliveryFee: 0,
          taxAmount: 0,
          discountAmount: 0,
          couponCode: null,
          grandTotal: 0
        };
      }

      const totals = recalculateCart(updatedItems, prev.deliveryFee, prev.discountAmount, prev.couponCode);
      return {
        ...prev,
        items: updatedItems,
        ...totals
      };
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart({
      restaurantId: null,
      restaurantName: '',
      items: [],
      itemTotal: 0,
      deliveryFee: 0,
      taxAmount: 0,
      discountAmount: 0,
      couponCode: null,
      grandTotal: 0
    });
    addToast("Cart cleared", "info");
  };

  // Apply Coupon
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    try {
      const res = await api.validateCoupon(code.trim().toUpperCase(), cart.itemTotal);
      const discount = res.discountAmount || 0;
      const totals = recalculateCart(cart.items, cart.deliveryFee, discount, code.toUpperCase());
      setCart(prev => ({
        ...prev,
        ...totals
      }));
      addToast(`Coupon "${code.toUpperCase()}" applied! Saved ₹${discount}`);
      return true;
    } catch (err) {
      addToast(err.message || "Invalid coupon code", "error");
      return false;
    }
  };

  // Auth functions
  const loginUser = (user, authToken) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('feastora_user', JSON.stringify(user));
    localStorage.setItem('feastora_token', authToken);
    setIsAuthOpen(false);
    addToast(`Welcome back, ${user.fullName}!`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('feastora_user');
    localStorage.removeItem('feastora_token');
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    addToast("Signed out successfully", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        token,
        loginUser,
        logoutUser,
        backendStatus,
        selectedCity,
        setSelectedCity,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        customizingDish,
        setCustomizingDish,
        currentView,
        setCurrentView,
        selectedRestaurantId,
        setSelectedRestaurantId,
        toasts,
        addToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
