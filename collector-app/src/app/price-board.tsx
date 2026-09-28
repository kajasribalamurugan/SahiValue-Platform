import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { TrendingUp, Search, PlusCircle, Sparkles } from 'lucide-react-native';

export default function PriceBoardScreen() {
  const router = useRouter();
  const { t, getBilingualMaterial, getTranslatedMaterialDesc } = useLanguage();
  const { materials, setDraftMaterial } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = materials.filter((m) => {
    const bilingual = getBilingualMaterial(m.id, m.name);
    const query = searchQuery.toLowerCase();
    return (
      bilingual.primary.toLowerCase().includes(query) ||
      (bilingual.secondary && bilingual.secondary.toLowerCase().includes(query)) ||
      m.category.toLowerCase().includes(query)
    );
  });

  const handleSellMaterial = (id: string) => {
    setDraftMaterial(id);
    router.push('/declared-weight');
  };

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('priceBoard.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Title Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{t('priceBoard.title')}</Text>
              <Text style={styles.subtitle}>{t('priceBoard.subtitle')}</Text>
            </View>
            <View style={styles.liveBadge}>
              <Sparkles size={12} color="#047857" />
              <Text style={styles.liveBadgeText}>{t('priceBoard.liveBadge')}</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('common.searchPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Material Price Cards List */}
        <View style={styles.materialsList}>
          {filteredMaterials.map((m) => {
            const bilingual = getBilingualMaterial(m.id, m.name);
            const desc = getTranslatedMaterialDesc(m.id, m.description);

            return (
              <View key={m.id} style={styles.matCard}>
                <View style={styles.matCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.matPrimaryName}>{bilingual.primary}</Text>
                    {bilingual.secondary && (
                      <Text style={styles.matSecondaryName}>{bilingual.secondary}</Text>
                    )}
                    <Text style={styles.catTag}>{m.category}</Text>
                  </View>

                  <View style={styles.priceBox}>
                    <Text style={styles.priceAmount}>₹{m.pricePerKg}</Text>
                    <Text style={styles.priceUnit}>/ kg</Text>
                  </View>
                </View>

                <Text style={styles.descText}>{desc}</Text>

                <View style={styles.matCardFooter}>
                  <Text style={styles.metaText}>
                    {m.co2SavedPerKg} {t('material.co2Saved')} • {m.metalRecoveryRate}
                  </Text>

                  <Pressable
                    style={styles.sellBtn}
                    onPress={() => handleSellMaterial(m.id)}
                  >
                    <PlusCircle size={14} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.sellBtnText}>{t('priceBoard.sellBtn')}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
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
  headerCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  headerRow: {
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
    flexShrink: 0,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
  },

  searchBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },

  materialsList: {
    width: '100%',
    gap: 12,
  },
  matCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  matCardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
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
  catTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  priceBox: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857',
  },
  priceUnit: {
    fontSize: 10,
    color: '#64748b',
  },

  descText: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 10,
  },

  matCardFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    flex: 1,
    flexShrink: 1,
  },
  sellBtn: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  sellBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
});
