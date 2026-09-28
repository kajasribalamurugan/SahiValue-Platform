import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { BilingualText } from '../../components/BilingualText';
import { SahiValueLogo } from '../../components/SahiValueLogo';
import { getTimeBasedGreeting } from '../../utils/greeting';
import {
  PlusCircle,
  TrendingUp,
  Scale,
  Receipt,
  ArrowRight,
  Sparkles,
  QrCode,
  AlertTriangle
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { language, t, getBilingualMaterial } = useLanguage();
  const {
    totalEarnings,
    totalVerifiedWeight,
    completedLotsCount,
    lots,
    materials,
  } = useApp();

  const [greeting, setGreeting] = useState<string>(() => getTimeBasedGreeting(language));

  // Dynamically update greeting whenever Home screen becomes active/focused
  useFocusEffect(
    useCallback(() => {
      setGreeting(getTimeBasedGreeting(language));
    }, [language])
  );

  const pendingLot = lots.find((l) => l.status === 'PENDING_HANDOVER');
  const completedLots = lots.filter((l) => l.status === 'COMPLETED');

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Welcome Greeting & Premium Brand Hero Section */}
        <View style={styles.greetingCard}>
          <View style={styles.brandHeroRow}>
            <SahiValueLogo />
          </View>

          <View style={styles.greetingHeader}>
            <View style={styles.greetingTitleCol}>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.greetingSub}>{t('home.subtitle')}</Text>
            </View>
          </View>

          {/* Main Add E-Waste CTA Button */}
          <Pressable
            style={styles.addMainBtn}
            onPress={() => router.push('/(tabs)/add-ewaste')}
          >
            <PlusCircle size={20} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.addMainBtnText}>{t('home.addBatchBtn')}</Text>
          </Pressable>
        </View>

        {/* 2x2 Metric KPI Grid */}
        <View style={styles.metricsGrid}>
          {/* Total Earnings */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('home.totalEarnings')}</Text>
            <Text style={styles.metricAmount}>
              ₹{totalEarnings.toLocaleString('en-IN')}
            </Text>

            <View style={styles.metricBadgeContainer}>
              <Sparkles size={12} color="#047857" />
              <Text style={styles.metricBadgeText}>{t('home.handoverReceipts')}</Text>
            </View>
          </View>

          {/* Active Lots */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('home.activeLots')}</Text>
            <Text style={styles.metricValue}>
              {lots.filter((l) => l.status === 'PENDING_HANDOVER').length}
            </Text>
            <Text style={styles.metricSubText}>{t('home.awaitingHandover')}</Text>
          </View>

          {/* Verified Recycled */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('home.verifiedRecycled')}</Text>

            <Text style={styles.metricValue}>
              {totalVerifiedWeight.toFixed(1)} <Text style={styles.unitText}>kg</Text>
            </Text>
            <Text style={styles.metricSubText}>CPCB Audited</Text>
          </View>

          {/* Completed Batches */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('home.completedLots')}</Text>
            <Text style={styles.metricValue}>{completedLotsCount}</Text>
            <Text style={styles.metricSubText}>{t('home.allSettled')}</Text>
          </View>
        </View>

        {/* Active Lot Progress Tracker Card */}
        {pendingLot && (
          <View style={styles.activeLotCard}>
            <View style={styles.activeLotHeader}>
              <View>
                <Text style={styles.activeLotTag}>{t('home.activeLotHeader')}</Text>
                <Text style={styles.activeLotId}>{pendingLot.id}</Text>
              </View>
              <StatusBadge status={pendingLot.status} />
            </View>

            <View style={styles.lotDetailsRow}>
              <View>
                <Text style={styles.lotDetailLabel}>{t('home.declaredWeight')}</Text>
                <Text style={styles.lotDetailValWeight}>
                  {pendingLot.declaredWeight} kg
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.lotDetailLabel}>{t('home.estimatedValuation')}</Text>
                <Text style={styles.lotDetailValPayout}>
                  ₹{pendingLot.estimatedPayout.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Handover Stepper */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperTrack} />
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.stepDotDone]}>
                  <Text style={styles.stepDotTextDone}>1</Text>
                </View>
                <Text style={styles.stepText}>{t('home.created')}</Text>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.stepDotDone]}>
                  <Text style={styles.stepDotTextDone}>2</Text>
                </View>
                <Text style={styles.stepText}>{t('home.selected')}</Text>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.stepDotActive]}>
                  <Text style={styles.stepDotTextActive}>3</Text>
                </View>
                <Text style={[styles.stepText, styles.stepTextActive]}>{t('home.queue')}</Text>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepDot}>
                  <Text style={styles.stepDotText}>4</Text>
                </View>
                <Text style={styles.stepText}>{t('home.paid')}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.activeLotActions}>
              <Pressable
                style={styles.lotPassBtn}
                onPress={() => router.push(`/lot-details/${pendingLot.id}` as any)}
              >
                <QrCode size={16} color="#334155" style={{ marginRight: 6 }} />
                <Text style={styles.lotPassBtnText}>{t('home.viewDetails')}</Text>
              </Pressable>

              <Pressable
                style={styles.handoverActionBtn}
                onPress={() => router.push(`/digital-handover/${pendingLot.id}` as any)}
              >
                <Scale size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.handoverActionBtnText}>{t('home.digitalHandover')}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Today's Benchmark Rates Directory Preview */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={18} color="#059669" />
            <Text style={styles.sectionTitle}>{t('home.todayRates')}</Text>
          </View>
          <Pressable onPress={() => router.push('/price-board')}>
            <Text style={styles.viewDirectoryText}>{t('home.viewDirectory')} →</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ratesScroll}
          contentContainerStyle={styles.ratesScrollContent}
        >
          {materials.slice(0, 4).map((m) => {
            const bilingual = getBilingualMaterial(m.id, m.name);
            return (
              <View key={m.id} style={styles.rateCard}>
                <Text style={styles.rateMatPrimary} numberOfLines={1}>
                  {bilingual.primary}
                </Text>
                {bilingual.secondary && (
                  <Text style={styles.rateMatSecondary} numberOfLines={1}>
                    {bilingual.secondary}
                  </Text>
                )}

                <View style={styles.ratePriceRow}>
                  <Text style={styles.ratePrice}>₹{m.pricePerKg}</Text>
                  <Text style={styles.rateUnit}>/ kg</Text>
                </View>

                {m.badge && (
                  <View style={styles.rateBadge}>
                    <Text style={styles.rateBadgeText}>{m.badge}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Safety Quick Card */}
        <Pressable style={styles.safetyCard} onPress={() => router.push('/safety')}>
          <View style={styles.safetyIconBox}>
            <AlertTriangle size={20} color="#b45309" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>{t('safety.title')}</Text>
            <Text style={styles.safetySub}>{t('safety.subtitle')}</Text>
          </View>
          <ArrowRight size={18} color="#94a3b8" />
        </Pressable>

        {/* Recent Audited Receipts */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Receipt size={18} color="#059669" />
            <Text style={styles.sectionTitle}>{t('home.recentReceipts')}</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/earnings')}>
            <Text style={styles.viewDirectoryText}>{t('home.allReceipts')} →</Text>
          </Pressable>
        </View>

        {completedLots.length === 0 ? (
          <View style={styles.emptyCard}>
            <Receipt size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>{t('home.noReceipts')}</Text>
          </View>
        ) : (
          completedLots.slice(0, 3).map((lot) => {
            const matBilingual = getBilingualMaterial(lot.material.id, lot.material.name);
            return (
              <Pressable
                key={lot.id}
                style={styles.receiptCard}
                onPress={() => router.push(`/digital-receipt/${lot.id}` as any)}
              >
                <View style={styles.receiptCardHeader}>
                  <View style={styles.receiptInfoCol}>
                    <Text style={styles.receiptLotId}>{lot.id}</Text>
                    <BilingualText
                      officialName={lot.recycler.officialName || lot.recycler.name}
                      localHi={lot.recycler.displayName?.hi}
                      localMr={lot.recycler.displayName?.mr}
                      primaryStyle={styles.recNamePrimary}
                      secondaryStyle={styles.recNameSecondary}
                    />
                  </View>
                  <View style={styles.statusBadgeWrap}>
                    <StatusBadge status={lot.status} />
                  </View>
                </View>

                <View style={styles.receiptCardFooter}>
                  <Text style={styles.receiptMatText}>
                    {matBilingual.primary} • <Text style={{ fontWeight: '800', color: '#047857' }}>{lot.verifiedWeight} kg</Text>
                  </Text>

                  <Text style={styles.receiptPayout}>
                    ₹{(lot.finalPayout || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </Pressable>
            );
          })
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
    paddingBottom: 110,
  },
  greetingCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  brandHeroRow: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greetingHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingTitleCol: {
    flex: 1,
    flexShrink: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  greetingSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 18,
  },
  addMainBtn: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnIcon: {
    marginRight: 8,
  },
  addMainBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  metricsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '48.5%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  metricAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#b45309',
    marginVertical: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 2,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  metricSubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  metricBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metricBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },

  activeLotCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  activeLotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activeLotTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  activeLotId: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  lotDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#fef3c7',
    marginBottom: 12,
  },
  lotDetailLabel: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
  },
  lotDetailValWeight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#b45309',
    marginTop: 2,
  },
  lotDetailValPayout: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },

  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  stepperTrack: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 12,
    height: 2,
    backgroundColor: '#fde68a',
    zIndex: 0,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stepDotActive: {
    backgroundColor: '#d97706',
    borderColor: '#d97706',
  },
  stepDotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  stepDotTextDone: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepDotTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 10,
    color: '#92400e',
    marginTop: 4,
    fontWeight: '600',
  },
  stepTextActive: {
    fontWeight: '800',
    color: '#b45309',
  },

  activeLotActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  lotPassBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  lotPassBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  handoverActionBtn: {
    flex: 1.2,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handoverActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewDirectoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  ratesScroll: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  ratesScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  rateCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rateMatPrimary: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  rateMatSecondary: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  ratePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  ratePrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  rateUnit: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 2,
  },
  rateBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  rateBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065f46',
  },

  safetyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  safetyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  safetySub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  receiptCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  receiptInfoCol: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 4,
  },
  statusBadgeWrap: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  receiptLotId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  recNamePrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  recNameSecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  receiptCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  receiptMatText: {
    fontSize: 12,
    color: '#64748b',
  },
  receiptPayout: {
    fontSize: 16,
    fontWeight: '900',
    color: '#b45309',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
