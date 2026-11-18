import React from 'react';
import { useApp } from '../context/AppContext';
import { MascotLogo } from './MascotLogo';
import { ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView, setAuthMode, setIsAuthOpen, currentUser } = useApp();

  const handleAdminLink = () => {
    if (currentUser && currentUser.roleName === 'ADMIN') {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthMode('admin');
      setIsAuthOpen(true);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Column 1: Brand Mascot & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <MascotLogo size="md" showTagline={true} light={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              FEASTORA is South India’s premier food ordering ecosystem connecting foodies with historic tiffin rooms, iconic military hotels, and modern artisanal kitchens.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold pt-2">
              <MapPin className="w-4 h-4 shrink-0 text-orange-500" />
              <span>Bengaluru • Chennai • Coimbatore • Mysore • Madurai • Udupi</span>
            </div>
          </div>

          {/* Column 2: Popular Cuisines */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Signature Cuisines
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">South Indian Breakfast</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Kongu & Chettinad Specials</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Bangalore Benne Dosas</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Andhra Dum Biryanis</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Artisanal Burgers & Shakes</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Filter Kaapi & Fresh Juices</li>
            </ul>
          </div>

          {/* Column 3: Partner Cities */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Service Locations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Bengaluru (Indiranagar, Koramangala, Malleshwaram)</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Chennai (T. Nagar, Besant Nagar, Anna Nagar)</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Mysore (Nazarbad, Jayalakshmipuram)</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Udupi (Car Street, Manipal)</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Coimbatore & Erode</li>
            </ul>
          </div>

          {/* Column 4: Contact & Tech Architecture */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Enterprise Stack
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>Java 17/25 • JDBC • OOP</li>
              <li>Jakarta EE 10 Servlets</li>
              <li>Apache Tomcat 10.1+</li>
              <li>MySQL 8 Relational DB</li>
              <li>React.js • Tailwind CSS</li>
              <li>JavaMail SMTP Alerts</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Required Discreet Admin Link */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FEASTORA Inc. All rights reserved. Built with passion for authentic culinary heritage.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
              <span>in India</span>
            </span>

            {/* Discreet Admin Login Link per Section 9 */}
            <button
              onClick={handleAdminLink}
              className="group flex items-center gap-1 text-[11px] text-slate-500 hover:text-orange-400 font-medium transition-colors cursor-pointer"
              title="Restricted Staff & Admin Management Portal"
            >
              <ShieldCheck className="w-3 h-3 text-slate-600 group-hover:text-orange-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
