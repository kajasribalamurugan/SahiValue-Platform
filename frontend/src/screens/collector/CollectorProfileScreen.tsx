import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { 
  MapPin, 
  ShieldCheck, 
  Wallet, 
  ChevronRight,
  Building2
} from 'lucide-react';

export const CollectorProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { totalEarnings, totalVerifiedWeight, completedLotsCount } = useApp();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="fintech-card p-4 space-y-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-base">
            KC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-900 text-sm">{t('profile.title')}</h1>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t('profile.verified')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{t('profile.zone')}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">{t('profile.earnings')}</span>
            <span className="font-bold text-slate-900 text-xs">₹{totalEarnings.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">{t('profile.recycled')}</span>
            <span className="font-bold text-slate-900 text-xs">{totalVerifiedWeight.toFixed(1)} kg</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">{t('profile.batches')}</span>
            <span className="font-bold text-slate-900 text-xs">{completedLotsCount}</span>
          </div>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="fintech-card p-1.5 space-y-1 text-xs">
        <button
          onClick={() => navigate('/collector/earnings')}
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-900">{t('profile.upiTitle')}</p>
              <p className="text-[10px] text-slate-500">{t('profile.upiId')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => navigate('/collector/safety')}
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-900">{t('profile.safetyTitle')}</p>
              <p className="text-[10px] text-slate-500">{t('profile.safetyDesc')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <span className="font-semibold text-slate-900">{t('profile.langTitle')}</span>
          <LanguageSelector compact={false} />
        </div>
      </div>

      {/* Portal Switch Button */}
      <div className="fintech-card p-3.5 space-y-1.5">
        <p className="text-xs font-semibold text-slate-900">{t('profile.switchRecyclerTitle')}</p>
        <p className="text-[10px] text-slate-500">{t('profile.switchRecyclerDesc')}</p>
        <button
          onClick={() => navigate('/recycler/home')}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs flex items-center justify-center gap-2 transition-colors mt-1"
        >
          <Building2 className="w-4 h-4" />
          <span>{t('profile.openPortalBtn')}</span>
        </button>
      </div>
    </div>
  );
};
