import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Bell, Globe, Recycle, Check, ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ showBack = false, title }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguage();
  const { unreadNotificationsCount } = useApp();

  const [langModalVisible, setLangModalVisible] = useState(false);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default' },
    { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  ];

  return (
    <>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <View style={styles.leftSection}>
          {showBack ? (
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color="#334155" />
            </Pressable>
          ) : (
            <View style={styles.brandIconContainer}>
              <Recycle size={20} color="#ffffff" />
            </View>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.brandTitle} numberOfLines={1}>
              {title || t('app.title')}
            </Text>
            <Text style={styles.brandTagline} numberOfLines={1}>
              {title ? t('app.verifiedNetwork') : t('app.tagline')}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {/* Language Selector Button */}
          <Pressable style={styles.langButton} onPress={() => setLangModalVisible(true)}>
            <Globe size={15} color="#059669" />
            <Text style={styles.langText}>
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिंदी' : 'मराठी'}
            </Text>
          </Pressable>

          {/* Notification Bell Icon */}
          <Pressable style={styles.bellButton} onPress={() => router.push('/notifications')}>
            <Bell size={19} color="#334155" />
            {unreadNotificationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Language Selector Modal */}
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

            <Pressable style={styles.closeButton} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  brandIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  langButton: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 4,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
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
  closeButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
});
