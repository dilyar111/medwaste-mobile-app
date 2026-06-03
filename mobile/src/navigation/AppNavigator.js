import React from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { getResponsivePagePadding } from '../theme/responsive';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const { width, height } = useWindowDimensions();
  const pagePadding = getResponsivePagePadding(width, height);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingPage} edges={['top', 'right', 'bottom', 'left']}>
          {/* Shared padding keeps the loading screen away from notches and foldable hinges. */}
          <View style={[styles.loadingContent, { padding: pagePadding }]}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingPage: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
