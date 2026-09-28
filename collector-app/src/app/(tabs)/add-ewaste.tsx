import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { AICameraScanner } from '../../components/AICameraScanner';
import { AIClassifyResponse } from '../../services/aiService';
import { Scale, CheckCircle2, ArrowRight } from 'lucide-react-native';

export default function AddEWasteScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setDraftMaterial } = useApp();

  const handleConfirmClassification = (materialId: string, _aiResult: AIClassifyResponse) => {
    setDraftMaterial(materialId);
    router.push('/material-category');
  };

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Title Banner */}
        <View style={styles.titleCard}>
          <Text style={styles.title}>{t('add.title')}</Text>
          <Text style={styles.subtitle}>{t('add.subtitle')}</Text>
        </View>

        {/* AI Camera Action Card */}
        <AICameraScanner onConfirmClassification={handleConfirmClassification} />

        {/* 3-Step Process Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>{t('add.processTitle')}</Text>

          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('add.step1Title')}</Text>
              <Text style={styles.stepDesc}>{t('add.step1Desc')}</Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('add.step2Title')}</Text>
              <Text style={styles.stepDesc}>{t('add.step2Desc')}</Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('add.step3Title')}</Text>
              <Text style={styles.stepDesc}>{t('add.step3Desc')}</Text>
            </View>
          </View>
        </View>

        {/* Fair Weighing Rule Highlight Box */}
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Scale size={18} color="#b45309" />
            <Text style={styles.ruleTitle}>{t('add.ruleTitle')}</Text>
          </View>
          <Text style={styles.ruleDesc}>{t('add.ruleDesc')}</Text>
        </View>

        {/* CPCB & Bonus Guarantee Checkmarks */}
        <View style={styles.checkCard}>
          <View style={styles.checkRow}>
            <CheckCircle2 size={18} color="#059669" style={styles.checkIcon} />
            <Text style={styles.checkText}>{t('add.check1')}</Text>
          </View>

          <View style={styles.checkRow}>
            <CheckCircle2 size={18} color="#059669" style={styles.checkIcon} />
            <Text style={styles.checkText}>{t('add.check2')}</Text>
          </View>

          <View style={styles.checkRow}>
            <CheckCircle2 size={18} color="#059669" style={styles.checkIcon} />
            <Text style={styles.checkText}>{t('add.check3')}</Text>
          </View>
        </View>

        {/* Manual Category Selection Button */}
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/material-category')}
        >
          <Text style={styles.primaryBtnText}>{t('add.selectBtn')}</Text>
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
    paddingBottom: 110,
  },
  titleCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
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
    lineHeight: 18,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  stepRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  stepContent: {
    flex: 1,
    flexShrink: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
    marginLeft: 40,
  },

  ruleCard: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  ruleHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400e',
    flex: 1,
    flexShrink: 1,
  },
  ruleDesc: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },

  checkCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    gap: 12,
  },
  checkRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  checkText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
    flexShrink: 1,
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
