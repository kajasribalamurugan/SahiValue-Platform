import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { BilingualText } from '../../components/BilingualText';
import { QrCode, KeyRound, ArrowRight, CheckCircle2, Scale, Clock, RefreshCw, XCircle } from 'lucide-react-native';

export default function LotDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { getLotById, fetchLotFromBackend } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLotFromBackend(id as string);
      const interval = setInterval(() => {
        fetchLotFromBackend(id as string);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [id, fetchLotFromBackend]);

  const lot = getLotById(id as string);

  const handleManualRefresh = async () => {
    if (id && !isRefreshing) {
      setIsRefreshing(true);
      await fetchLotFromBackend(id as string);
      setIsRefreshing(false);
    }
  };

  if (!lot) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack />
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundText}>Lot not found.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>{t('common.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const matBilingual = getBilingualMaterial(lot.material.id, lot.material.name);
  const isCompleted = lot.status === 'COMPLETED' || lot.status === 'PAID';
  const isPendingAcceptance = lot.status === 'PENDING_ACCEPTANCE' || lot.status === 'CREATED';
  const isRejected = lot.status === 'REJECTED';
  const isAccepted = lot.status === 'ACCEPTED' || lot.status === 'AWAITING_HANDOVER' || lot.status === 'PENDING_HANDOVER' || lot.status === 'HANDOVER_IN_PROGRESS' || lot.status === 'VERIFIED';

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('lot.digitalLot')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Lot Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.headerTag}>{t('lot.digitalLot')}</Text>
              <Text style={styles.headerId}>{lot.id}</Text>
            </View>
            <StatusBadge status={lot.status} />
          </View>
        </View>

        {/* Status Callout Card */}
        {isPendingAcceptance && (
          <View style={styles.statusNoticeCardPending}>
            <View style={styles.statusNoticeHeader}>
              <Clock size={18} color="#b45309" />
              <Text style={styles.statusNoticeTitlePending}>Waiting for Recycler Acceptance</Text>
            </View>
            <Text style={styles.statusNoticeDescPending}>
              Your e-waste lot has been submitted to the recycler facility ({lot.recycler?.name || 'Recycler Facility'}). Please wait while they review and accept your lot.
            </Text>
            <Pressable style={styles.refreshBtn} onPress={handleManualRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#b45309" />
              ) : (
                <>
                  <RefreshCw size={14} color="#b45309" style={{ marginRight: 6 }} />
                  <Text style={styles.refreshBtnText}>Check Latest Status</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {isRejected && (
          <View style={styles.statusNoticeCardRejected}>
            <View style={styles.statusNoticeHeader}>
              <XCircle size={18} color="#be123c" />
              <Text style={styles.statusNoticeTitleRejected}>Lot Declined by Recycler</Text>
            </View>
            <Text style={styles.statusNoticeDescRejected}>
              The recycler facility was unable to accept this lot. You may create a new lot or select a different recycler facility.
            </Text>
          </View>
        )}

        {isAccepted && !isCompleted && (
          <View style={styles.statusNoticeCardAccepted}>
            <View style={styles.statusNoticeHeader}>
              <CheckCircle2 size={18} color="#1d4ed8" />
              <Text style={styles.statusNoticeTitleAccepted}>Lot Accepted by Recycler!</Text>
            </View>
            <Text style={styles.statusNoticeDescAccepted}>
              The recycler has accepted your lot submission. You may now proceed with physical scale weighing and handover.
            </Text>
          </View>
        )}

        {/* QR Code Pass Card */}
        <View style={styles.qrCard}>
          <View style={styles.scannableBadge}>
            <QrCode size={14} color="#047857" />
            <Text style={styles.scannableText}>{t('lot.scannablePass')}</Text>
          </View>

          {/* QR Code Graphic */}
          <View style={styles.qrWrapper}>
            <QRCode
              value={lot.qrCodeData}
              size={170}
              color="#0f172a"
              backgroundColor="#ffffff"
            />
          </View>

          {/* 4-Digit Verification PIN Box */}
          <View style={styles.pinBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <KeyRound size={16} color="#b45309" />
              <Text style={styles.pinLabel}>{t('lot.pinLabel')}</Text>
            </View>
            <Text style={styles.pinValue}>{lot.verificationPin}</Text>
          </View>

          <Text style={styles.pinNotice}>{t('lot.pinNotice')}</Text>
        </View>

        {/* Specifications Card */}
        <View style={styles.specsCard}>
          <Text style={styles.specsHeading}>{t('lot.specifications')}</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>{t('lot.matCategory')}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.specValPrimary}>{matBilingual.primary}</Text>
              {matBilingual.secondary && (
                <Text style={styles.specValSecondary}>{matBilingual.secondary}</Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>{t('lot.declaredWeight')}</Text>
            <Text style={styles.declaredVal}>{lot.declaredWeight} kg</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>{t('lot.verifiedWeight')}</Text>
            {isCompleted ? (
              <Text style={styles.verifiedVal}>{lot.verifiedWeight} kg</Text>
            ) : (
              <Text style={styles.pendingVal}>{t('lot.pendingWeighing')}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>{t('lot.recyclerHub')}</Text>
            <BilingualText
              officialName={lot.recycler.officialName || lot.recycler.name}
              localHi={lot.recycler.displayName?.hi}
              localMr={lot.recycler.displayName?.mr}
              primaryStyle={styles.recPrimary}
              secondaryStyle={styles.recSecondary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>
              {isCompleted ? t('lot.settlementPayout') : t('lot.estimatedValuation')}
            </Text>
            <Text style={styles.payoutVal}>
              ₹{(isCompleted ? lot.finalPayout : lot.estimatedPayout)?.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        {isAccepted && !isCompleted && (
          <Pressable
            style={styles.handoverBtn}
            onPress={() => router.push(`/digital-handover/${lot.id}` as any)}
          >
            <Scale size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.handoverBtnText}>{t('lot.proceedHandover')}</Text>
            <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          </Pressable>
        )}

        {isCompleted && (
          <Pressable
            style={styles.receiptBtn}
            onPress={() => router.push(`/digital-receipt/${lot.id}` as any)}
          >
            <CheckCircle2 size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.receiptBtnText}>{t('lot.viewReceipt')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  headerTitleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerTag: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  headerId: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },

  statusNoticeCardPending: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    marginBottom: 14,
  },
  statusNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusNoticeTitlePending: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400e',
  },
  statusNoticeDescPending: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
    marginBottom: 10,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    alignSelf: 'flex-start',
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
  },

  statusNoticeCardRejected: {
    width: '100%',
    backgroundColor: '#fff1f2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fecdd3',
    marginBottom: 14,
  },
  statusNoticeTitleRejected: {
    fontSize: 14,
    fontWeight: '800',
    color: '#be123c',
  },
  statusNoticeDescRejected: {
    fontSize: 12,
    color: '#9f1239',
    lineHeight: 18,
  },

  statusNoticeCardAccepted: {
    width: '100%',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    marginBottom: 14,
  },
  statusNoticeTitleAccepted: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  statusNoticeDescAccepted: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },

  qrCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  scannableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
    marginBottom: 16,
  },
  scannableText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 16,
  },
  pinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    width: '100%',
    marginBottom: 10,
  },
  pinLabel: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '700',
  },
  pinValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#b45309',
    letterSpacing: 3,
  },
  pinNotice: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },

  specsCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  specsHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  specRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  specLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
    flexShrink: 1,
  },
  specValPrimary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  specValSecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  declaredVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#b45309',
  },
  verifiedVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  pendingVal: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  recPrimary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'right',
  },
  recSecondary: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'right',
  },
  payoutVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },

  handoverBtn: {
    width: '100%',
    backgroundColor: '#b45309',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#b45309',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  handoverBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  receiptBtn: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  receiptBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  notFoundCard: {
    padding: 32,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
