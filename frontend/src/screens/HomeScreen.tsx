import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  PlusCircle, 
  ChevronRight, 
  ArrowUpRight
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { totalEarnings, totalVerifiedWeight, completedLotsCount, lots, materials } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const pendingLot = lots.find((l) => l.status === 'PENDING_HANDOVER');
  const completedLots = lots.filter((l) => l.status === 'COMPLETED');

  return (
    <div className="space-y-4">
      {/* Top Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">{t('home.greeting')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('home.subtitle')}</p>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="fintech-card p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('home.totalEarnings')}</span>
          <div className="text-lg font-extrabold text-slate-900">
            ₹{(totalEarnings || 12450).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12.4% {t('home.thisMonth')}
          </span>
        </div>

        <div className="fintech-card p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('home.activeLots')}</span>
          <div className="text-lg font-extrabold text-slate-900">
            {pendingLot ? '01' : '00'}
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {pendingLot ? t('home.awaitingHandover') : t('home.allSettled')}
          </span>
        </div>

        <div className="fintech-card p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('home.verifiedRecycled')}</span>
          <div className="text-lg font-extrabold text-slate-900">
            {(totalVerifiedWeight || 48.5).toFixed(1)} <span className="text-xs font-normal text-slate-500">{t('common.kg')}</span>
          </div>
          <span className="text-[10px] text-slate-500 block">{t('home.thisMonth')}</span>
        </div>

        <div className="fintech-card p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('home.completedLots')}</span>
          <div className="text-lg font-extrabold text-slate-900">
            {completedLotsCount || 18}
          </div>
          <span className="text-[10px] text-slate-500 block">{t('home.handoverReceipts')}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => navigate('/collector/add-ewaste')}
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{t('home.addBatchBtn')}</span>
      </button>

      {/* Active Lot Section */}
      {pendingLot && (
        <div className="fintech-card p-3.5 space-y-2.5 border-amber-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500 uppercase">{t('home.activeLotHeader')}</span>
              <span className="font-mono font-bold text-slate-900">{pendingLot.id}</span>
            </div>
            <StatusBadge status={pendingLot.status} />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('material.selectedCat')}</span>
              <span className="font-bold text-slate-900">{getTranslatedMaterialName(pendingLot.material.id, pendingLot.material.name)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('home.declaredWeight')}</span>
              <span className="font-bold text-amber-800">{pendingLot.declaredWeight} {t('common.kg')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('home.estimatedValuation')}</span>
              <span className="font-bold text-slate-900">₹{pendingLot.estimatedPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-1 pt-1 text-[10px]">
            <p className="font-semibold text-slate-500 uppercase">{t('home.lotProgress')}</p>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px] mb-0.5">✓</div>
                <span className="font-semibold text-emerald-800 text-[9px]">{t('home.created')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px] mb-0.5">✓</div>
                <span className="font-semibold text-emerald-800 text-[9px]">{t('home.selected')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[9px] mb-0.5 animate-pulse">3</div>
                <span className="font-semibold text-amber-800 text-[9px]">{t('home.queue')}</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[9px] mb-0.5">4</div>
                <span className="text-slate-500 text-[9px]">{t('home.paid')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigate(`/collector/lot-details/${pendingLot.id}`)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors text-center"
            >
              {t('home.viewDetails')}
            </button>
            <button
              onClick={() => navigate(`/collector/handover/${pendingLot.id}`)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1 shadow-2xs"
            >
              <span>{t('home.digitalHandover')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Price Board Preview */}
      <div className="fintech-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">{t('home.todayRates')}</h2>
          <button
            onClick={() => navigate('/collector/price-board')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {t('home.viewDirectory')} &rarr;
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          {materials.slice(0, 4).map((m) => (
            <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium text-slate-800 truncate pr-2">{getTranslatedMaterialName(m.id, m.name).split('(')[0]}</span>
              <span className="font-bold text-slate-900 shrink-0">₹{m.pricePerKg}/{t('common.kg')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Receipts List */}
      <div className="fintech-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">{t('home.recentReceipts')}</h2>
          <button
            onClick={() => navigate('/collector/earnings')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {t('home.allReceipts')} &rarr;
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          {completedLots.length === 0 ? (
            <p className="text-slate-400 py-2 text-center text-xs">{t('home.noReceipts')}</p>
          ) : (
            completedLots.slice(0, 2).map((lot) => (
              <div key={lot.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-mono font-bold text-slate-900 block">{lot.id}</span>
                  <span className="text-[11px] text-slate-500">{getTranslatedMaterialName(lot.material.id, lot.material.name)} • {lot.verifiedWeight} {t('common.kg')}</span>
                </div>
                <span className="font-extrabold text-emerald-700 text-sm">₹{lot.finalPayout?.toLocaleString('en-IN')}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

