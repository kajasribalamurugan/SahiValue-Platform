import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LotStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Clock, CheckCircle2, XCircle } from 'lucide-react-native';

interface StatusBadgeProps {
  status: LotStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'PENDING_ACCEPTANCE':
    case 'CREATED':
      return (
        <View style={[styles.badge, styles.pendingBadge]}>
          <Clock size={12} color="#b45309" style={styles.icon} />
          <Text style={styles.pendingText} numberOfLines={1}>
            Waiting for Recycler Acceptance
          </Text>
        </View>
      );
    case 'ACCEPTED':
    case 'AWAITING_HANDOVER':
      return (
        <View style={[styles.badge, styles.acceptedBadge]}>
          <CheckCircle2 size={12} color="#2563eb" style={styles.icon} />
          <Text style={styles.acceptedText} numberOfLines={1}>
            Accepted by Recycler
          </Text>
        </View>
      );
    case 'REJECTED':
      return (
        <View style={[styles.badge, styles.cancelledBadge]}>
          <XCircle size={12} color="#be123c" style={styles.icon} />
          <Text style={styles.cancelledText} numberOfLines={1}>
            Rejected by Recycler
          </Text>
        </View>
      );
    case 'PENDING_HANDOVER':
    case 'HANDOVER_IN_PROGRESS':
    case 'VERIFIED':
      return (
        <View style={[styles.badge, styles.pendingBadge]}>
          <Clock size={12} color="#b45309" style={styles.icon} />
          <Text style={styles.pendingText} numberOfLines={1}>
            {t('status.pendingHandover')}
          </Text>
        </View>
      );
    case 'COMPLETED':
    case 'PAID':
      return (
        <View style={[styles.badge, styles.completedBadge]}>
          <CheckCircle2 size={12} color="#047857" style={styles.icon} />
          <Text style={styles.completedText} numberOfLines={1}>
            {t('status.verifiedPaid')}
          </Text>
        </View>
      );
    case 'CANCELLED':
      return (
        <View style={[styles.badge, styles.cancelledBadge]}>
          <XCircle size={12} color="#be123c" style={styles.icon} />
          <Text style={styles.cancelledText} numberOfLines={1}>
            {t('status.cancelled')}
          </Text>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  pendingBadge: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
  },
  acceptedBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  acceptedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  completedBadge: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  cancelledBadge: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  cancelledText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9f1239',
  },
});
