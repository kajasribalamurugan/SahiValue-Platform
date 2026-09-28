import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Leaf, 
  ArrowRight, 
  Award, 
  Info
} from 'lucide-react';

export const SahiValueEstimateScreen: React.FC = () => {
  const navigate = useNavigate();
  const { materials, draftLot } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const selectedMaterial = materials.find((m) => m.id === draftLot.materialId) || materials[0];
  const declaredWeight = draftLot.declaredWeight || 10;

  const baseEstimate = Math.round(declaredWeight * selectedMaterial.pricePerKg);
  const maxEstimate = Math.round(baseEstimate * 1.05);

  const totalCo2Saved = (declaredWeight * selectedMaterial.co2SavedPerKg).toFixed(1);

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Step Header */}
      <div className="space-y-1 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="text-emerald-700 uppercase tracking-wider font-bold">{t('estimate.step')}</span>
          <span>{t('estimate.stepHeader')}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">{t('estimate.title')}</h1>
        <p className="text-xs text-slate-600">{t('estimate.subtitle')}</p>
      </div>

      {/* Main Valuation Display Card */}
      <div className="fintech-card p-5 space-y-3 border-emerald-200 bg-white shadow-xs">
        <div className="space-y-1 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('estimate.label')}</span>
          <div className="flex items-center justify-center gap-1 font-extrabold text-2xl text-slate-900 pt-1">
            <span className="text-amber-600">₹</span>
            <span className="text-amber-700">{baseEstimate.toLocaleString('en-IN')}</span>
            <span className="text-sm font-normal text-slate-500"> - ₹{maxEstimate.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium pt-0.5">
            {t('estimate.calculatedFor')} {declaredWeight} {t('common.kg')} {getTranslatedMaterialName(selectedMaterial.id, selectedMaterial.name)} @ ₹{selectedMaterial.pricePerKg}/{t('common.kg')}
          </p>
        </div>

        {/* Breakdown Table */}
        <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs border border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>{t('material.selectedCat')}</span>
            <span className="font-semibold text-slate-900">{getTranslatedMaterialName(selectedMaterial.id, selectedMaterial.name)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t('lot.declaredWeight')}</span>
            <span className="font-bold text-amber-800">{declaredWeight} {t('common.kg')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t('material.benchmarkRate')}</span>
            <span className="font-semibold text-emerald-700">₹{selectedMaterial.pricePerKg} / {t('common.kg')}</span>
          </div>
          <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1.5">
            <span>{t('estimate.recyclerBonus')}</span>
            <span className="font-semibold text-amber-700">{t('estimate.upToBonus')}</span>
          </div>
        </div>
      </div>

      {/* Environmental & Metal Recovery Impact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="fintech-card p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <Leaf className="w-4 h-4" />
            <span>{t('estimate.co2Offset')}</span>
          </div>
          <p className="text-base font-bold text-slate-900">{totalCo2Saved} <span className="text-xs font-normal text-slate-500">{t('common.kg')}</span></p>
          <p className="text-[10px] text-slate-500">{t('estimate.preventsPollution')}</p>
        </div>

        <div className="fintech-card p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
            <Award className="w-4 h-4 text-blue-600" />
            <span>{t('estimate.smeltingRecovery')}</span>
          </div>
          <p className="text-base font-bold text-slate-900">{selectedMaterial.metalRecoveryRate}</p>
          <p className="text-[10px] text-slate-500">{t('estimate.highEff')}</p>
        </div>
      </div>

      {/* Verification Rule Reminder */}
      <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>{t('estimate.settlementNoticeTitle')}</span>
        </div>
        <p className="text-[11px] leading-relaxed">{t('estimate.settlementNoticeDesc')}</p>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/collector/recyclers')}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>{t('estimate.selectRecyclerBtn')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

