import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  PackageCheck, 
  ChevronRight, 
  PlusCircle
} from 'lucide-react';

export const MyLotsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lots } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const filteredLots = lots.filter((l) => {
    if (filter === 'PENDING') return l.status === 'PENDING_HANDOVER';
    if (filter === 'COMPLETED') return l.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">{t('myLots.title')}</h1>
          <p className="text-xs text-slate-500">{t('myLots.subtitle')}</p>
        </div>
        <button
          onClick={() => navigate('/collector/add-ewaste')}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t('myLots.newLotBtn')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1 rounded-md transition-all ${
            filter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {t('myLots.allLots')} ({lots.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-1 rounded-md transition-all ${
            filter === 'PENDING' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {t('myLots.pendingFilter')} ({lots.filter((l) => l.status === 'PENDING_HANDOVER').length})
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`flex-1 py-1 rounded-md transition-all ${
            filter === 'COMPLETED' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {t('myLots.completedFilter')} ({lots.filter((l) => l.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Lots List */}
      <div className="space-y-2.5">
        {filteredLots.length === 0 ? (
          <div className="fintech-card p-6 text-center space-y-3">
            <PackageCheck className="w-7 h-7 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">{t('myLots.noLotsFound')}</p>
            <button
              onClick={() => navigate('/collector/add-ewaste')}
              className="px-3.5 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg text-xs"
            >
              {t('myLots.newLotBtn')}
            </button>
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div key={lot.id} className="fintech-card p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{lot.id}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(lot.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StatusBadge status={lot.status} />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('material.selectedCat')}</span>
                  <span className="font-semibold text-slate-900">{getTranslatedMaterialName(lot.material.id, lot.material.name)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">{t('lot.declaredWeight')}</span>
                  <span className="font-bold text-amber-800">{lot.declaredWeight} {t('common.kg')}</span>
                </div>

                {lot.status === 'COMPLETED' ? (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('lot.verifiedWeight')}</span>
                    <span className="font-bold text-emerald-700">{lot.verifiedWeight} {t('common.kg')}</span>
                  </div>
                ) : null}

                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <span className="text-slate-500">
                    {lot.status === 'COMPLETED' ? t('lot.settlementPayout') : t('lot.estimatedValuation')}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    ₹{(lot.finalPayout || lot.estimatedPayout).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-0.5">
                <button
                  onClick={() => navigate(`/collector/lot-details/${lot.id}`)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors text-center"
                >
                  {t('home.viewDetails')}
                </button>
                {lot.status === 'PENDING_HANDOVER' && (
                  <button
                    onClick={() => navigate(`/collector/handover/${lot.id}`)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>{t('home.digitalHandover')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

