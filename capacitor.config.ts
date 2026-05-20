import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Production panel URL — app WebView-də bu saytı açır.
 * Lokal test: CAPACITOR_SERVER_URL=http://10.0.2.2:3000 cap sync
 * (Android emulator üçün host maşının localhost-u)
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? "https://suman.khamsacraft.az";

const config: CapacitorConfig = {
  appId: "az.khamsacraft.suman.owner",
  appName: "SUMAN Owner",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#0b6e99",
      showSpinner: true,
      spinnerColor: "#ffffff",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0b6e99",
    },
  },
};

export default config;
