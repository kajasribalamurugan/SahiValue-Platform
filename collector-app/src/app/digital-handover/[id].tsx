import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { BilingualText } from '../../components/BilingualText';
import { ShieldCheck, Scale, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react-native';

export default function DigitalHandoverScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { getLotById, completeHandover } = useApp();

  const lot = getLotById(id as string);

  const [verifiedWeight, setVerifiedWeight] = useState<number>(
    lot?.declaredWeight || 10
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
  const isCompleted = lot.status === 'COMPLETED';

  // CRITICAL BUSINESS RULE:
  // Final payment MUST ALWAYS be calculated using Verified Weight * Material Rate!
  const calculatedFinalPayout = Math.round(verifiedWeight * lot.material.pricePerKg);

  const weightDifference = verifiedWeight - lot.declaredWeight;

  const handleConfirmHandover = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updated = completeHandover(lot.id, verifiedWeight);
      setIsSubmitting(false);
      if (updated) {
        router.push(`/digital-receipt/${lot.id}` as any);
      }
    }, 400);
  };

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('handover.stationTitle')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Station Banner Header */}
        <View style={styles.stationCard}>
          <View style={styles.stationHeaderRow}>
            <View style={styles.stationTag}>
              <ShieldCheck size={14} color="#b45309" />
              <Text style={styles.stationTagText}>{t('handover.stationTitle')}</Text>
            </View>
            <StatusBadge status={lot.status} />
          </View>

          <Text style={styles.stationTitle}>
            {t('handover.stationSubtitle')} {lot.id}
          </Text>

          <View style={styles.recNameContainer}>
            <Text style={styles.recFacilityLabel}>{t('handover.recyclerFacility')}</Text>
            <BilingualText
              officialName={lot.recycler.officialName || lot.recycler.name}
              localHi={lot.recycler.displayName?.hi}
              localMr={lot.recycler.displayName?.mr}
              primaryStyle={styles.recPrimary}
              secondaryStyle={styles.recSecondary}
            />
          </View>
        </View>

        {/* Serious Financial Audit Component: Declared vs Verified Weight */}
        <View style={styles.auditCard}>
          <View style={styles.auditHeader}>
            <Scale size={16} color="#059669" />
            <Text style={styles.auditTitle}>{t('handover.auditTitle')}</Text>
          </View>

          <View style={styles.weightGrid}>
            <View style={styles.weightBoxDeclared}>
              <Text style={styles.wLabel}>{t('handover.collectorDeclared')}</Text>
              <Text style={styles.wValDeclared}>{lot.declaredWeight} kg</Text>
              <Text style={styles.wNote}>{t('handover.initialEstimate')}</Text>
            </View>

            <View style={styles.weightBoxVerified}>
              <Text style={styles.wLabelVerified}>{t('handover.recyclerVerified')}</Text>
              <Text style={styles.wValVerified}>{verifiedWeight} kg</Text>
              <Text style={styles.wNoteVerified}>{t('handover.digitalScaleMeasurement')}</Text>
            </View>
          </View>

          {/* Live Weight Stepper/Input */}
          {!isCompleted && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>{t('handover.enterScaleReading')}</Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.scaleInput}
                  keyboardType="numeric"
                  value={verifiedWeight.toString()}
                  onChangeText={(val) => setVerifiedWeight(parseFloat(val) || 0.1)}
                />
                <Text style={styles.kgUnit}>kg</Text>
              </View>

              {/* Quick Presets */}
              <Text style={styles.presetHeading}>{t('handover.quickPreset')}</Text>
              <View style={styles.presetsRow}>
                {[
                  { label: `${t('handover.exactPreset')} (20 kg)`, val: 20 },
                  { label: `${t('handover.verifiedPreset')} (10 kg)`, val: 10 },
                  { label: `${t('handover.verifiedPreset')} (15 kg)`, val: 15 },
                ].map((p) => (
                  <Pressable
                    key={p.label}
                    style={[styles.presetPill, verifiedWeight === p.val && styles.presetPillActive]}
                    onPress={() => setVerifiedWeight(p.val)}
                  >
                    <Text style={[styles.presetText, verifiedWeight === p.val && styles.presetTextActive]}>
                      {p.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Discrepancy Callout */}
          {weightDifference !== 0 && (
            <View style={styles.discrepancyBox}>
              {weightDifference < 0 ? (
                <>
                  <TrendingDown size={18} color="#b45309" style={{ marginRight: 8 }} />
                  <Text style={styles.discrepancyTextLess}>{t('handover.weightLess')}</Text>
                </>
              ) : (
                <>
                  <Sparkles size={18} color="#059669" style={{ marginRight: 8 }} />
                  <Text style={styles.discrepancyTextMore}>{t('handover.weightMore')}</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Final Settlement Summary Box */}
        <View style={styles.settlementCard}>
          <View style={styles.settlementHeaderRow}>
            <Text style={styles.settlementTitle}>{t('handover.settlementHeader')}</Text>
            <Text style={styles.settlementAuditTag}>{t('handover.settlementAudit')}</Text>
          </View>

          <View style={styles.settlementDetailsBox}>
            <View style={styles.sRow}>
              <Text style={styles.sLabel}>{t('handover.benchmarkRate')}</Text>
              <Text style={styles.sVal}>₹{lot.material.pricePerKg} / kg</Text>
            </View>

            <View style={styles.sRow}>
              <Text style={styles.sLabel}>{t('handover.verifiedPhysicalWeight')}</Text>
              <Text style={styles.sValVerified}>{verifiedWeight} kg</Text>
            </View>

            {lot.recycler.rateBonusPercent > 0 && (
              <View style={styles.sRow}>
                <Text style={styles.sLabel}>{t('handover.bonusApplied')}</Text>
                <Text style={styles.sValBonus}>+{lot.recycler.rateBonusPercent}% Bonus</Text>
              </View>
            )}

            <View style={styles.sDivider} />

            <View style={styles.finalAmountRow}>
              <Text style={styles.finalLabel}>{t('handover.finalSettlementAmount')}</Text>
              <Text style={styles.finalAmountText}>
                ₹{calculatedFinalPayout.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <Text style={styles.italicNotice}>{t('handover.italicNotice')}</Text>
        </View>

        {/* Action Button */}
        {!isCompleted ? (
          <Pressable
            style={[styles.confirmBtn, isSubmitting && styles.disabledBtn]}
            onPress={handleConfirmHandover}
            disabled={isSubmitting}
          >
            <CheckCircle2 size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.confirmBtnText}>
              {isSubmitting ? t('handover.processing') : `${t('handover.confirmBtn')} (₹${calculatedFinalPayout.toLocaleString('en-IN')})`}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.viewSettlementBtn}
            onPress={() => router.push(`/digital-receipt/${lot.id}` as any)}
          >
            <Text style={styles.viewSettlementBtnText}>{t('handover.viewSettlementBtn')}</Text>
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
  stationCard: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  stationHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  stationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    flexShrink: 1,
  },
  stationTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  stationTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  recNameContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fef3c7',
  },
  recFacilityLabel: {
    fontSize: 10,
    color: '#92400e',
    fontWeight: '600',
  },
  recPrimary: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  recSecondary: {
    fontSize: 11,
    color: '#64748b',
  },

  auditCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  auditHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  auditTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  weightGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  weightBoxDeclared: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  wLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  wValDeclared: {
    fontSize: 20,
    fontWeight: '900',
    color: '#b45309',
    marginVertical: 2,
  },
  wNote: {
    fontSize: 10,
    color: '#94a3b8',
  },
  weightBoxVerified: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  wLabelVerified: {
    fontSize: 10,
    color: '#065f46',
    fontWeight: '600',
  },
  wValVerified: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 2,
  },
  wNoteVerified: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },

  inputSection: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
  },
  scaleInput: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    minWidth: 80,
  },
  kgUnit: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748b',
    marginLeft: 4,
  },
  presetHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  presetsRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  presetPillActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  presetTextActive: {
    color: '#ffffff',
  },

  discrepancyBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 12,
  },
  discrepancyTextLess: {
    fontSize: 11,
    color: '#92400e',
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  discrepancyTextMore: {
    fontSize: 11,
    color: '#047857',
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },

  settlementCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    marginBottom: 20,
  },
  settlementHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 8,
  },
  settlementTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    flex: 1,
    flexShrink: 1,
  },
  settlementAuditTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    flexShrink: 0,
  },

  settlementDetailsBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  sLabel: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    flexShrink: 1,
  },
  sVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  sValVerified: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },
  sValBonus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  sDivider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 8,
  },
  finalAmountRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  finalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    flexShrink: 1,
  },
  finalAmountText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#b45309',
  },
  italicNotice: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
  },

  confirmBtn: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  viewSettlementBtn: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSettlementBtnText: {
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
