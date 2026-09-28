import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { BilingualText } from '../../components/BilingualText';
import { PlusCircle, QrCode, Scale, Receipt } from 'lucide-react-native';

export default function MyLotsScreen() {
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { lots } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const filteredLots = lots.filter((l) => {
    if (filter === 'PENDING') return l.status === 'PENDING_HANDOVER';
    if (filter === 'COMPLETED') return l.status === 'COMPLETED';
    return true;
  });

  const pendingCount = lots.filter((l) => l.status === 'PENDING_HANDOVER').length;
  const completedCount = lots.filter((l) => l.status === 'COMPLETED').length;

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Title Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTitleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{t('myLots.title')}</Text>
              <Text style={styles.subtitle}>{t('myLots.subtitle')}</Text>
            </View>
            <Pressable
              style={styles.newLotBtn}
              onPress={() => router.push('/(tabs)/add-ewaste')}
            >
              <PlusCircle size={16} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.newLotBtnText}>{t('myLots.newLotBtn')}</Text>
            </Pressable>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <Pressable
              style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
              onPress={() => setFilter('ALL')}
            >
              <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]} numberOfLines={1}>
                {t('myLots.allLots')} ({lots.length})
              </Text>
            </Pressable>

            <Pressable
              style={[styles.filterPill, filter === 'PENDING' && styles.filterPillActive]}
              onPress={() => setFilter('PENDING')}
            >
              <Text style={[styles.filterText, filter === 'PENDING' && styles.filterTextActive]} numberOfLines={1}>
                {t('myLots.pendingFilter')} ({pendingCount})
              </Text>
            </Pressable>

            <Pressable
              style={[styles.filterPill, filter === 'COMPLETED' && styles.filterPillActive]}
              onPress={() => setFilter('COMPLETED')}
            >
              <Text style={[styles.filterText, filter === 'COMPLETED' && styles.filterTextActive]} numberOfLines={1}>
                {t('myLots.completedFilter')} ({completedCount})
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Lots Cards List */}
        {filteredLots.length === 0 ? (
          <View style={styles.emptyCard}>
            <Receipt size={36} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>{t('myLots.noLotsFound')}</Text>
          </View>
        ) : (
          filteredLots.map((lot) => {
            const matBilingual = getBilingualMaterial(lot.material.id, lot.material.name);
            const isCompleted = lot.status === 'COMPLETED';

            return (
              <View key={lot.id} style={styles.lotCard}>
                {/* Header: Lot ID + Status Badge */}
                <View style={styles.lotHeaderRow}>
                  <Text style={styles.lotIdText}>{lot.id}</Text>
                  <StatusBadge status={lot.status} />
                </View>

                {/* Recycler Name */}
                <BilingualText
                  officialName={lot.recycler.officialName || lot.recycler.name}
                  localHi={lot.recycler.displayName?.hi}
                  localMr={lot.recycler.displayName?.mr}
                  primaryStyle={styles.recPrimary}
                  secondaryStyle={styles.recSecondary}
                />

                <View style={styles.divider} />

                {/* Material Category */}
                <View style={styles.specSection}>
                  <Text style={styles.specLabel}>{t('lot.matCategory')}</Text>
                  <Text style={styles.specValPrimary} numberOfLines={1}>
                    {matBilingual.primary}
                  </Text>
                  {matBilingual.secondary && (
                    <Text style={styles.specValSecondary} numberOfLines={1}>
                      {matBilingual.secondary}
                    </Text>
                  )}
                </View>

                <View style={styles.divider} />

                {/* Declared vs Verified Weight */}
                <View style={styles.weightPairRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{t('lot.declaredWeight')}</Text>
                    <Text style={styles.declaredWeightText}>{lot.declaredWeight} kg</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.specLabel}>{t('lot.verifiedWeight')}</Text>
                    <Text style={isCompleted ? styles.verifiedWeightText : styles.pendingWeightText}>
                      {isCompleted ? `${lot.verifiedWeight} kg` : t('lot.pendingWeighing')}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Footer: Payout & Action Button */}
                <View style={styles.cardFooterRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.payoutLabel}>
                      {isCompleted ? t('lot.settlementPayout') : t('lot.estimatedValuation')}
                    </Text>
                    <Text style={styles.payoutAmount}>
                      ₹{(isCompleted ? lot.finalPayout : lot.estimatedPayout)?.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    {!isCompleted ? (
                      <>
                        <Pressable
                          style={styles.detailsBtn}
                          onPress={() => router.push(`/lot-details/${lot.id}` as any)}
                        >
                          <QrCode size={15} color="#334155" />
                        </Pressable>
                        <Pressable
                          style={styles.handoverBtn}
                          onPress={() => router.push(`/digital-handover/${lot.id}` as any)}
                        >
                          <Scale size={14} color="#ffffff" style={{ marginRight: 4 }} />
                          <Text style={styles.handoverBtnText}>{t('home.digitalHandover')}</Text>
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        style={styles.receiptBtn}
                        onPress={() => router.push(`/digital-receipt/${lot.id}` as any)}
                      >
                        <Receipt size={14} color="#047857" style={{ marginRight: 4 }} />
                        <Text style={styles.receiptBtnText}>{t('lot.viewReceipt')}</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
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
  headerCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  headerTitleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  titleCol: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  newLotBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  newLotBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#047857',
    fontWeight: '800',
  },

  lotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    width: '100%',
  },
  lotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lotIdText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  recPrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  recSecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  specSection: {
    paddingVertical: 2,
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  specValPrimary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  specValSecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  weightPairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  declaredWeightText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#b45309',
    marginTop: 2,
  },
  verifiedWeightText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
    marginTop: 2,
  },
  pendingWeightText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
    marginTop: 2,
  },

  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  payoutLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#b45309',
    marginTop: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  detailsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handoverBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handoverBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  receiptBtn: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
});
