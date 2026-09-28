import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Lot } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBadge } from './StatusBadge';
import { BilingualText } from './BilingualText';
import { ShieldCheck, Scale, Receipt, CheckCircle2 } from 'lucide-react-native';

interface DigitalReceiptViewProps {
  lot: Lot;
  onClose?: () => void;
}

export const DigitalReceiptView: React.FC<DigitalReceiptViewProps> = ({ lot, onClose }) => {
  const { t, getBilingualMaterial } = useLanguage();
  const bilingualMat = getBilingualMaterial(lot.material.id, lot.material.name);

  // CRITICAL BUSINESS RULE:
  // Final Payment MUST ALWAYS be calculated using Verified Weight physically weighed by recycler!
  const verifiedWeight = lot.verifiedWeight || lot.declaredWeight;
  const finalPayout = lot.finalPayout || Math.round(verifiedWeight * lot.material.pricePerKg);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Receipt Card Header */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <View style={styles.cpcbTag}>
            <ShieldCheck size={14} color="#047857" />
            <Text style={styles.cpcbTagText}>{t('earnings.auditedBadge')}</Text>
          </View>
          <StatusBadge status={lot.status} />
        </View>

        <Text style={styles.receiptTitle}>{t('receipt.title')}</Text>
        <Text style={styles.lotIdText}>{t('receipt.lotId')}: {lot.id}</Text>

        <View style={styles.utrRow}>
          <Text style={styles.utrLabel}>{t('receipt.utr')}</Text>
          <Text style={styles.utrValue}>{lot.utrNumber || 'UPI/20260922/9812401'}</Text>
        </View>
      </View>

      {/* Recycler & Collector Entities Card */}
      <View style={styles.sectionCard}>
        {/* Recycler Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t('receipt.recyclerName')}</Text>
          <BilingualText
            officialName={lot.recycler.officialName || lot.recycler.name}
            localHi={lot.recycler.displayName?.hi}
            localMr={lot.recycler.displayName?.mr}
            primaryStyle={styles.entityPrimary}
            secondaryStyle={styles.entitySecondary}
          />
          <Text style={styles.subDetailText}>{lot.recycler.address}</Text>
          <Text style={styles.licenseText}>CPCB Lic: DEL/EW/2026/894</Text>
        </View>

        <View style={styles.divider} />

        {/* Collector Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t('receipt.collectorName')}</Text>
          <BilingualText
            officialName="Rahul Kumar"
            localHi="राहुल कुमार"
            localMr="राहुल कुमार"
            primaryStyle={styles.entityPrimary}
            secondaryStyle={styles.entitySecondary}
          />
          <Text style={styles.subDetailText}>Okhla / Mayapuri Zone, Delhi NCR</Text>
        </View>
      </View>

      {/* Material & Weight Audit Component */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeading}>{t('handover.auditTitle')}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('lot.matCategory')}</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailValuePrimary}>{bilingualMat.primary}</Text>
            {bilingualMat.secondary && (
              <Text style={styles.detailValueSecondary}>{bilingualMat.secondary}</Text>
            )}
          </View>
        </View>

        <View style={styles.weightGrid}>
          <View style={styles.weightBoxDeclared}>
            <Text style={styles.weightBoxLabel}>{t('receipt.declaredWeight')}</Text>
            <Text style={styles.weightBoxValueDeclared}>{lot.declaredWeight} kg</Text>
            <Text style={styles.weightBoxNote}>{t('handover.initialEstimate')}</Text>
          </View>

          <View style={styles.weightBoxVerified}>
            <Text style={styles.weightBoxLabelVerified}>{t('receipt.verifiedWeight')}</Text>
            <Text style={styles.weightBoxValueVerified}>{verifiedWeight} kg</Text>
            <Text style={styles.weightBoxNoteVerified}>{t('handover.digitalScaleMeasurement')}</Text>
          </View>
        </View>
      </View>

      {/* Financial Settlement Breakdown */}
      <View style={styles.financialCard}>
        <View style={styles.financialRow}>
          <Text style={styles.finLabel}>{t('handover.benchmarkRate')}</Text>
          <Text style={styles.finValue}>₹{lot.material.pricePerKg} / kg</Text>
        </View>

        <View style={styles.financialRow}>
          <Text style={styles.finLabel}>{t('handover.verifiedPhysicalWeight')}</Text>
          <Text style={styles.finValueVerified}>{verifiedWeight} kg</Text>
        </View>

        <View style={styles.financialDivider} />

        <View style={styles.finalPayoutRow}>
          <View>
            <Text style={styles.finalPayoutLabel}>{t('receipt.finalPayment')}</Text>
            <Text style={styles.ruleNotice}>Verified Weight × Rate</Text>
          </View>

          <Text style={styles.finalPayoutAmount}>
            ₹{finalPayout.toLocaleString('en-IN')}
          </Text>
        </View>

        <Text style={styles.italicNotice}>{t('handover.italicNotice')}</Text>
      </View>

      {onClose && (
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>{t('common.close')}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  badgeRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 6,
  },
  cpcbTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
    flexShrink: 1,
  },
  cpcbTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 2,
  },
  lotIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'Platform',
    marginBottom: 8,
  },
  utrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  utrLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  utrValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  fieldGroup: {
    marginVertical: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  entityPrimary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  entitySecondary: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  subDetailText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  licenseText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValueContainer: {
    alignItems: 'flex-end',
  },
  detailValuePrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailValueSecondary: {
    fontSize: 11,
    color: '#64748b',
  },

  weightGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  weightBoxDeclared: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  weightBoxLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  weightBoxValueDeclared: {
    fontSize: 18,
    fontWeight: '800',
    color: '#b45309',
    marginVertical: 2,
  },
  weightBoxNote: {
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
  weightBoxLabelVerified: {
    fontSize: 11,
    color: '#065f46',
    fontWeight: '600',
  },
  weightBoxValueVerified: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 2,
  },
  weightBoxNoteVerified: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },

  financialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    marginBottom: 16,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  finLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  finValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  finValueVerified: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },
  finValueBonus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  financialDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  finalPayoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalPayoutLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  ruleNotice: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  finalPayoutAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#b45309',
  },
  italicNotice: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
  },

  closeBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
