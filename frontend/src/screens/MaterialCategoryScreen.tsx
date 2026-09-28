import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Cpu, 
  Zap, 
  BatteryCharging, 
  Monitor, 
  Tv, 
  HardDrive, 
  CheckCircle2, 
  ArrowRight,
  Leaf
} from 'lucide-react';

export const MaterialCategoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { materials, draftLot, setDraftMaterial } = useApp();
  const { t, getTranslatedMaterialName, getTranslatedMaterialDesc } = useLanguage();

  const selectedMaterial = materials.find((m) => m.id === (draftLot.materialId || materials[0].id)) || materials[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-emerald-600" />;
      case 'Monitor': return <Monitor className="w-5 h-5 text-blue-600" />;
      case 'Tv': return <Tv className="w-5 h-5 text-indigo-600" />;
      default: return <HardDrive className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleSelect = (id: string) => {
    setDraftMaterial(id);
  };

  const handleNext = () => {
    navigate('/collector/declared-weight');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="text-emerald-700 uppercase tracking-wider font-bold">{t('material.step')}</span>
          <span>{t('material.stepHeader')}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">{t('material.title')}</h1>
        <p className="text-xs text-slate-600">{t('material.subtitle')}</p>
      </div>

      {/* Material Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {materials.map((m) => {
          const isSelected = selectedMaterial.id === m.id;
          const translatedName = getTranslatedMaterialName(m.id, m.name);
          const translatedDesc = getTranslatedMaterialDesc(m.id, m.description);

          return (
            <div
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`fintech-card p-3.5 cursor-pointer transition-all duration-150 border text-left relative ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-lg border shrink-0 ${isSelected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  {getIcon(m.iconName)}
                </div>

                <div className="flex-1 pr-4 space-y-1">
                  <h2 className="font-bold text-slate-900 text-xs leading-snug">{translatedName}</h2>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{translatedDesc}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      ₹{m.pricePerKg} / {t('common.kg')}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      {m.co2SavedPerKg} {t('material.co2Saved')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Material Summary Card */}
      <div className="fintech-card p-3.5 bg-slate-50 border-slate-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">{t('material.selectedCat')}</span>
          <p className="font-bold text-slate-900 text-xs">{getTranslatedMaterialName(selectedMaterial.id, selectedMaterial.name)}</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500 block text-[11px]">{t('material.benchmarkRate')}</span>
          <p className="font-extrabold text-emerald-700 text-sm">₹{selectedMaterial.pricePerKg}/{t('common.kg')}</p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleNext}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>{t('material.proceedWeightBtn')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

