import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n/LanguageContext';
import { Home, Plus, PackageCheck, Wallet, User } from 'lucide-react-native';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  // Route mapping by name for easy lookup
  const routesByName = state.routes.reduce((acc: any, route: any, index: number) => {
    acc[route.name] = { route, index };
    return acc;
  }, {});

  const renderTab = (routeName: string, labelKey: string, IconComponent: any) => {
    const routeInfo = routesByName[routeName];
    if (!routeInfo) return null;

    const { route, index } = routeInfo;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={styles.tabItem}
        android_ripple={{ color: '#ecfdf5', borderless: true }}
      >
        <IconComponent size={21} color={isFocused ? '#059669' : '#64748b'} />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
          {t(labelKey)}
        </Text>
      </Pressable>
    );
  };

  const renderCenterSellBtn = () => {
    const routeInfo = routesByName['add-ewaste'];
    if (!routeInfo) return null;

    const { route, index } = routeInfo;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={styles.centerAddContainer}
        android_ripple={{ color: '#047857', borderless: true, radius: 28 }}
      >
        <View style={[styles.centerAddCircle, isFocused && styles.centerAddCircleActive]}>
          <Plus size={26} color="#ffffff" strokeWidth={2.8} />
        </View>
        <Text style={[styles.centerAddLabel, isFocused && styles.centerAddLabelActive]} numberOfLines={1}>
          {t('nav.addEWaste')}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
      {/* 1. Left Group: Home & My Lots */}
      <View style={styles.tabGroup}>
        {renderTab('index', 'nav.home', Home)}
        {renderTab('my-lots', 'nav.myLots', PackageCheck)}
      </View>

      {/* 2. Center Action: Sell E-Waste */}
      <View style={styles.centerSlot}>
        {renderCenterSellBtn()}
      </View>

      {/* 3. Right Group: Earnings & Profile */}
      <View style={styles.tabGroup}>
        {renderTab('earnings', 'nav.earnings', Wallet)}
        {renderTab('profile', 'nav.profile', User)}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('nav.home') }} />
      <Tabs.Screen name="my-lots" options={{ title: t('nav.myLots') }} />
      <Tabs.Screen name="add-ewaste" options={{ title: t('nav.addEWaste') }} />
      <Tabs.Screen name="earnings" options={{ title: t('nav.earnings') }} />
      <Tabs.Screen name="profile" options={{ title: t('nav.profile') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    paddingHorizontal: 4,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#059669',
    fontWeight: '800',
  },

  centerSlot: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAddContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  centerAddCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  centerAddCircleActive: {
    backgroundColor: '#047857',
    transform: [{ scale: 1.05 }],
  },
  centerAddLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
    textAlign: 'center',
  },
  centerAddLabelActive: {
    color: '#047857',
  },
});
