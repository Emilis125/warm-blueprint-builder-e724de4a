import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tiptrackerpro.app',
  appName: 'TipTracker Pro',
  webDir: 'dist/client',
  server: {
    url: 'https://warm-blueprint-builder.lovable.app',
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0B1120',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B1120',
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'TipTracker Pro',
  },
  android: {
    backgroundColor: '#0B1120',
  },
};

export default config;
