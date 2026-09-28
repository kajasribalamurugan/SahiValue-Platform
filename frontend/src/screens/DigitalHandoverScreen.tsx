import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  TrendingDown,
  Sparkles
} from 'lucide-react';

export const DigitalHandoverScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLotById, completeHandover } = useApp();
  const { t } = useLanguage();

  const lot = getLotById(id || '');

  const [verifiedWeight, setVerifiedWeight] = useState<number>(lot?.declaredWeight || 10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!lot) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500 text-xs">{t('recycler.noIncoming')}</p>
        <button onClick={() => navigate('/collector/home')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">
          {t('common.back')}
        </button>
      </div>
    );
  }

  const isCompleted = lot.status === 'COMPLETED';

  // CRITICAL BUSINESS RULE:
  // Final transaction payment MUST ALWAYS be calculated using Verified Weight physically weighed by recycler
  const basePrice = lot.material.pricePerKg * verifiedWeight;
  const bonusMultiplier = 1 + (lot.recycler.rateBonusPercent || 0) / 100;
  const calculatedFinalPayout = Math.round(basePrice * bonusMultiplier);

  const weightDifference = verifiedWeight - lot.declaredWeight;

  const handleConfirmHandover = () => {
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#D4A72C'],
      });
    } catch (e) {
      // Ignore if confetti not supported
    }

    setTimeout(() => {
      const updated = completeHandover(lot.id, verifiedWeight);
      setIsSubmitting(false);
      if (updated) {
        navigate('/collector/earnings');
      }
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Recycler Header Station */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            {t('handover.stationTitle')}
          </span>
          <StatusBadge status={lot.status} />
        </div>
        <h1 className="text-base font-bold text-slate-900">{t('handover.stationSubtitle')} {lot.id}</h1>
        <p className="text-xs text-amber-900/80">{t('handover.recyclerFacility')} <strong>{lot.recycler.name}</strong></p>
      </div>

      {/* Serious Financial Audit Component: Declared vs Verified Weight */}
      <div className="fintech-card p-5 space-y-4 bg-white border-slate-200">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            {t('handover.auditTitle')}
          </h2>
          <span className="text-[11px] font-semibold text-slate-500">{t('handover.physicalMeasurement')}</span>
        </div>

        {/* Audit Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">{t('handover.collectorDeclared')}</span>
            <div className="text-xl font-extrabold text-slate-800">{lot.declaredWeight} <span className="text-xs font-normal text-slate-500">{t('common.kg')}</span></div>
            <p className="text-[10px] text-slate-500">{t('handover.initialEstimate')}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-300 space-y-1">
            <span className="text-xs text-emerald-900 font-medium block">{t('handover.recyclerVerified')}</span>
            <div className="text-xl font-extrabold text-emerald-700">{verifiedWeight} <span className="text-xs font-normal text-emerald-900">{t('common.kg')}</span></div>
            <p className="text-[10px] text-emerald-800 font-medium">{t('handover.digitalScaleMeasurement')}</p>
          </div>
        </div>

        {/* Live Weight Stepper/Input */}
        {!isCompleted && (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-800 block">
              {t('handover.enterScaleReading')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="1000"
                value={verifiedWeight}
                onChange={(e) => setVerifiedWeight(parseFloat(e.target.value) || 0.1)}
                className="flex-1 py-2 px-3 bg-white border-2 border-emerald-600 rounded-xl text-2xl font-extrabold text-slate-900 focus:outline-none text-center"
              />
              <span className="text-xs font-bold text-slate-500">{t('common.kg')}</span>
            </div>

            {/* Quick Demo Test Presets */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10px] text-slate-400 self-center font-medium">{t('handover.quickPreset')}</span>
              {[
                { label: `${t('handover.exactPreset')} (20 ${t('common.kg')})`, val: 20 },
                { label: `${t('handover.verifiedPreset')} (10 ${t('common.kg')})`, val: 10 },
                { label: `${t('handover.verifiedPreset')} (15 ${t('common.kg')})`, val: 15 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setVerifiedWeight(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    verifiedWeight === p.val
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Discrepancy Callout */}
        {weightDifference !== 0 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2">
            {weightDifference < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-700 leading-snug">{t('handover.weightLess')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 leading-snug">{t('handover.weightMore')}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Final Settlement Summary Box */}
      <div className="fintech-card p-5 border-emerald-200 space-y-3 bg-white">
        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-2 font-semibold">
          <span>{t('handover.settlementHeader')}</span>
          <span className="text-emerald-700 font-bold">{t('handover.settlementAudit')}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs border border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>{t('handover.benchmarkRate')}</span>
            <span className="font-semibold text-slate-900">₹{lot.material.pricePerKg} / {t('common.kg')}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>{t('handover.verifiedPhysicalWeight')}</span>
            <span className="font-extrabold text-emerald-700">{verifiedWeight} {t('common.kg')}</span>
          </div>

          {lot.recycler.rateBonusPercent > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{t('handover.bonusApplied')}</span>
              <span className="font-semibold text-amber-700">{t('recyclerPrices.accepted')}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-900 border-t border-slate-200 pt-2 text-xs font-bold">
            <span>{t('handover.finalSettlementAmount')}</span>
            <div className="flex items-center gap-0.5 text-xl font-extrabold text-amber-700">
              <span>₹</span>
              <span>{calculatedFinalPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center italic">
          {t('handover.italicNotice')}
        </p>
      </div>

      {/* Action Button */}
      {!isCompleted ? (
        <button
          onClick={handleConfirmHandover}
          disabled={isSubmitting}
          className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <span>{t('handover.processing')}</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('handover.confirmBtn')} (₹{calculatedFinalPayout.toLocaleString('en-IN')})</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
          <p className="text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t('handover.completedTitle')}
          </p>
          <button
            onClick={() => navigate('/collector/earnings')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
          >
            {t('handover.viewSettlementBtn')}
          </button>
        </div>
      )}
    </div>
  );
};

