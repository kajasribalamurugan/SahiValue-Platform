import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PlusCircle, Leaf } from 'lucide-react';

export const PriceBoardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { materials, setDraftMaterial } = useApp();
  const { t, getTranslatedMaterialName, getTranslatedMaterialDesc } = useLanguage();

  const handleSelectMaterial = (id: string) => {
    setDraftMaterial(id);
    navigate('/collector/declared-weight');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-900">{t('priceBoard.title')}</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t('priceBoard.liveBadge')}
          </span>
        </div>
        <p className="text-xs text-slate-500">{t('priceBoard.subtitle')}</p>
      </div>

      <div className="space-y-2.5">
        {materials.map((m) => (
          <div
            key={m.id}
            onClick={() => handleSelectMaterial(m.id)}
            className="fintech-card p-3.5 cursor-pointer hover:border-emerald-500 transition-all space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-xs">{getTranslatedMaterialName(m.id, m.name)}</h2>
                <p className="text-[11px] text-slate-500">{m.category}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-extrabold text-emerald-700 text-sm">₹{m.pricePerKg}</span>
                <span className="text-xs text-slate-500 font-normal"> / {t('common.kg')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-snug">{getTranslatedMaterialDesc(m.id, m.description)}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                {m.co2SavedPerKg} {t('material.co2Saved')}
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                {t('priceBoard.sellBtn')} &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/collector/add-ewaste')}
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors mt-3"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{t('home.addBatchBtn')}</span>
      </button>
    </div>
  );
};

