import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BilingualText } from '../components/BilingualText';
import { ShieldCheck, MapPin, Star, CheckCircle2, ArrowRight, Info } from 'lucide-react-native';

export default function RecyclerListScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { recyclers, draftLot, setDraftRecycler, createLotFromDraft } = useApp();

  const [selectedId, setSelectedId] = useState<string>(
    draftLot.recyclerId || recyclers[0].id
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDraftRecycler(id);
  };

  const handleCreateLot = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setDraftRecycler(selectedId);
      const createdLot = await createLotFromDraft();
      if (createdLot) {
        router.push(`/lot-details/${createdLot.id}` as any);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('recyclerList.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepBadge}>{t('recyclerList.step')}</Text>
          <Text style={styles.stepTitle}>{t('recyclerList.stepHeader')}</Text>
        </View>

        <Text style={styles.title}>{t('recyclerList.title')}</Text>
        <Text style={styles.subtitle}>{t('recyclerList.subtitle')}</Text>

        {/* Demo Disclaimer Banner */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Info size={16} color="#b45309" />
            <Text style={styles.disclaimerTitle}>{t('recyclerList.disclaimerTitle')}</Text>
          </View>
          <Text style={styles.disclaimerDesc}>{t('recyclerList.disclaimerDesc')}</Text>
        </View>

        {/* Recyclers List */}
        <View style={styles.recyclersList}>
          {recyclers.map((r) => {
            const isSelected = selectedId === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.recCard, isSelected && styles.recCardSelected]}
                onPress={() => handleSelect(r.id)}
              >
                <View style={styles.recHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <BilingualText
                      officialName={r.officialName || r.name}
                      localHi={r.displayName?.hi}
                      localMr={r.displayName?.mr}
                      primaryStyle={styles.recPrimary}
                      secondaryStyle={styles.recSecondary}
                    />

                    {r.cpcbAuthorized && (
                      <View style={styles.cpcbBadge}>
                        <ShieldCheck size={12} color="#047857" />
                        <Text style={styles.cpcbBadgeText}>{t('recyclerList.cpcbVerified')}</Text>
                      </View>
                    )}
                  </View>

                  {isSelected && <CheckCircle2 size={22} color="#059669" />}
                </View>

                <View style={styles.addressRow}>
                  <MapPin size={13} color="#94a3b8" style={{ marginTop: 2 }} />
                  <Text style={styles.addressText}>{r.address}</Text>
                </View>

                <View style={styles.recFooter}>
                  <View style={styles.ratingRow}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {r.rating} <Text style={{ color: '#94a3b8' }}>({r.reviewsCount})</Text>
                    </Text>
                    <Text style={styles.distanceText}>• {r.distance}</Text>
                  </View>

                  {r.rateBonusPercent > 0 ? (
                    <View style={styles.bonusTag}>
                      <Text style={styles.bonusTagText}>
                        +{r.rateBonusPercent}% {t('recyclerList.rateBonus')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.standardTag}>
                      <Text style={styles.standardTagText}>{t('recyclerList.standardRate')}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Primary Action CTA Button */}
        <Pressable style={styles.primaryBtn} onPress={handleCreateLot}>
          <Text style={styles.primaryBtnText}>{t('recyclerList.createLotBtn')}</Text>
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
    marginBottom: 14,
  },

  disclaimerCard: {
    width: '100%',
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  disclaimerHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
    flex: 1,
    flexShrink: 1,
  },
  disclaimerDesc: {
    fontSize: 11,
    color: '#78350f',
    lineHeight: 16,
  },

  recyclersList: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  recCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recCardSelected: {
    borderColor: '#059669',
    borderWidth: 2,
    backgroundColor: '#ecfdf5',
  },
  recHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recPrimary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  recSecondary: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  cpcbBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 2,
  },
  cpcbBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065f46',
  },

  addressRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },

  recFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  distanceText: {
    fontSize: 11,
    color: '#64748b',
  },

  bonusTag: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  bonusTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  standardTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  standardTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
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
