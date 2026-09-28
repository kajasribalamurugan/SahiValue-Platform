import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Recycle, 
  ArrowRight, 
  Scale, 
  CheckCircle2
} from 'lucide-react';

export const AddEWasteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="fintech-card p-5 bg-gradient-to-r from-emerald-50 via-white to-slate-50 border-emerald-200 space-y-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
          <Recycle className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h1 className="text-lg font-bold text-slate-900">{t('add.title')}</h1>
        <p className="text-xs text-slate-600 leading-relaxed">{t('add.subtitle')}</p>
      </div>

      {/* 3 Step Process Card */}
      <div className="fintech-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('add.processTitle')}</h2>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
              1
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">{t('add.step1Title')}</p>
              <p className="text-slate-500 text-[11px]">{t('add.step1Desc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
              2
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">{t('add.step2Title')}</p>
              <p className="text-slate-500 text-[11px]">{t('add.step2Desc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
              3
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">{t('add.step3Title')}</p>
              <p className="text-slate-500 text-[11px]">{t('add.step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Business Rule Highlight */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <Scale className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('add.ruleTitle')}</span>
        </div>
        <p className="text-amber-900/90 text-[11px] leading-relaxed">{t('add.ruleDesc')}</p>
      </div>

      {/* Benefits Checklist */}
      <div className="fintech-card p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('add.check1')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('add.check2')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('add.check3')}</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={() => navigate('/collector/material-category')}
        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>{t('add.selectBtn')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
