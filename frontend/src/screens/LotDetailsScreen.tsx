import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  QrCode, 
  ArrowRight, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const LotDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLotById } = useApp();
  const { t, getTranslatedMaterialName } = useLanguage();

  const lot = getLotById(id || '');

  if (!lot) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500 text-xs">{t('recycler.noIncoming')}</p>
        <button
          onClick={() => navigate('/collector/home')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const isCompleted = lot.status === 'COMPLETED';

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs text-slate-500 font-medium block">{t('lot.digitalLot')}</span>
          <h1 className="text-lg font-mono font-bold text-slate-900">{lot.id}</h1>
        </div>
        <StatusBadge status={lot.status} />
      </div>

      {/* QR Code Verification Card */}
      <div className="fintech-card p-5 text-center space-y-3 border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
          <QrCode className="w-4 h-4 text-emerald-600" />
          <span>{t('lot.scannablePass')}</span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-1">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <QRCodeSVG value={lot.qrCodeData} size={160} level="H" />
          </div>
        </div>

        {/* Verification PIN */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs max-w-xs mx-auto">
          <div className="flex items-center gap-2 text-slate-600">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>{t('lot.pinLabel')}</span>
          </div>
          <span className="font-mono font-extrabold text-amber-800 text-base tracking-widest">{lot.verificationPin}</span>
        </div>

        <p className="text-[11px] text-slate-500">
          {t('lot.pinNotice')}
        </p>
      </div>

      {/* Lot Specifications Table Card */}
      <div className="fintech-card p-4 space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('lot.specifications')}</h2>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">{t('lot.matCategory')}</span>
            <span className="font-bold text-slate-900">{getTranslatedMaterialName(lot.material.id, lot.material.name)}</span>
          </div>

          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">{t('lot.declaredWeight')}</span>
            <span className="font-bold text-amber-800">{lot.declaredWeight} {t('common.kg')}</span>
          </div>

          {isCompleted ? (
            <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-900 font-medium">{t('lot.verifiedWeight')}</span>
              <span className="font-extrabold text-emerald-700 text-sm">{lot.verifiedWeight} {t('common.kg')}</span>
            </div>
          ) : (
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">{t('lot.verifiedWeight')}</span>
              <span className="text-slate-400 italic">{t('lot.pendingWeighing')}</span>
            </div>
          )}

          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">{t('lot.recyclerHub')}</span>
            <span className="font-semibold text-slate-900">{lot.recycler.name}</span>
          </div>

          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">{isCompleted ? t('lot.settlementPayout') : t('lot.estimatedValuation')}</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{(isCompleted ? lot.finalPayout : lot.estimatedPayout)?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      {!isCompleted ? (
        <button
          onClick={() => navigate(`/collector/handover/${lot.id}`)}
          className="w-full py-3.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>{t('lot.proceedHandover')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => navigate('/collector/earnings')}
          className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('lot.viewReceipt')}</span>
        </button>
      )}
    </div>
  );
};

