import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { BilingualText } from '../../components/BilingualText';
import { Language } from '../../types';
import {
  User,
  ShieldCheck,
  MapPin,
  Globe,
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  LogOut
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { totalEarnings, totalVerifiedWeight, completedLotsCount, collectorProfile } = useApp();
  const { user, logout } = useAuth();

  const [langModalVisible, setLangModalVisible] = useState(false);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default' },
    { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  ];

  const displayName = user?.name || collectorProfile.officialName;
  const displayZone = user?.location || collectorProfile.zone;

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarRow}>
            <View style={styles.avatarCircle}>
              <User size={28} color="#059669" />
            </View>

            <View style={styles.profileMeta}>
              <View style={styles.nameRow}>
                <BilingualText
                  officialName={displayName}
                  localHi={collectorProfile.displayName.hi}
                  localMr={collectorProfile.displayName.mr}
                  primaryStyle={styles.collectorNamePrimary}
                  secondaryStyle={styles.collectorNameSecondary}
                />
                <View style={styles.verifiedTag}>
                  <ShieldCheck size={12} color="#047857" />
                  <Text style={styles.verifiedTagText}>{t('profile.verified')}</Text>
                </View>
              </View>

              <View style={styles.zoneRow}>
                <MapPin size={13} color="#94a3b8" />
                <Text style={styles.zoneText}>{displayZone}</Text>
              </View>
            </View>
          </View>

          {/* Quick Lifetime Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
              <Text style={styles.statLabel}>{t('profile.earnings')}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statVal}>{totalVerifiedWeight.toFixed(1)} kg</Text>
              <Text style={styles.statLabel}>{t('profile.recycled')}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statVal}>{completedLotsCount}</Text>
              <Text style={styles.statLabel}>{t('profile.batches')}</Text>
            </View>
          </View>
        </View>

        {/* UPI & Bank Account Details */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <CreditCard size={18} color="#059669" />
            <Text style={styles.cardHeading}>{t('profile.upiTitle')}</Text>
          </View>

          <View style={styles.upiBox}>
            <Text style={styles.upiIdText}>{t('profile.upiId')}</Text>
            <Text style={styles.upiNoteText}>Auto-settlement account for CPCB digital receipts</Text>
          </View>
        </View>

        {/* Settings Navigation Menu */}
        <View style={styles.menuCard}>
          {/* Language Selector Item */}
          <Pressable style={styles.menuItem} onPress={() => setLangModalVisible(true)}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#ecfdf5' }]}>
                <Globe size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('profile.langTitle')}</Text>
                <Text style={styles.menuItemSub}>
                  {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी (Hindi)' : 'मराठी (Marathi)'}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Notifications Item */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/notifications')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#eff6ff' }]}>
                <Bell size={18} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('profile.notifications')}</Text>
                <Text style={styles.menuItemSub}>{t('notifications.subtitle')}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Safety & Rules Item */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/safety')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#fffbeb' }]}>
                <ShieldCheck size={18} color="#b45309" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('profile.safetyTitle')}</Text>
                <Text style={styles.menuItemSub}>{t('profile.safetyDesc')}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Logout Item */}
          <Pressable style={styles.menuItem} onPress={logout}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#fef2f2' }]}>
                <LogOut size={18} color="#dc2626" />
              </View>
              <View>
                <Text style={[styles.menuItemTitle, { color: '#dc2626' }]}>Log Out</Text>
                <Text style={styles.menuItemSub}>End active session and exit</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>
        </View>

        {/* App Version Footer */}
        <Text style={styles.versionText}>{t('profile.appVersion')}</Text>

        {/* Language Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={langModalVisible}
          onRequestClose={() => setLangModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setLangModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('profile.langTitle')}</Text>

              {languages.map((item) => {
                const isSelected = language === item.code;
                return (
                  <Pressable
                    key={item.code}
                    style={[styles.langOption, isSelected && styles.langOptionSelected]}
                    onPress={async () => {
                      await setLanguage(item.code);
                      setLangModalVisible(false);
                    }}
                  >
                    <View>
                      <Text style={[styles.langOptionLabel, isSelected && styles.langOptionLabelSelected]}>
                        {item.label}
                      </Text>
                      <Text style={styles.langOptionSub}>{item.sub}</Text>
                    </View>

                    {isSelected && <Check size={20} color="#059669" />}
                  </Pressable>
                );
              })}

              <Pressable style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
                <Text style={styles.closeBtnText}>{t('common.close')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
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
  profileCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  profileAvatarRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileMeta: {
    flex: 1,
    flexShrink: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  collectorNamePrimary: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  collectorNameSecondary: {
    fontSize: 12,
    color: '#64748b',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 2,
    flexShrink: 0,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065f46',
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  zoneText: {
    fontSize: 11,
    color: '#64748b',
  },

  statsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    flexShrink: 1,
  },
  upiBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  upiIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  upiNoteText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  menuCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    gap: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    flexShrink: 1,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  menuItemSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 10,
  },

  versionText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  langOptionSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
  },
  langOptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  langOptionLabelSelected: {
    color: '#047857',
  },
  langOptionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  closeBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
});
