import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { authService, BackendLot, UserProfile } from '../../services/auth';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Scale, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  PackageCheck, 
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const RecyclerHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, getTranslatedMaterialName } = useLanguage();

  const [lots, setLots] = useState<BackendLot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollector, setSelectedCollector] = useState<UserProfile | null>(null);

  const fetchLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getMyLots();
      setLots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assigned lots from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  // Extract unique collectors from assigned backend lots
  const collectorsMap = new Map<number, { profile: UserProfile; lotsCount: number; pendingCount: number }>();
  lots.forEach((lot) => {
    if (lot.collector) {
      const c = lot.collector;
      const existing = collectorsMap.get(c.id) || { profile: c, lotsCount: 0, pendingCount: 0 };
      existing.lotsCount += 1;
      if (lot.status !== 'COMPLETED' && lot.status !== 'CANCELLED') {
        existing.pendingCount += 1;
      }
      collectorsMap.set(c.id, existing);
    }
  });

  const collectorEntries = Array.from(collectorsMap.values());
  const handleAcceptLot = async (lotId: string) => {
    try {
      setLoading(true);
      await authService.acceptLot(lotId);
      await fetchLots();
    } catch (err: any) {
      setError(err.message || 'Failed to accept lot.');
      setLoading(false);
    }
  };

  const handleRejectLot = async (lotId: string) => {
    try {
      setLoading(true);
      await authService.rejectLot(lotId);
      await fetchLots();
    } catch (err: any) {
      setError(err.message || 'Failed to reject lot.');
      setLoading(false);
    }
  };

  const pendingAcceptanceLots = lots.filter((l) => l.status === 'PENDING_ACCEPTANCE' || l.status === 'CREATED');
  const activeHandoverLots = lots.filter((l) => l.status === 'ACCEPTED' || l.status === 'HANDOVER_PENDING' || l.status === 'HANDOVER_IN_PROGRESS' || l.status === 'VERIFIED');
  const pendingQueueLots = activeHandoverLots;
  const totalVerifiedWeight = lots.filter(l => l.verified_weight).reduce((sum, l) => sum + (l.verified_weight || 0), 0);
  const totalPayout = lots.filter(l => l.final_amount).reduce((sum, l) => sum + (l.final_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            {t('recycler.title')}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{t('recycler.facilityName')}</h1>
          <p className="text-xs text-slate-600">{t('recycler.facilitySub')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLots}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {pendingQueueLots.length > 0 && (
            <button
              onClick={() => navigate(`/recycler/verify/${pendingQueueLots[0].lot_id}`)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>Weigh Next Lot ({pendingQueueLots[0].lot_id}) &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Available Collector Lots (Pending Acceptance) Section */}
      <div className="fintech-card p-5 space-y-4 border-2 border-amber-400 bg-amber-50/20">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-amber-600" />
              Available Collector Lots (Awaiting Recycler Acceptance)
            </h2>
            <p className="text-xs text-slate-600">Review incoming e-waste lot submissions from collectors and Accept or Reject before handover</p>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg">
            {pendingAcceptanceLots.length} Pending
          </span>
        </div>

        {pendingAcceptanceLots.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-medium">
            {loading ? 'Checking backend for pending lots...' : 'No pending collector lots awaiting acceptance.'}
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAcceptanceLots.map((lot) => (
              <div
                key={lot.id}
                className="p-4 rounded-xl bg-white border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{lot.lot_id}</span>
                    <StatusBadge status={lot.status} />
                  </div>
                  <p className="text-slate-700">Collector: <strong className="text-slate-900">{lot.collector?.name || 'Collector User'}</strong> ({lot.collector?.phone || 'No Phone'})</p>
                  <p className="text-slate-700">Material: <strong className="text-slate-900">{lot.material?.name || 'Electronic Waste'}</strong></p>
                  <p className="text-slate-700">Declared Weight: <strong className="text-amber-800">{lot.declared_weight} kg</strong> | Rate: <strong>₹{lot.rate}/kg</strong> | Est. Value: <strong className="text-emerald-700">₹{lot.estimated_value}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptLot(lot.lot_id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Lot</span>
                  </button>

                  <button
                    onClick={() => handleRejectLot(lot.lot_id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recycler KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">Verification Queue</span>
          <p className="text-2xl font-black text-slate-900">{pendingQueueLots.length} Batches</p>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting Scale Verification</span>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">Total Verified Payout</span>
          <p className="text-2xl font-black text-slate-900">₹{totalPayout.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Verified Weight × Material Rate</span>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">Verified E-Waste</span>
          <p className="text-2xl font-black text-slate-900">{totalVerifiedWeight.toFixed(1)} kg</p>
          <span className="text-[11px] text-slate-500">Physical Scale Certified</span>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <span className="text-xs text-slate-500 font-semibold block uppercase">Active Collectors</span>
          <p className="text-2xl font-black text-slate-900">{collectorEntries.length} Collectors</p>
          <span className="text-[11px] text-slate-500">PostgreSQL Verified Network</span>
        </div>
      </div>

      {/* Real Collector Selection Section */}
      <div className="fintech-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Registered Collectors Network
            </h2>
            <p className="text-xs text-slate-500">Click a collector to view their contact info, location, and assigned e-waste lots</p>
          </div>
        </div>

        {collectorEntries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            {loading ? 'Loading Collectors from PostgreSQL...' : 'No collectors assigned to this recycler yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collectorEntries.map(({ profile: c, lotsCount, pendingCount }) => {
              const isSelected = selectedCollector?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCollector(isSelected ? null : c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-sm">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {pendingCount} Pending
                    </span>
                  </div>

                  {c.location && (
                    <div className="mt-3 text-xs text-slate-600 flex items-center gap-1 pt-2 border-t border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{c.location}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Collector Detail Drawer / View */}
      {selectedCollector && (
        <div className="fintech-card p-5 space-y-4 border-2 border-emerald-500 bg-emerald-50/20">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Collector Details</span>
              <h3 className="text-lg font-extrabold text-slate-900">{selectedCollector.name}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedCollector.phone}</span>
                {selectedCollector.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedCollector.location}</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setSelectedCollector(null)}
              className="text-xs font-bold px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Close Details
            </button>
          </div>

          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Lots from {selectedCollector.name}</h4>

          <div className="space-y-3">
            {lots.filter(l => l.collector_id === selectedCollector.id).map(lot => (
              <div key={lot.id} className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{lot.lot_id}</span>
                    <StatusBadge status={lot.status} />
                  </div>
                  <p className="text-slate-700">Declared Weight: <strong className="text-slate-900">{lot.declared_weight} kg</strong> (Collector Estimate)</p>
                  <p className="text-slate-700">Verified Weight: <strong className="text-emerald-700">{lot.verified_weight ? `${lot.verified_weight} kg` : 'Pending Scale'}</strong></p>
                  <p className="text-slate-700">Rate: <strong className="text-slate-900">₹{lot.rate}/kg</strong> | Final Payout: <strong className="text-amber-800">₹{lot.final_amount || lot.estimated_value}</strong></p>
                </div>

                {lot.status !== 'COMPLETED' && (
                  <button
                    onClick={() => navigate(`/recycler/verify/${lot.lot_id}`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Enter Verified Weight &rarr;</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Queue Section */}
      <div className="fintech-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('recycler.incomingQueueTitle')}</h2>
            <p className="text-xs text-slate-500">{t('recycler.incomingQueueSub')}</p>
          </div>
          <button
            onClick={() => navigate('/recycler/lots')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {t('recycler.viewAllLots')}
          </button>
        </div>

        {pendingQueueLots.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            {t('recycler.noIncoming')}
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueueLots.map((lot) => (
              <div
                key={lot.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{lot.lot_id}</span>
                    <StatusBadge status={lot.status} />
                  </div>
                  <p className="text-slate-700">Material: <strong className="text-slate-900">{lot.material?.name || 'Motherboards / PCBs'}</strong></p>
                  <p className="text-slate-700">Declared Weight: <strong className="text-amber-800">{lot.declared_weight} kg</strong> (Estimate)</p>
                  <p className="text-slate-700">Benchmark Rate: <span className="font-semibold text-emerald-700">₹{lot.rate}/kg</span></p>
                </div>

                <button
                  onClick={() => navigate(`/recycler/verify/${lot.lot_id}`)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-4 h-4" />
                  <span>{t('recycler.enterScaleBtn')} &rarr;</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
