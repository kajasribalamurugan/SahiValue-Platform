import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const RecyclerTransactionsScreen: React.FC = () => {
  const { totalEarnings, totalVerifiedWeight, lots } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const completedLots = lots.filter((l) => l.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('recyclerTransactions.title')}</h1>
          <p className="text-xs text-slate-500">{t('recyclerTransactions.sub')}</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
          {t('earnings.auditedBadge')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">{t('recyclerTransactions.totalPayouts')}</span>
          <p className="text-2xl font-black text-slate-900">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700">{t('recyclerTransactions.upiReleased')}</span>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">{t('recyclerTransactions.totalScrap')}</span>
          <p className="text-2xl font-black text-slate-900">{totalVerifiedWeight.toFixed(1)} {t('common.kg')}</p>
          <span className="text-[11px] text-slate-500">{t('recyclerTransactions.audited')}</span>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">{t('recyclerTransactions.settledCount')}</span>
          <p className="text-2xl font-black text-slate-900">{completedLots.length} {t('earnings.records')}</p>
          <span className="text-[11px] text-slate-500">{t('home.allSettled')}</span>
        </div>
      </div>

      <div className="fintech-card p-5 overflow-x-auto">
        <h2 className="text-sm font-bold text-slate-900 mb-3">{t('recyclerTransactions.logTitle')}</h2>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
              <th className="py-2.5 font-semibold">{t('recyclerLots.thLotId')}</th>
              <th className="py-2.5 font-semibold">{t('recyclerLots.thMaterial')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thDeclared')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thVerified')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thAmount')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerTransactions.thUtr')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {completedLots.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 text-xs">
                  {t('recyclerTransactions.noTransactions')}
                </td>
              </tr>
            ) : (
              completedLots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">{lot.id}</td>
                  <td className="py-3 font-medium text-slate-800">
                    {getTranslatedMaterialName(lot.material.id, lot.material.name)}
                  </td>
                  <td className="py-3 text-right font-bold text-amber-800">{lot.declaredWeight} {t('common.kg')}</td>
                  <td className="py-3 text-right font-bold text-emerald-700">{lot.verifiedWeight} {t('common.kg')}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900">
                    ₹{(lot.finalPayout || lot.estimatedPayout).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-mono text-[11px] text-slate-500">
                    {lot.utrNumber || 'UPI/20260922/9812401'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

