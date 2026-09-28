import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { Header } from '../components/Header';
import { AlertTriangle, ShieldCheck, Flame, Tv, Shirt } from 'lucide-react-native';

export default function SafetyScreen() {
  const { t } = useLanguage();

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('safety.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Title Header Card */}
        <View style={styles.titleCard}>
          <View style={styles.cpcbTag}>
            <ShieldCheck size={16} color="#047857" />
            <Text style={styles.cpcbTagText}>CPCB COMPLIANCE RULES 2026</Text>
          </View>
          <Text style={styles.title}>{t('safety.title')}</Text>
          <Text style={styles.subtitle}>{t('safety.subtitle')}</Text>
        </View>

        {/* Hazard Segregation Box */}
        <View style={styles.hazardCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBoxHazard}>
              <AlertTriangle size={20} color="#b45309" />
            </View>
            <Text style={styles.hazardTitle}>{t('safety.hazardTitle')}</Text>
          </View>
          <Text style={styles.hazardDesc}>{t('safety.hazardDesc')}</Text>
        </View>

        {/* Handling Guidelines List */}
        <Text style={styles.sectionHeading}>{t('safety.guidelines')}</Text>

        {/* Protective Gear */}
        <View style={styles.ruleCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
              <Shirt size={20} color="#059669" />
            </View>
            <Text style={styles.ruleTitle}>{t('safety.gearTitle')}</Text>
          </View>
          <Text style={styles.ruleDesc}>{t('safety.gearDesc')}</Text>
        </View>

        {/* Intact Displays */}
        <View style={styles.ruleCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
              <Tv size={20} color="#059669" />
            </View>
            <Text style={styles.ruleTitle}>{t('safety.intactTitle')}</Text>
          </View>
          <Text style={styles.ruleDesc}>{t('safety.intactDesc')}</Text>
        </View>

        {/* No Acid Washing / Burning */}
        <View style={styles.ruleCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#fff1f2' }]}>
              <Flame size={20} color="#be123c" />
            </View>
            <Text style={styles.ruleTitle}>{t('safety.noBurnTitle')}</Text>
          </View>
          <Text style={styles.ruleDesc}>{t('safety.noBurnDesc')}</Text>
        </View>

        {/* CPCB Registered Partner */}
        <View style={styles.cpcbCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
              <ShieldCheck size={20} color="#047857" />
            </View>
            <Text style={styles.cpcbCardTitle}>{t('safety.cpcbTitle')}</Text>
          </View>
          <Text style={styles.cpcbCardDesc}>{t('safety.cpcbDesc')}</Text>
        </View>
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
  titleCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cpcbTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  cpcbTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
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

  hazardCard: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconBoxHazard: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hazardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400e',
    flex: 1,
    flexShrink: 1,
  },
  hazardDesc: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },

  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 4,
  },

  ruleCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    flexShrink: 1,
  },
  ruleDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },

  cpcbCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    marginTop: 4,
    marginBottom: 16,
  },
  cpcbCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065f46',
    flex: 1,
    flexShrink: 1,
  },
  cpcbCardDesc: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
});
