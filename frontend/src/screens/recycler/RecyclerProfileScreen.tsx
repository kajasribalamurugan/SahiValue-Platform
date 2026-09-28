import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, MapPin, Star, CheckCircle2 } from 'lucide-react';

export const RecyclerProfileScreen: React.FC = () => {
  const { t, getTranslatedMaterialName } = useLanguage();

  const acceptedMaterials = [
    { id: 'pcb', name: 'Printed Circuit Boards (PCBs)' },
    { id: 'copper', name: 'Heavy Copper Cables' },
    { id: 'battery', name: 'Lithium & Lead-Acid Batteries' },
    { id: 'mixed_it', name: 'Mixed IT Hardware & Laptops' },
    { id: 'monitors', name: 'CRT & LCD Displays' },
    { id: 'appliances', name: 'Home Appliance Scrap' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="fintech-card p-6 space-y-4 bg-white">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-lg">
              ER
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg">{t('recycler.facilityName')}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> {t('recyclerProfile.cpcbLicensed')}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('recyclerProfile.address')}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">{t('recyclerProfile.licenseNo')}</span>
            <span className="font-mono font-bold text-slate-900">DEL/EW/2026/894</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">{t('recyclerProfile.rating')}</span>
            <span className="font-bold text-amber-700 flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> 4.9 / 5.0 (342 {t('recyclerProfile.reviews')})
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">{t('recyclerProfile.multiplier')}</span>
            <span className="font-bold text-emerald-700">{t('recyclerPrices.bonusActive')}</span>
          </div>
        </div>
      </div>

      <div className="fintech-card p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('recyclerProfile.acceptedTitle')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {acceptedMaterials.map((cat) => (
            <div key={cat.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-[11px]">
                {getTranslatedMaterialName(cat.id, cat.name)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

