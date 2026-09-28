import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useRecyclerAuth } from '../context/RecyclerAuthContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Building2, 
  LayoutDashboard, 
  PackageCheck, 
  Scale, 
  Receipt, 
  TrendingUp, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  Search,
  LogOut
} from 'lucide-react';

interface RecyclerDesktopLayoutProps {
  children: React.ReactNode;
}

export const RecyclerDesktopLayout: React.FC<RecyclerDesktopLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useRecyclerAuth();

  const handleLogout = () => {
    logout();
    navigate('/recycler/login');
  };

  const navItems = [
    { label: t('recyclerNav.overview'), path: '/recycler/home', icon: LayoutDashboard },
    { label: t('recyclerNav.availableLots'), path: '/recycler/lots', icon: PackageCheck },
    { label: t('recyclerNav.scaleQueue'), path: '/recycler/verify-queue', icon: Scale },
    { label: t('recyclerNav.settlements'), path: '/recycler/transactions', icon: Receipt },
    { label: t('recyclerNav.priceSettings'), path: '/recycler/prices', icon: TrendingUp },
    { label: t('recyclerNav.facilityProfile'), path: '/recycler/profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/recycler/home')}>
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900">SAHI VALUE</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  RECYCLER PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {user ? `${user.name} (${user.phone})` : 'EcoRecycle Green Tech Solutions (CPCB Licensed)'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-72 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={t('common.searchRecyclerPlaceholder')}
            className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            readOnly
          />
        </div>

        {/* Right Controls & Language Selector */}
        <div className="flex items-center gap-3">
          <LanguageSelector compact={false} />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 shrink-0 min-h-[calc(100vh-61px)]">
          <div className="space-y-6 flex-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
              <span className="text-slate-500 block">Recycler Facility #4</span>
              <p className="font-bold text-slate-900">Delhi Industrial Hub</p>
              <p className="text-[11px] text-slate-500">CPCB Lic: DEL/EW/2026/894</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">{t('recyclerNav.opsMenu')}</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 font-bold border-r-2 border-amber-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-700">SAHI VALUE Recycler Portal</p>
            <p>CPCB Verified Industrial Infrastructure</p>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
