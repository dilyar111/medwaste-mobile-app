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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { width, height } = useWindowDimensions();
  const screen = getScreenProfile(width, height);
  const pagePadding = getResponsivePagePadding(width, height);
  const formMaxWidth = getFormMaxWidth(width);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmitForm = async () => {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!/^[A-Za-z0-9_-]{3,30}$/.test(username)) {
      setError('Username must be 3-30 characters and only contain letters, numbers, underscores, or hyphens.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), username.trim(), email.trim(), password);
      setSuccess('Account created. You can log in now.');
      setTimeout(() => navigation.replace('Login'), 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
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
          {/* Registration has the tallest form, so scrolling is required to prevent keyboard and short-screen overflow. */}
          <View style={[styles.form, { maxWidth: formMaxWidth }]}>
            <Text style={[styles.title, screen.small && styles.titleSmall]}>Create Account</Text>
            <Text style={styles.subtitle}>Register a new MedWaste account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

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

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {!!error && <Text style={styles.error}>{error}</Text>}
            {!!success && <Text style={styles.success}>{success}</Text>}

            <Pressable style={styles.button} onPress={onSubmitForm} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </Pressable>

            {/* The footer wraps so long translations or larger text settings do not push outside narrow screens. */}
            <View style={styles.row}>
              <Text style={styles.muted}>Already have an account?</Text>
              <Pressable style={styles.linkHitArea} onPress={() => navigation.replace('Login')}>
                <Text style={styles.link}> Log In</Text>
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
  success: { color: '#22C55E', fontSize: typography.error, marginBottom: spacing.md },
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
