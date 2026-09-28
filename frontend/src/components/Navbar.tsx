import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Recycle, Bell, Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole } = useApp();
  const { t } = useLanguage();

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-10 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Recycle className="w-4 h-4 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">SAHI VALUE</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal hidden sm:block">Verified E-Waste Recycler Network</p>
          </div>
        </div>
      </div>

      {/* Center Search Bar (Desktop) */}
      <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 text-xs">
        <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          readOnly
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <LanguageSelector />

        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold">
            <User className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden md:inline">
            {activeRole === 'recycler' ? 'Recycler Hub' : 'Collector'}
          </span>
        </div>
      </div>
    </header>
  );
};

