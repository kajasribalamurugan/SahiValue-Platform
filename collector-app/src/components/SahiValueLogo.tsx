import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recycle } from 'lucide-react-native';

interface SahiValueLogoProps {
  compact?: boolean;
  tagline?: string;
}

export const SahiValueLogo: React.FC<SahiValueLogoProps> = ({
  compact = false,
  tagline = 'Kabaad ka Sahi Value',
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.logoIconBadge, compact && styles.logoIconBadgeCompact]}>
        <Recycle size={compact ? 18 : 22} color="#ffffff" strokeWidth={2.5} />
      </View>
      <View style={styles.brandTextCol}>
        <View style={styles.brandTitleRow}>
          <Text style={[styles.brandTitle, compact && styles.brandTitleCompact]}>
            SAHI VALUE
          </Text>
          <View style={styles.collectorPill}>
            <Text style={styles.collectorPillText}>COLLECTOR</Text>
          </View>
        </View>
        {!compact && tagline ? (
          <Text style={styles.taglineText}>{tagline}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#34d399',
  },
  logoIconBadgeCompact: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  brandTitleCompact: {
    fontSize: 15,
  },
  collectorPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  collectorPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
    letterSpacing: -0.1,
  },
});
