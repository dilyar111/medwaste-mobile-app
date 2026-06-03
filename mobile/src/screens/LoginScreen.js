import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import {
  borders,
  getFormMaxWidth,
  getResponsivePagePadding,
  getScreenProfile,
  radius,
  sizes,
  spacing,
  typography,
} from '../theme/responsive';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { width, height } = useWindowDimensions();
  const screen = getScreenProfile(width, height);
  const pagePadding = getResponsivePagePadding(width, height);
  const formMaxWidth = getFormMaxWidth(width);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.replace('Home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page} edges={['top', 'right', 'bottom', 'left']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
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
          {/* The bounded form keeps phone layouts full-width while preventing stretched tablet fields. */}
          <View style={[styles.form, { maxWidth: formMaxWidth }]}>
            <Text style={[styles.title, screen.small && styles.titleSmall]}>MedWaste</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
            </Pressable>

            {/* Wrapping footer text avoids clipping when accessibility text sizes or narrow screens are used. */}
            <View style={styles.row}>
              <Text style={styles.muted}>No account?</Text>
              <Pressable style={styles.linkHitArea} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}> Register</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#020617' },
  keyboard: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContentLandscape: {
    justifyContent: 'flex-start',
  },
  form: {
    width: '100%',
    alignSelf: 'center',
  },
  title: { color: '#fff', fontSize: typography.titleLg, fontWeight: '700', marginBottom: spacing.sm },
  titleSmall: { fontSize: typography.title },
  subtitle: { color: '#94A3B8', fontSize: typography.body, marginBottom: spacing.xl },
  hint: { color: '#94A3B8', fontSize: typography.body, marginBottom: spacing.md, textAlign: 'center' },
  input: {
    minHeight: sizes.inputMinHeight,
    borderWidth: borders.hairline,
    borderColor: '#334155',
    borderRadius: radius.lg,
    color: '#fff',
    fontSize: typography.body,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#0F172A',
    marginBottom: spacing.md,
  },
  error: { color: '#EF4444', fontSize: typography.error, marginBottom: spacing.md },
  button: {
    minHeight: sizes.buttonMinHeight,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    marginTop: spacing.xxs,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: borders.hairline,
    borderColor: '#334155',
    marginTop: spacing.md,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: typography.button },
  buttonGhostText: { color: '#60A5FA', fontWeight: '700', fontSize: typography.button },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  muted: { color: '#94A3B8', fontSize: typography.body },
  linkHitArea: { minHeight: sizes.minTouchTarget, justifyContent: 'center' },
  link: { color: '#60A5FA', fontWeight: '700', fontSize: typography.body },
});
