import { ConfigContext, ExpoConfig } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

let AndroidGoogleServicesFile = "./google-services-prod.json"; // while developing this file will be the default.
let GoogleServiceInfoPlist = "./GoogleService-Info-prod.plist";

// then checking which env we are, and based on that choosing
// the right Google services file to add
if (IS_DEV) {
  AndroidGoogleServicesFile = "./google-services-dev.json";
  GoogleServiceInfoPlist = "./GoogleService-Info-dev.plist";
}

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.rnstarterkit.dev";
  }

  if (IS_PREVIEW) {
    return "com.rnstarterkit.preview";
  }

  return "com.rnstarterkit";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Starter Kit (Dev)";
  }

  if (IS_PREVIEW) {
    return "Starter Kit (Preview)";
  }

  return "Starter Kit";
};

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: getAppName(),
    slug: "rn-starter-kit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./lib/assets/images/icon.png",
    scheme: "exp+starter-kit",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: GoogleServiceInfoPlist,
      bundleIdentifier: getUniqueIdentifier(),
      entitlements: {
        "aps-environment": "production",
      },
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./lib/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: AndroidGoogleServicesFile,
      package: getUniqueIdentifier(),
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./lib/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./lib/assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          android: {
            useLegacyPackaging: true,
          },
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      APP_VARIANT: process.env.APP_VARIANT,
      router: {
        origin: false,
      },
      eas: {
        projectId: "eb2d5c02-2391-45c4-9ae5-8f0702d7d37b",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/f4ae319b-dd4f-4dde-96eb-61a40a5d5607",
    },
    owner: "rn-starter-kit",
  };
};
