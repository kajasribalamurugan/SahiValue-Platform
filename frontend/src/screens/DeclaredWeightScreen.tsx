import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Scale, ArrowRight, AlertTriangle, IndianRupee, Plus, Minus } from 'lucide-react';

export const DeclaredWeightScreen: React.FC = () => {
  const navigate = useNavigate();
  const { materials, draftLot, setDraftWeight } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const selectedMaterial = materials.find((m) => m.id === draftLot.materialId) || materials[0];
  const [weight, setWeight] = useState<number>(draftLot.declaredWeight || 10);

  const handleWeightChange = (newVal: number) => {
    const valid = Math.max(1, Math.min(1000, newVal));
    setWeight(valid);
    setDraftWeight(valid);
  };

  const addWeight = (delta: number) => {
    handleWeightChange(weight + delta);
  };

  const estimatedValue = Math.round(weight * selectedMaterial.pricePerKg);

  const handleNext = () => {
    setDraftWeight(weight);
    navigate('/collector/sahi-estimate');
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Step Header */}
      <div className="space-y-1 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="text-emerald-700 uppercase tracking-wider font-bold">{t('weight.step')}</span>
          <span>{t('weight.stepHeader')}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">{t('weight.title')}</h1>
        <p className="text-xs text-slate-600">{t('weight.subtitle')}</p>
      </div>

      {/* Selected Material Card */}
      <div className="fintech-card p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 block">{t('weight.selectedMat')}</span>
          <span className="font-bold text-slate-900 text-xs">{getTranslatedMaterialName(selectedMaterial.id, selectedMaterial.name)}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">{t('weight.ratePerKg')}</span>
          <span className="font-bold text-emerald-700 text-xs">₹{selectedMaterial.pricePerKg}/{t('common.kg')}</span>
        </div>
      </div>

      {/* Weight Input Box */}
      <div className="fintech-card p-5 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold">
          <Scale className="w-4 h-4 text-emerald-600" />
          <span>{t('weight.declaredLabel')}</span>
        </div>

        {/* Weight Stepper */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => addWeight(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center border border-slate-200"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="relative">
            <input
              type="number"
              min="1"
              max="1000"
              value={weight}
              onChange={(e) => handleWeightChange(parseInt(e.target.value) || 1)}
              className="w-32 py-2 bg-white border-2 border-emerald-600 rounded-xl text-center text-3xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
            <span className="absolute right-3 bottom-3 text-xs font-bold text-slate-400">{t('common.kg')}</span>
          </div>

          <button
            type="button"
            onClick={() => addWeight(1)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center border border-slate-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {[1, 5, 10, 20, 50, 100].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleWeightChange(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                weight === preset
                  ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {preset} {t('common.kg')}
            </button>
          ))}
        </div>

        {/* Base Valuation */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">{t('weight.estimatedBase')}</span>
          <div className="flex items-center gap-0.5 font-extrabold text-emerald-700 text-base">
            <IndianRupee className="w-4 h-4" />
            <span>{estimatedValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Mandatory Business Rule */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('weight.ruleTitle')}</span>
        </div>
        <p className="text-amber-900/90 text-[11px] leading-relaxed">{t('weight.ruleDesc')}</p>
      </div>

      {/* Estimate Button */}
      <button
        onClick={handleNext}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>{t('weight.estimateBtn')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

