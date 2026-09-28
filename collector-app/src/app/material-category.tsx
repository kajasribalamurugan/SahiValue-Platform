import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Cpu, Zap, BatteryCharging, Monitor, Tv, HardDrive, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MaterialCategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, getBilingualMaterial, getTranslatedMaterialDesc } = useLanguage();
  const { materials, draftLot, setDraftMaterial } = useApp();

  const [selectedId, setSelectedId] = useState<string>(
    draftLot.materialId || materials[0].id
  );

  const renderMaterialIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu size={24} color={color} />;
      case 'Zap':
        return <Zap size={24} color={color} />;
      case 'BatteryCharging':
        return <BatteryCharging size={24} color={color} />;
      case 'Monitor':
        return <Monitor size={24} color={color} />;
      case 'Tv':
        return <Tv size={24} color={color} />;
      case 'HardDrive':
        return <HardDrive size={24} color={color} />;
      default:
        return <Cpu size={24} color={color} />;
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDraftMaterial(id);
  };

  const handleProceed = () => {
    setDraftMaterial(selectedId);
    router.push('/declared-weight');
  };

  const selectedMat = materials.find((m) => m.id === selectedId) || materials[0];
  const selectedBilingual = getBilingualMaterial(selectedMat.id, selectedMat.name);

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('material.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepBadge}>{t('material.step')}</Text>
          <Text style={styles.stepTitle}>{t('material.stepHeader')}</Text>
        </View>

        <Text style={styles.title}>{t('material.title')}</Text>
        <Text style={styles.subtitle}>{t('material.subtitle')}</Text>

        {/* Materials List */}
        <View style={styles.materialsList}>
          {materials.map((m) => {
            const isSelected = selectedId === m.id;
            const bilingual = getBilingualMaterial(m.id, m.name);
            const desc = getTranslatedMaterialDesc(m.id, m.description);

            return (
              <Pressable
                key={m.id}
                style={[styles.matCard, isSelected && styles.matCardSelected]}
                onPress={() => handleSelect(m.id)}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                    {renderMaterialIcon(m.iconName, m.color)}
                  </View>

                  <View style={styles.matMeta}>
                    <View style={styles.nameCheckRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.matPrimaryName}>{bilingual.primary}</Text>
                        {bilingual.secondary && (
                          <Text style={styles.matSecondaryName}>{bilingual.secondary}</Text>
                        )}
                      </View>
                      {isSelected && <CheckCircle2 size={20} color="#059669" />}
                    </View>

                    <Text style={styles.matCategoryTag}>{m.category}</Text>
                    <Text style={styles.matDesc}>{desc}</Text>

                    <View style={styles.rateRow}>
                      <View style={styles.ratePriceBox}>
                        <Text style={styles.rateLabel}>{t('material.benchmarkRate')}</Text>
                        <Text style={styles.rateAmount}>₹{m.pricePerKg} / kg</Text>
                      </View>

                      <View style={styles.co2Box}>
                        <Sparkles size={12} color="#047857" />
                        <Text style={styles.co2Text}>
                          {m.co2SavedPerKg} {t('material.co2Saved')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.selectedLabel}>{t('material.selectedCat')}</Text>
          <Text style={styles.selectedName} numberOfLines={1}>
            {selectedBilingual.primary}
          </Text>
        </View>

        <Pressable style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedBtnText}>{t('material.proceedWeightBtn')}</Text>
          <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 4 }} />
        </Pressable>
      </View>
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
    paddingBottom: 100,
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

  materialsList: {
    gap: 12,
  },
  matCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  matCardSelected: {
    borderColor: '#059669',
    borderWidth: 2,
    backgroundColor: '#ecfdf5',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matMeta: {
    flex: 1,
  },
  nameCheckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matPrimaryName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  matSecondaryName: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  matCategoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  matDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 6,
  },
  ratePriceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flex: 1,
    flexShrink: 1,
  },
  rateLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  rateAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#047857',
  },
  co2Box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 3,
    flexShrink: 0,
  },
  co2Text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  selectedLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  proceedBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
