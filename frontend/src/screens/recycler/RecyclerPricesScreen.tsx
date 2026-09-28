import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const RecyclerPricesScreen: React.FC = () => {
  const { materials } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('recyclerPrices.title')}</h1>
          <p className="text-xs text-slate-500">{t('recyclerPrices.sub')}</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
          {t('recyclerPrices.bonusActive')}
        </span>
      </div>

      <div className="fintech-card p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">{t('recyclerPrices.activeRates')}</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 font-semibold">{t('recyclerPrices.thCategory')}</th>
                <th className="py-2.5 font-semibold text-right">{t('recyclerPrices.thBenchmark')}</th>
                <th className="py-2.5 font-semibold text-right">{t('recyclerPrices.thHubRate')}</th>
                <th className="py-2.5 font-semibold text-center">{t('recyclerPrices.thStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((m) => {
                const hubRate = Math.round(m.pricePerKg * 1.05);
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      {getTranslatedMaterialName(m.id, m.name)}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-600">₹{m.pricePerKg}/{t('common.kg')}</td>
                    <td className="py-3 text-right font-bold text-emerald-700">₹{hubRate}/{t('common.kg')}</td>
                    <td className="py-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {t('recyclerPrices.accepted')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

