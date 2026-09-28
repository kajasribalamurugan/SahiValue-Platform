import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Scale } from 'lucide-react';

export const RecyclerLotsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lots } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('recyclerLots.title')}</h1>
          <p className="text-xs text-slate-500">{t('recyclerLots.sub')}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
          {lots.length} {t('recyclerLots.totalBatches')}
        </span>
      </div>

      <div className="fintech-card p-5 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
              <th className="py-2.5 font-semibold">{t('recyclerLots.thLotId')}</th>
              <th className="py-2.5 font-semibold">{t('recyclerLots.thMaterial')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thDeclared')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thVerified')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thAmount')}</th>
              <th className="py-2.5 font-semibold text-center">{t('recyclerLots.thStatus')}</th>
              <th className="py-2.5 font-semibold text-right">{t('recyclerLots.thAction')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lots.map((lot) => (
              <tr key={lot.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-mono font-bold text-slate-900">{lot.id}</td>
                <td className="py-3 font-medium text-slate-800">
                  {getTranslatedMaterialName(lot.material.id, lot.material.name)}
                </td>
                <td className="py-3 text-right font-bold text-amber-800">{lot.declaredWeight} {t('common.kg')}</td>
                <td className="py-3 text-right font-bold text-emerald-700">
                  {lot.verifiedWeight ? `${lot.verifiedWeight} ${t('common.kg')}` : '-'}
                </td>
                <td className="py-3 text-right font-extrabold text-slate-900">
                  ₹{(lot.finalPayout || lot.estimatedPayout).toLocaleString('en-IN')}
                </td>
                <td className="py-3 text-center">
                  <StatusBadge status={lot.status} />
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => navigate(`/recycler/verify/${lot.id}`)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{lot.status === 'COMPLETED' ? t('recyclerLots.view') : t('recyclerLots.weigh')}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

