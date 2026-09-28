import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Info
} from 'lucide-react';

export const RecyclerListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { recyclers, draftLot, setDraftRecycler, createLotFromDraft } = useApp();
  const { t } = useLanguage();

  const selectedRecyclerId = draftLot.recyclerId || recyclers[0].id;

  const handleSelect = (id: string) => {
    setDraftRecycler(id);
  };

  const handleCreateLot = () => {
    const createdLot = createLotFromDraft();
    if (createdLot) {
      navigate(`/collector/lot-details/${createdLot.id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Step Header */}
      <div className="space-y-1 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="text-emerald-700 uppercase tracking-wider font-bold">{t('recyclerList.step')}</span>
          <span>{t('recyclerList.stepHeader')}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">{t('recyclerList.title')}</h1>
        <p className="text-xs text-slate-600">{t('recyclerList.subtitle')}</p>
      </div>

      {/* Clear Mock Data Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('recyclerList.disclaimerTitle')}</span>
        </div>
        <p className="text-amber-900/90 text-[11px] leading-relaxed">{t('recyclerList.disclaimerDesc')}</p>
      </div>

      {/* Recyclers List */}
      <div className="space-y-3">
        {recyclers.map((r) => {
          const isSelected = selectedRecyclerId === r.id;
          return (
            <div
              key={r.id}
              onClick={() => handleSelect(r.id)}
              className={`fintech-card p-3.5 cursor-pointer transition-all duration-150 border text-left relative ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3.5 right-3.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </div>
              )}

              <div className="space-y-1.5 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-slate-900 text-xs">{r.name}</h2>
                  {r.cpcbAuthorized && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" /> {t('recyclerList.cpcbVerified')}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{r.address}</span>
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {r.rating} <span className="text-slate-400 font-normal">({r.reviewsCount})</span>
                    </span>
                    <span className="text-slate-500">{r.distance}</span>
                  </div>

                  {r.rateBonusPercent > 0 ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      +{r.rateBonusPercent}% {t('recyclerList.rateBonus')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {t('recyclerList.standardRate')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleCreateLot}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>{t('recyclerList.createLotBtn')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
