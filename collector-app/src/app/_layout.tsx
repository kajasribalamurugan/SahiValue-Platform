import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../i18n/LanguageContext';
import { AppProvider } from '../context/AppContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if user is not authenticated and trying to access protected screens
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to Home tabs if user is authenticated and trying to access login/register
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="material-category" options={{ headerShown: false }} />
      <Stack.Screen name="declared-weight" options={{ headerShown: false }} />
      <Stack.Screen name="estimate" options={{ headerShown: false }} />
      <Stack.Screen name="recycler-list" options={{ headerShown: false }} />
      <Stack.Screen name="lot-details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="digital-handover/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="digital-receipt/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="price-board" options={{ headerShown: false }} />
      <Stack.Screen name="safety" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <RootNavigation />
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
