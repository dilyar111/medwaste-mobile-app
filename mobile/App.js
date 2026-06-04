import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { API_BASE_URL } from './src/config/api';
import {
  getResponsivePagePadding,
  getScreenProfile,
  sizes,
  spacing,
  typography,
} from './src/theme/responsive';
import {
  restoreDriverTracking,
  startDriverTracking,
  stopDriverTracking,
} from './src/services/driverTracking';

function normalizeWebAppUrl(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  return raw.trim();
}

const WEB_APP_URL = normalizeWebAppUrl(process.env.EXPO_PUBLIC_WEB_APP_URL);

if (!WEB_APP_URL) {
  throw new Error(
    'EXPO_PUBLIC_WEB_APP_URL is not set. Point it to your deployed Vite SPA (HTTPS), e.g. https://app.example.com'
  );
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const screen = getScreenProfile(width, height);
  const pagePadding = getResponsivePagePadding(width, height);
  const bridgeScript = useMemo(() => `
    (function () {
      if (window.__MW_TRACKING_BRIDGE__) return;
      window.__MW_TRACKING_BRIDGE__ = true;
      var lastRouteId = null;
      var apiBase = ${JSON.stringify(API_BASE_URL)};

      async function checkTracking() {
        try {
          var token = window.sessionStorage.getItem('mw_token');
          var role = window.sessionStorage.getItem('mw_role');
          if (!token || role !== 'driver') {
            lastRouteId = null;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'tracking:stop' }));
            return;
          }

          var response = await fetch(apiBase + '/api/drivers/tasks', {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (!response.ok) return;
          var tasks = await response.json();
          var active = Array.isArray(tasks)
            ? tasks.find(function (task) { return task.status === 'in_transit' || task.status === 'at_utilization'; })
            : null;

          if (active && active.id !== lastRouteId) {
            lastRouteId = active.id;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'tracking:start',
              routeId: active.id,
              token: token
            }));
          } else if (!active && lastRouteId) {
            lastRouteId = null;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'tracking:stop' }));
          }
        } catch (err) {}
      }

      checkTracking();
      var intervalId = window.setInterval(checkTracking, 10000);
      window.addEventListener('pagehide', function () {
        window.clearInterval(intervalId);
      });
    })();
    true;
  `, []);

  useEffect(() => {
    restoreDriverTracking();
    return () => {
      stopDriverTracking();
    };
  }, []);

  const handleMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'tracking:start') {
        await startDriverTracking({ routeId: message.routeId, token: message.token });
      }
      if (message.type === 'tracking:stop') {
        await stopDriverTracking();
      }
    } catch {}
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
        <StatusBar style="dark" translucent={false} />
        <WebView
          style={styles.webview}
          source={{ uri: WEB_APP_URL }}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          injectedJavaScript={bridgeScript}
          onMessage={handleMessage}
          originWhitelist={['https://', 'http://']}
          renderError={() => (
            <ScrollView
              contentContainerStyle={[
                styles.errorScroll,
                {
                  padding: pagePadding,
                  minHeight: height,
                },
                screen.landscape && styles.errorScrollLandscape,
              ]}
            >
              {/* Scrollable, bounded error content prevents clipping on short landscape and small Android screens. */}
              <View style={[styles.errorWrap, screen.tablet && styles.errorWrapTablet]}>
                <Text style={styles.errorTitle}>Cannot open MedWaste UI</Text>
                <Text style={styles.errorText}>The web app URL from EXPO_PUBLIC_WEB_APP_URL could not be loaded.</Text>
                <Text style={styles.url}>{WEB_APP_URL}</Text>
                <Text style={styles.errorHint}>Verify the URL is reachable over HTTPS and rebuild the app with the correct env.</Text>
              </View>
            </ScrollView>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  errorScrollLandscape: {
    justifyContent: 'flex-start',
  },
  errorWrap: {
    width: '100%',
    maxWidth: sizes.errorMaxWidth,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorWrapTablet: {
    maxWidth: sizes.tabletContentMaxWidth,
  },
  errorTitle: {
    fontSize: typography.bodyLg,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.body,
    color: '#334155',
    textAlign: 'center',
  },
  errorHint: {
    marginTop: spacing.xxs,
    fontSize: typography.error,
    color: '#64748b',
    textAlign: 'center',
  },
  url: {
    fontSize: typography.body,
    fontWeight: '600',
    color: '#2563eb',
    textAlign: 'center',
  },
});
