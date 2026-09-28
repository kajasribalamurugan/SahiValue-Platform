import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  IndianRupee, 
  Scale, 
  Receipt, 
  ShieldCheck, 
  PlusCircle
} from 'lucide-react';

export const EarningsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { totalEarnings, totalVerifiedWeight, completedLotsCount, lots } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const completedLots = lots.filter((l) => l.status === 'COMPLETED');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Metrics Header */}
      <div className="fintech-card p-5 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('earnings.passbookTitle')}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t('earnings.auditedBadge')}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-500 font-medium block">{t('earnings.lifetimeEarnings')}</span>
          <div className="flex items-baseline gap-0.5 pt-0.5">
            <span className="text-xl font-extrabold text-amber-700">₹</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{totalEarnings.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 flex items-center gap-1 mb-0.5 text-[11px]">
              <Scale className="w-3.5 h-3.5 text-emerald-600" /> {t('earnings.totalRecycled')}
            </span>
            <p className="text-base font-bold text-slate-900">{totalVerifiedWeight.toFixed(1)} {t('common.kg')}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 flex items-center gap-1 mb-0.5 text-[11px]">
              <Receipt className="w-3.5 h-3.5 text-emerald-600" /> {t('earnings.receiptsCount')}
            </span>
            <p className="text-base font-bold text-slate-900">{completedLotsCount}</p>
          </div>
        </div>
      </div>

      {/* Receipts Table / List */}
      <div className="fintech-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase">{t('earnings.receiptsHeader')}</h2>
          <span className="text-[11px] text-slate-500">{completedLots.length} {t('earnings.records')}</span>
        </div>

        {completedLots.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <Receipt className="w-7 h-7 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">{t('earnings.noReceiptsYet')}</p>
            <button
              onClick={() => navigate('/collector/add-ewaste')}
              className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg text-xs"
            >
              {t('earnings.addFirstBatch')}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {completedLots.map((lot) => (
              <div
                key={lot.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">{t('earnings.transId')}</span>
                    <span className="font-mono font-bold text-slate-900">{lot.id}</span>
                  </div>
                  <StatusBadge status={lot.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-slate-500">{t('material.selectedCat')} <strong className="text-slate-900">{getTranslatedMaterialName(lot.material.id, lot.material.name)}</strong></p>
                    <p className="text-slate-500">{t('lot.recyclerHub')} <span className="text-slate-800">{lot.recycler.name}</span></p>
                  </div>

                  {/* Audit Box */}
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="text-slate-400 block">{t('lot.declaredWeight')}</span>
                      <span className="font-bold text-amber-800">{lot.declaredWeight} {t('common.kg')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t('lot.verifiedWeight')}</span>
                      <span className="font-bold text-emerald-700">{lot.verifiedWeight} {t('common.kg')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-slate-400 text-[10px] font-mono">{t('earnings.utr')} {lot.utrNumber || 'UPI/20260922/9812401'}</span>
                  <div className="flex items-center gap-0.5 font-extrabold text-amber-700 text-sm">
                    <span>₹</span>
                    <span>{lot.finalPayout?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Batch CTA */}
      <button
        onClick={() => navigate('/collector/add-ewaste')}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{t('earnings.addAnotherBatch')}</span>
      </button>
    </div>
  );
};

