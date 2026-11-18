import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, loginUser, addToast, setCurrentView } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'register') {
        const res = await api.register(fullName, email, phone, password);
        loginUser(res.data.user, res.data.token || res.data.sessionId);
        addToast(res.message || "Registration successful!");
      } else {
        // Login (Customer or Admin)
        const res = await api.login(email, password);
        loginUser(res.data.user, res.data.token || res.data.sessionId);
        addToast(res.message || "Welcome back!");
        if (res.data.user && res.data.user.roleName === 'ADMIN') {
          setCurrentView('admin');
        }
      }
    } catch (err) {
      addToast(err.message || "Authentication error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@feastora.com');
      setPassword('Admin@Feastora2026');
      setAuthMode('admin');
    } else {
      setEmail('rahul.sharma@example.com');
      setPassword('Password@123');
      setAuthMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8">

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-white">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {authMode === 'register' ? 'Join FEASTORA' : authMode === 'admin' ? 'Admin Portal Login' : 'Welcome to FEASTORA'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Every Craving Has a Destination.</p>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'register' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Account
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              authMode === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Demo Credentials Fill Buttons */}
        <div className="p-4 bg-orange-50/50 border-b border-orange-100/60 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-orange-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Quick Demo:</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-1 bg-white hover:bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Customer (Rahul)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Admin Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {authMode === 'admin' && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Admin logins are protected with BCrypt password verification and automated security audit email alerts dispatched to configured admin recipient.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : authMode === 'register' ? 'Create Account' : authMode === 'admin' ? 'Login as Administrator' : 'Sign In to FEASTORA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
