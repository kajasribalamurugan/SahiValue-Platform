import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Scale, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react-native';

export default function DeclaredWeightScreen() {
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { materials, draftLot, setDraftWeight } = useApp();

  const selectedMaterial =
    materials.find((m) => m.id === draftLot.materialId) || materials[0];
  const matBilingual = getBilingualMaterial(selectedMaterial.id, selectedMaterial.name);

  const [weight, setWeight] = useState<number>(draftLot.declaredWeight || 10);

  const handleWeightChange = (newVal: number) => {
    const validVal = Math.max(1, Math.min(1000, newVal));
    setWeight(validVal);
    setDraftWeight(validVal);
  };

  const addWeight = (delta: number) => {
    handleWeightChange(weight + delta);
  };

  const handleProceed = () => {
    setDraftWeight(weight);
    router.push('/estimate');
  };

  const estimatedBaseValuation = weight * selectedMaterial.pricePerKg;

  const presets = [5, 10, 15, 20, 25, 50];

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('weight.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepBadge}>{t('weight.step')}</Text>
          <Text style={styles.stepTitle}>{t('weight.stepHeader')}</Text>
        </View>

        <Text style={styles.title}>{t('weight.title')}</Text>
        <Text style={styles.subtitle}>{t('weight.subtitle')}</Text>

        {/* Selected Material Card */}
        <View style={styles.matSummaryCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.matSummaryLabel}>{t('weight.selectedMat')}</Text>
            <Text style={styles.matSummaryPrimary}>{matBilingual.primary}</Text>
            {matBilingual.secondary && (
              <Text style={styles.matSummarySecondary}>{matBilingual.secondary}</Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.matSummaryLabel}>{t('weight.ratePerKg')}</Text>
            <Text style={styles.matSummaryRate}>₹{selectedMaterial.pricePerKg} / kg</Text>
          </View>
        </View>

        {/* Main Weight Input Card */}
        <View style={styles.weightCard}>
          <Text style={styles.weightLabel}>{t('weight.declaredLabel')}</Text>

          <View style={styles.stepperRow}>
            <Pressable style={styles.stepperBtn} onPress={() => addWeight(-1)}>
              <Minus size={24} color="#0f172a" />
            </Pressable>

            <View style={styles.weightInputBox}>
              <TextInput
                style={styles.weightInputText}
                keyboardType="numeric"
                value={weight.toString()}
                onChangeText={(val) => handleWeightChange(parseInt(val, 10) || 0)}
              />
              <Text style={styles.kgUnit}>kg</Text>
            </View>

            <Pressable style={styles.stepperBtn} onPress={() => addWeight(1)}>
              <Plus size={24} color="#0f172a" />
            </Pressable>
          </View>

          {/* Preset Buttons */}
          <Text style={styles.presetHeading}>Quick Preset Weights:</Text>
          <View style={styles.presetsGrid}>
            {presets.map((preset) => (
              <Pressable
                key={preset}
                style={[styles.presetBtn, weight === preset && styles.presetBtnActive]}
                onPress={() => handleWeightChange(preset)}
              >
                <Text style={[styles.presetBtnText, weight === preset && styles.presetBtnTextActive]}>
                  {preset} kg
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Valuation Preview */}
        <View style={styles.valuationCard}>
          <Text style={styles.valuationLabel}>{t('weight.estimatedBase')}</Text>
          <Text style={styles.valuationAmount}>
            ₹{estimatedBaseValuation.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.valuationCalcNote}>
            Calculated as {weight} kg × ₹{selectedMaterial.pricePerKg}/kg
          </Text>
        </View>

        {/* Fair Weighing Business Rule Highlight */}
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Scale size={18} color="#b45309" />
            <Text style={styles.ruleTitle}>{t('weight.ruleTitle')}</Text>
          </View>
          <Text style={styles.ruleDesc}>{t('weight.ruleDesc')}</Text>
        </View>

        {/* Primary Action Button */}
        <Pressable style={styles.primaryBtn} onPress={handleProceed}>
          <Text style={styles.primaryBtnText}>{t('weight.estimateBtn')}</Text>
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

  matSummaryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  matSummaryLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  matSummaryPrimary: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  matSummarySecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  matSummaryRate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
    marginTop: 2,
  },

  weightCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  weightLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 14,
  },
  stepperRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 130,
  },
  weightInputText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    minWidth: 60,
  },
  kgUnit: {
    fontSize: 18,
    fontWeight: '800',
    color: '#64748b',
    marginLeft: 4,
  },

  presetHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  presetsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  presetBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  presetBtnTextActive: {
    color: '#ffffff',
  },

  valuationCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  valuationLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  valuationAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#b45309',
    marginVertical: 2,
  },
  valuationCalcNote: {
    fontSize: 11,
    color: '#64748b',
  },

  ruleCard: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    marginBottom: 20,
  },
  ruleHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
    textTransform: 'uppercase',
    flex: 1,
    flexShrink: 1,
  },
  ruleDesc: {
    fontSize: 11,
    color: '#78350f',
    lineHeight: 17,
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
