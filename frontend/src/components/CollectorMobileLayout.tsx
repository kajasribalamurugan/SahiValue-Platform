import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Home, 
  PlusCircle, 
  PackageCheck, 
  Wallet, 
  User, 
  Recycle, 
  Bell, 
  ArrowLeft,
  Building2
} from 'lucide-react';

interface CollectorMobileLayoutProps {
  children: React.ReactNode;
}

export const CollectorMobileLayout: React.FC<CollectorMobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const isHome = location.pathname === '/collector' || location.pathname === '/collector/home';

  const navItems = [
    { label: t('nav.home'), path: '/collector/home', icon: Home },
    { label: t('nav.myLots'), path: '/collector/my-lots', icon: PackageCheck },
    { label: t('nav.addEWaste'), path: '/collector/add-ewaste', icon: PlusCircle, isCenterAction: true },
    { label: t('nav.earnings'), path: '/collector/earnings', icon: Wallet },
    { label: t('nav.profile'), path: '/collector/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-6 sm:px-4 font-sans text-slate-900">
      {/* Top Portal Switch Bar */}
      <div className="w-full max-w-[400px] mb-2 px-2 flex items-center justify-between text-xs text-slate-600">
        <span className="font-medium text-slate-500">Collector Portal</span>
        <button
          onClick={() => navigate('/recycler/home')}
          className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('nav.switchToRecycler')} &rarr;</span>
        </button>
      </div>

      {/* Realistic Smartphone Frame (approx 390px wide x 844px high) */}
      <div className="w-full max-w-[400px] bg-white sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl flex flex-col min-h-screen sm:min-h-[820px] sm:max-h-[880px] overflow-hidden relative border-b sm:border-b-[8px]">
        
        {/* Smartphone Speaker Notch Simulation */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-xl z-50"></div>

        {/* Collector Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-3.5 py-3 sm:pt-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/collector/home')}>
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Recycle className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">SAHI VALUE</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Multilingual Selector */}
            <LanguageSelector compact={true} />

            <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 relative" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600"></span>
            </button>
          </div>
        </header>

        {/* Collector Main Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 bg-slate-50">
          {children}
        </main>

        {/* Collector Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/collector/home' && isHome);

            if (item.isCenterAction) {
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-center -mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-12 h-12 shadow-md shadow-emerald-600/30 transition-transform active:scale-95 shrink-0"
                  aria-label={t('nav.addEWaste')}
                >
                  <PlusCircle className="w-7 h-7 stroke-[2.2]" />
                </button>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-lg text-[10px] font-medium transition-colors max-w-[72px] text-center ${
                  isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
