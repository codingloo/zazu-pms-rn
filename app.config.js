module.exports = {
  expo: {
    name: "Personal Manager",
    slug: "personal-manager",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "personal-manager",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#085041"
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourname.personalmanager",
      infoPlist: {
        NSFaceIDUsageDescription: "Use Face ID to securely access your personal data"
      }
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#085041"
      },
      package: "com.yourname.personalmanager",
      permissions: ["USE_BIOMETRIC", "USE_FINGERPRINT"]
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    },

    plugins: [
      "expo-router",
      "expo-sqlite",
      "expo-secure-store",
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow Personal Manager to use Face ID."
        }
      ]
    ],

    experiments: {
      typedRoutes: true
    }
  }
};
