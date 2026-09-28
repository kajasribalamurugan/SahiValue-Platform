import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Sparkles, Leaf, Cpu, ShieldCheck, ArrowRight } from 'lucide-react-native';

export default function SahiValueEstimateScreen() {
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { materials, draftLot } = useApp();

  const selectedMaterial =
    materials.find((m) => m.id === draftLot.materialId) || materials[0];
  const matBilingual = getBilingualMaterial(selectedMaterial.id, selectedMaterial.name);

  const declaredWeight = draftLot.declaredWeight || 10;
  const baseValuation = declaredWeight * selectedMaterial.pricePerKg;
  const maxBonusValuation = Math.round(baseValuation * 1.05);

  const totalCo2Saved = (selectedMaterial.co2SavedPerKg * declaredWeight).toFixed(1);

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('estimate.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepBadge}>{t('estimate.step')}</Text>
          <Text style={styles.stepTitle}>{t('estimate.stepHeader')}</Text>
        </View>

        <Text style={styles.title}>{t('estimate.title')}</Text>
        <Text style={styles.subtitle}>{t('estimate.subtitle')}</Text>

        {/* Main Valuation Display Card */}
        <View style={styles.valuationCard}>
          <View style={styles.valHeaderRow}>
            <Text style={styles.valLabel}>{t('estimate.label')}</Text>
            <View style={styles.bonusTag}>
              <Sparkles size={12} color="#b45309" />
              <Text style={styles.bonusTagText}>{t('estimate.upToBonus')}</Text>
            </View>
          </View>

          {/* Big Amount */}
          <Text style={styles.mainAmount}>
            ₹{baseValuation.toLocaleString('en-IN')} - ₹{maxBonusValuation.toLocaleString('en-IN')}
          </Text>

          <Text style={styles.calcNote}>
            {t('estimate.calculatedFor')} {declaredWeight} kg {matBilingual.primary} @ ₹{selectedMaterial.pricePerKg}/kg
          </Text>
        </View>

        {/* Environmental & Smelting Recovery Metrics */}
        <View style={styles.ecoCard}>
          <View style={styles.ecoRow}>
            <View style={styles.ecoIconBox}>
              <Leaf size={20} color="#047857" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecoVal}>{totalCo2Saved} kg {t('estimate.co2Offset')}</Text>
              <Text style={styles.ecoSub}>{t('estimate.preventsPollution')}</Text>
            </View>
          </View>

          <View style={styles.ecoDivider} />

          <View style={styles.ecoRow}>
            <View style={[styles.ecoIconBox, { backgroundColor: '#eff6ff' }]}>
              <Cpu size={20} color="#2563eb" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecoVal}>{selectedMaterial.metalRecoveryRate}</Text>
              <Text style={styles.ecoSub}>{t('estimate.highEff')}</Text>
            </View>
          </View>
        </View>

        {/* Final Settlement Notice Highlight Box */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <ShieldCheck size={18} color="#047857" />
            <Text style={styles.noticeTitle}>{t('estimate.settlementNoticeTitle')}</Text>
          </View>
          <Text style={styles.noticeDesc}>{t('estimate.settlementNoticeDesc')}</Text>
        </View>

        {/* Primary Action Button */}
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/recycler-list')}
        >
          <Text style={styles.primaryBtnText}>{t('estimate.selectRecyclerBtn')}</Text>
          <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
        </Pressable>
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
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },

  valuationCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  valHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  valLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    flex: 1,
    flexShrink: 1,
  },
  bonusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 4,
    flexShrink: 0,
  },
  bonusTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  mainAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#b45309',
    marginVertical: 4,
  },
  calcNote: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },

  ecoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  ecoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ecoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ecoVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  ecoSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  ecoDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  noticeCard: {
    width: '100%',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 20,
  },
  noticeHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46',
    flex: 1,
    flexShrink: 1,
  },
  noticeDesc: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },

  primaryBtn: {
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
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
