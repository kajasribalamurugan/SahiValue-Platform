import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Home, PlusCircle, TrendingUp, PackageCheck, Wallet } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lots } = useApp();
  const { t } = useLanguage();

  const pendingLot = lots.find((l) => l.status === 'PENDING_HANDOVER');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
          location.pathname === '/' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <Home className={`w-5 h-5 ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-400'}`} />
        <span>{t('nav.home')}</span>
      </button>

      <button
        onClick={() => navigate('/material-category')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
          location.pathname === '/material-category' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <TrendingUp className={`w-5 h-5 ${location.pathname === '/material-category' ? 'text-emerald-600' : 'text-slate-400'}`} />
        <span>{t('nav.priceBoard')}</span>
      </button>

      {/* Prominent Center Add Button */}
      <button
        onClick={() => navigate('/add-ewaste')}
        className="flex flex-col items-center justify-center -mt-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-12 h-12 shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
        aria-label={t('nav.addEWaste')}
      >
        <PlusCircle className="w-7 h-7 stroke-[2.2]" />
      </button>

      <button
        onClick={() => navigate(pendingLot ? `/lot-details/${pendingLot.id}` : '/add-ewaste')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors relative ${
          location.pathname.startsWith('/lot-details') || location.pathname.startsWith('/handover')
            ? 'text-emerald-700 font-semibold'
            : 'text-slate-500'
        }`}
      >
        <PackageCheck
          className={`w-5 h-5 ${
            location.pathname.startsWith('/lot-details') || location.pathname.startsWith('/handover')
              ? 'text-emerald-600'
              : 'text-slate-400'
          }`}
        />
        <span>{t('nav.myLots')}</span>
        {pendingLot && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        )}
      </button>

      <button
        onClick={() => navigate('/earnings')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
          location.pathname === '/earnings' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <Wallet className={`w-5 h-5 ${location.pathname === '/earnings' ? 'text-emerald-600' : 'text-slate-400'}`} />
        <span>{t('nav.earnings')}</span>
      </button>
    </div>
  );
};

