import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Home, 
  PlusCircle, 
  TrendingUp, 
  PackageCheck, 
  Wallet, 
  ShieldCheck, 
  User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, lots } = useApp();
  const { t } = useLanguage();

  const pendingLot = lots.find((l) => l.status === 'PENDING_HANDOVER');

  const navItems = [
    { label: t('nav.home'), path: '/', icon: Home },
    { label: t('nav.addEWaste'), path: '/add-ewaste', icon: PlusCircle, isPrimary: true },
    { label: t('nav.priceBoard'), path: '/material-category', icon: TrendingUp },
    { 
      label: activeRole === 'recycler' ? t('handover.stationTitle') : t('nav.myLots'), 
      path: pendingLot ? `/lot-details/${pendingLot.id}` : '/add-ewaste', 
      icon: PackageCheck,
      badge: pendingLot ? `1 ${t('home.activeLotHeader').replace(':', '')}` : undefined
    },
    { label: t('nav.earnings'), path: '/earnings', icon: Wallet },
  ];

  const secondaryItems = [
    { label: t('nav.safety'), path: '/safety', icon: ShieldCheck },
    { label: t('nav.profile'), path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-41px)] p-4 shrink-0">
      <div className="space-y-6 flex-1">
        {/* Quick Collector Status */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            KC
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">Delhi Collector</p>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t('profile.verified')} Partner
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/add-ewaste')}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('nav.addEWaste')}</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">{t('recyclerNav.opsMenu')}</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border-r-2 border-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Links */}
        <div className="space-y-1 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">{t('profile.safetyTitle')}</p>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-600">SAHI VALUE v1.0</p>
        <p>Fair Recycler Infrastructure</p>
      </div>
    </aside>
  );
};

