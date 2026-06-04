import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import {
  borders,
  getResponsivePagePadding,
  getScreenProfile,
  radius,
  sizes,
  spacing,
  typography,
} from '../theme/responsive';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { width, height } = useWindowDimensions();
  const screen = getScreenProfile(width, height);
  const pagePadding = getResponsivePagePadding(width, height);

  return (
    <SafeAreaView style={styles.page} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: pagePadding,
            paddingVertical: screen.small ? spacing.lg : pagePadding,
            minHeight: height,
          },
          screen.landscape && styles.scrollContentLandscape,
        ]}
      >
        {/* Max width keeps cards readable on tablets and foldables instead of stretching edge to edge. */}
        <View style={[styles.container, screen.tablet && styles.containerTablet]}>
          <Text style={[styles.title, screen.small && styles.titleSmall]}>MedWaste Mobile</Text>
          <Text style={styles.subtitle}>You are logged in successfully.</Text>

          <View style={styles.card}>
            <Text style={styles.item}>Name: {user?.fullName || '-'}</Text>
            <Text style={styles.item}>Email: {user?.email || '-'}</Text>
            <Text style={styles.item}>Role: {user?.role || '-'}</Text>
          </View>

          <Pressable style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#020617' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContentLandscape: {
    justifyContent: 'flex-start',
  },
  container: {
    width: '100%',
  },
  containerTablet: {
    maxWidth: sizes.tabletContentMaxWidth,
  },
  title: { color: '#fff', fontSize: typography.title, fontWeight: '700', marginBottom: spacing.sm },
  titleSmall: { fontSize: typography.bodyLg },
  subtitle: { color: '#94A3B8', fontSize: typography.body, marginBottom: spacing.lg },
  card: {
    backgroundColor: '#0F172A',
    borderWidth: borders.hairline,
    borderColor: '#334155',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  item: { color: '#E2E8F0', fontSize: typography.bodyLg, marginBottom: spacing.sm },
  button: {
    minHeight: sizes.buttonMinHeight,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    marginTop: spacing.lg,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: typography.button },
});
