import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Bell, CheckCheck, Receipt, TrendingUp, ShieldCheck, Info } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const renderIcon = (type: string) => {
    switch (type) {
      case 'SETTLEMENT':
        return <Receipt size={18} color="#059669" />;
      case 'PRICE_UPDATE':
        return <TrendingUp size={18} color="#2563eb" />;
      case 'COMPLIANCE':
        return <ShieldCheck size={18} color="#b45309" />;
      default:
        return <Info size={18} color="#64748b" />;
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header showBack title={t('notifications.title')} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Title & Actions Bar */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{t('notifications.title')}</Text>
              <Text style={styles.subtitle}>{t('notifications.subtitle')}</Text>
            </View>

            <Pressable style={styles.markAllBtn} onPress={markAllNotificationsRead}>
              <CheckCheck size={14} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.markAllBtnText}>{t('notifications.markAll')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Bell size={36} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
              onPress={() => {
                markNotificationRead(item.id);
                if (item.lotId) {
                  router.push(`/digital-receipt/${item.lotId}` as any);
                }
              }}
            >
              <View style={styles.notifHeaderRow}>
                <View style={styles.iconBox}>{renderIcon(item.type)}</View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                    {item.title}
                  </Text>
                  <Text style={styles.notifDate}>{item.date}</Text>
                </View>

                {!item.read && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.notifMessage}>{item.message}</Text>
            </Pressable>
          ))
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
    alignItems: 'center',
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
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    flexShrink: 0,
  },
  markAllBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },

  notifCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  notifCardUnread: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  notifTitleUnread: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  notifDate: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  notifMessage: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
});
