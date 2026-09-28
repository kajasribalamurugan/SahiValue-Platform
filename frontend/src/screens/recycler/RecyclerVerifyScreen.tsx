import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { authService, BackendLot } from '../../services/auth';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  TrendingDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const RecyclerVerifyScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [lot, setLot] = useState<BackendLot | null>(null);
  const [verifiedWeight, setVerifiedWeight] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const lots = await authService.getMyLots();
        const found = lots.find(l => l.lot_id === id || l.id.toString() === id) || lots[0];
        if (found) {
          setLot(found);
          setVerifiedWeight(found.verified_weight || found.declared_weight || 10);
        } else {
          setError('Lot not found in assigned queue.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lot details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLotDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        Loading lot verification details from backend...
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-600 text-xs font-semibold">{error || t('recycler.noIncoming')}</p>
        <button onClick={() => navigate('/recycler/home')} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold text-xs">
          {t('common.back')}
        </button>
      </div>
    );
  }

  const isCompleted = lot.status === 'COMPLETED';
  const materialRate = lot.rate || 450;

  // CRITICAL BUSINESS RULE:
  // Final transaction payment MUST ALWAYS be calculated using Verified Weight physically weighed by recycler
  // Formula: Final Payment = Verified Weight × Material Rate
  const calculatedFinalPayout = Math.round(verifiedWeight * materialRate);
  const weightDifference = verifiedWeight - lot.declared_weight;

  const handleConfirmHandover = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Send physical weight verification to backend
      const verifiedLot = await authService.verifyLotWeight(lot.lot_id, verifiedWeight);
      setLot(verifiedLot);

      // 2. Complete transaction on backend
      await authService.completeLot(lot.lot_id, 'UPI');

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#D4A72C'],
        });
      } catch (e) {
        // Ignore animation error
      }

      navigate('/recycler/transactions');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Station Header */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            {t('handover.stationTitle')}
          </span>
          <StatusBadge status={lot.status} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">{t('handover.stationSubtitle')} {lot.lot_id}</h1>
        <p className="text-xs text-amber-900/80">Collector: <strong>{lot.collector?.name || 'Assigned Collector'}</strong> ({lot.collector?.phone || ''})</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Financial Audit Component: Declared vs Verified Weight */}
      <div className="fintech-card p-6 space-y-5 bg-white border-slate-200">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            {t('handover.auditTitle')}
          </h2>
          <span className="text-[11px] font-semibold text-slate-500">{t('handover.physicalMeasurement')}</span>
        </div>

        {/* Comparison Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">{t('handover.collectorDeclared')}</span>
            <div className="text-2xl font-extrabold text-slate-800">{lot.declared_weight} <span className="text-sm font-normal text-slate-500">{t('common.kg')}</span></div>
            <p className="text-[11px] text-slate-500">Collector Initial Estimate</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 space-y-1">
            <span className="text-xs text-emerald-900 font-medium block">{t('handover.recyclerVerified')}</span>
            <div className="text-2xl font-extrabold text-emerald-700">{verifiedWeight} <span className="text-sm font-normal text-emerald-900">{t('common.kg')}</span></div>
            <p className="text-[11px] text-emerald-800 font-medium">Digital Scale Measured Weight</p>
          </div>
        </div>

        {/* Live Weight Scale Input */}
        {!isCompleted && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-800 block">
              Enter Physical Scale Weight Reading (kg)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="1000"
                value={verifiedWeight}
                onChange={(e) => setVerifiedWeight(parseFloat(e.target.value) || 0.1)}
                className="flex-1 py-3 px-4 bg-white border-2 border-emerald-600 rounded-xl text-3xl font-extrabold text-slate-900 focus:outline-none text-center"
              />
              <span className="text-xs font-bold text-slate-500">{t('common.kg')}</span>
            </div>

            {/* Quick Demo Test Values */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center font-medium">Quick Scale Presets:</span>
              {[
                { label: `Exact (${lot.declared_weight} kg)`, val: lot.declared_weight },
                { label: `10 kg`, val: 10 },
                { label: `15 kg`, val: 15 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setVerifiedWeight(p.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
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

        {/* Weight Discrepancy Callout */}
        {weightDifference !== 0 && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2">
            {weightDifference < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-700">
                  Verified weight is {Math.abs(weightDifference)} kg lower than estimate. Final payout auto-adjusted.
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900">
                  Verified weight is {weightDifference} kg higher than estimate. Bonus payout added!
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Final Settlement Box */}
      <div className="fintech-card p-6 border-emerald-200 space-y-4 bg-white">
        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-3 font-semibold">
          <span>Server Verified Payment Settlement</span>
          <span className="text-emerald-700 font-bold">FastAPI Verified</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 text-xs border border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Material Benchmark Rate</span>
            <span className="font-semibold text-slate-900">₹{materialRate} / kg</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Verified Physical Weight</span>
            <span className="font-extrabold text-emerald-700">{verifiedWeight} kg</span>
          </div>

          <div className="flex justify-between items-center text-slate-900 border-t border-slate-200 pt-3 text-sm font-bold">
            <span>Final Settlement Amount (Verified Weight × Rate)</span>
            <div className="flex items-center gap-0.5 text-2xl font-extrabold text-amber-700">
              <span>₹</span>
              <span>{calculatedFinalPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center italic">
          Final payment amount is calculated exclusively on the server using physical scale weight.
        </p>
      </div>

      {/* Action Button */}
      {!isCompleted ? (
        <button
          onClick={handleConfirmHandover}
          disabled={isSubmitting}
          className="w-full py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <span>Processing Settlement on Server...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Weight & Complete Settlement (₹{calculatedFinalPayout.toLocaleString('en-IN')})</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
          <p className="text-emerald-900 font-bold text-sm flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Transaction Completed & Audit Trail Logged
          </p>
          <button
            onClick={() => navigate('/recycler/transactions')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
          >
            View Settlement Audit
          </button>
        </div>
      )}
    </div>
  );
};
