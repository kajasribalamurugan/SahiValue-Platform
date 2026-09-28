import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SafetyScreen: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-base font-bold text-slate-900">{t('safety.title')}</h1>
        <p className="text-xs text-slate-500">{t('safety.subtitle')}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t('safety.hazardTitle')}</span>
        </div>
        <p className="text-amber-900/90 text-[11px] leading-relaxed">{t('safety.hazardDesc')}</p>
      </div>

      <div className="fintech-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('safety.guidelines')}</h2>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t('safety.gearTitle')}</p>
              <p className="text-[11px] text-slate-500">{t('safety.gearDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t('safety.intactTitle')}</p>
              <p className="text-[11px] text-slate-500">{t('safety.intactDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t('safety.noBurnTitle')}</p>
              <p className="text-[11px] text-slate-500">{t('safety.noBurnDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fintech-card p-3.5 bg-emerald-50/50 border-emerald-200 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{t('safety.cpcbTitle')}</span>
        </div>
        <p className="text-emerald-900/90 text-[11px] leading-relaxed">{t('safety.cpcbDesc')}</p>
      </div>
    </div>
  );
};
