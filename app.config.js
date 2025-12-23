export default {
  name: "phasicon_app",
  slug: "phasicon_app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "phasiconapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.ashuji2004.phasiconapp",
  },

  android: {
    package: "com.ashuji2004.phasiconapp",
    edgeToEdgeEnabled: true,
    versionCode: 1,
    usesCleartextTraffic: true,
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundColor: "#E6F4FE",
    },
    softwareKeyboardLayoutMode: "resize"
  },

  androidStatusBar: {
    barStyle: "light-content",
    backgroundColor: "#00000000",
    translucent: true,
  },

  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    eas: {
      projectId: "483d4450-a788-4605-b3bf-7d2700b1ad15",
    },
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
};
