import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { BilingualText } from '../../components/BilingualText';
import { ShieldCheck, Scale, Receipt, PlusCircle } from 'lucide-react-native';

export default function EarningsScreen() {
  const router = useRouter();
  const { t, getBilingualMaterial } = useLanguage();
  const { totalEarnings, totalVerifiedWeight, completedLotsCount, lots } = useApp();

  const completedLots = lots.filter((l) => l.status === 'COMPLETED');

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Passbook Overview Metrics Card */}
        <View style={styles.overviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.passbookTag}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.passbookTitle} numberOfLines={1}>{t('earnings.passbookTitle')}</Text>
            </View>
            <View style={styles.auditedBadge}>
              <Text style={styles.auditedBadgeText}>{t('earnings.auditedBadge')}</Text>
            </View>
          </View>

          <View style={styles.lifetimeBox}>
            <Text style={styles.lifetimeLabel}>{t('earnings.lifetimeEarnings')}</Text>
            <Text style={styles.lifetimeAmount}>
              ₹{totalEarnings.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricMiniBox}>
              <View style={styles.miniLabelRow}>
                <Scale size={14} color="#059669" />
                <Text style={styles.miniLabel}>{t('earnings.totalRecycled')}</Text>
              </View>
              <Text style={styles.miniVal}>{totalVerifiedWeight.toFixed(1)} kg</Text>
            </View>

            <View style={styles.metricMiniBox}>
              <View style={styles.miniLabelRow}>
                <Receipt size={14} color="#059669" />
                <Text style={styles.miniLabel}>{t('earnings.receiptsCount')}</Text>
              </View>
              <Text style={styles.miniVal}>{completedLotsCount}</Text>
            </View>
          </View>
        </View>

        {/* Digital Settlement Receipts Log */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>{t('earnings.receiptsHeader')}</Text>
            <Text style={styles.logRecordsCount}>{completedLots.length} {t('earnings.records')}</Text>
          </View>

          {completedLots.length === 0 ? (
            <View style={styles.emptyCard}>
              <Receipt size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>{t('earnings.noReceiptsYet')}</Text>
              <Pressable
                style={styles.addFirstBtn}
                onPress={() => router.push('/(tabs)/add-ewaste')}
              >
                <Text style={styles.addFirstBtnText}>{t('earnings.addFirstBatch')}</Text>
              </Pressable>
            </View>
          ) : (
            completedLots.map((lot) => {
              const matBilingual = getBilingualMaterial(lot.material.id, lot.material.name);
              return (
                <Pressable
                  key={lot.id}
                  style={styles.receiptItem}
                  onPress={() => router.push(`/digital-receipt/${lot.id}` as any)}
                >
                  <View style={styles.receiptItemHeader}>
                    <View>
                      <Text style={styles.transIdLabel}>{t('earnings.transId')}</Text>
                      <Text style={styles.transIdVal}>{lot.id}</Text>
                    </View>
                    <StatusBadge status={lot.status} />
                  </View>

                  <View style={styles.recInfoBox}>
                    <BilingualText
                      officialName={lot.recycler.officialName || lot.recycler.name}
                      localHi={lot.recycler.displayName?.hi}
                      localMr={lot.recycler.displayName?.mr}
                      primaryStyle={styles.recPrimary}
                      secondaryStyle={styles.recSecondary}
                    />

                    <View style={styles.matRow}>
                      <Text style={styles.matName}>{matBilingual.primary}</Text>
                    </View>

                    {/* Weight Comparison Box */}
                    <View style={styles.weightsGrid}>
                      <View style={styles.wBox}>
                        <Text style={styles.wBoxLabel}>{t('lot.declaredWeight')}</Text>
                        <Text style={styles.wBoxValDeclared}>{lot.declaredWeight} kg</Text>
                      </View>
                      <View style={styles.wBoxVerified}>
                        <Text style={styles.wBoxLabelVerified}>{t('lot.verifiedWeight')}</Text>
                        <Text style={styles.wBoxValVerified}>{lot.verifiedWeight} kg</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.receiptFooter}>
                    <Text style={styles.utrText}>
                      {t('earnings.utr')} {lot.utrNumber || 'UPI/20260922/9812401'}
                    </Text>
                    <Text style={styles.payoutAmount}>
                      ₹{(lot.finalPayout || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Add Another Batch Button */}
        <Pressable
          style={styles.addAnotherBtn}
          onPress={() => router.push('/(tabs)/add-ewaste')}
        >
          <PlusCircle size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.addAnotherBtnText}>{t('earnings.addAnotherBatch')}</Text>
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
  overviewCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 8,
  },
  passbookTag: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passbookTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    flex: 1,
    flexShrink: 1,
  },
  auditedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    flexShrink: 0,
  },
  auditedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
  },

  lifetimeBox: {
    marginBottom: 14,
  },
  lifetimeLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  lifetimeAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#b45309',
    marginTop: 2,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricMiniBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  miniLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  miniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  miniVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },

  logCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  logRecordsCount: {
    fontSize: 11,
    color: '#64748b',
  },

  receiptItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  receiptItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  transIdLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  transIdVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },

  recInfoBox: {
    marginBottom: 8,
  },
  recPrimary: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  recSecondary: {
    fontSize: 11,
    color: '#64748b',
  },
  matRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  matName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },

  weightsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  wBox: {
    flex: 1,
  },
  wBoxLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '600',
  },
  wBoxValDeclared: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  wBoxVerified: {
    flex: 1,
    alignItems: 'flex-end',
  },
  wBoxLabelVerified: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '600',
  },
  wBoxValVerified: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },

  receiptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  utrText: {
    fontSize: 10,
    color: '#64748b',
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#b45309',
  },

  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  addFirstBtn: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addFirstBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  addAnotherBtn: {
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
  addAnotherBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
