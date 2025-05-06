import "@/lib/utils/nativewind";
import RootContextProvider from "@/lib/contexts/root.context";
import { useFonts } from "expo-font";
import "@/lib/styles/global.css";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import merge from "deepmerge";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { SessionProvider } from "@/lib/contexts/auth.context";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import { Colors } from "@/lib/constants/Colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  useSecondaryBackgroundColor,
  useThemeColor,
} from "@/lib/hooks/useThemeColor";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };
const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;
  const secondaryBackground = useSecondaryBackgroundColor();

  const backgroundColor = useThemeColor({}, "background") as string;
  const [loaded] = useFonts({
    SpaceMono: require("../lib/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <RootContextProvider>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider value={paperTheme as any}>
            <SessionProvider>
              <BottomSheetModalProvider>
                <SafeAreaProvider>
                  <SafeAreaView
                    style={{
                      backgroundColor: secondaryBackground,
                    }}
                    edges={["top", "left", "right"]}
                  />
                  <Slot
                    screenOptions={{
                      headerShown: false,
                      backgroundColor: backgroundColor,
                    }}
                  />
                  <StatusBar style="auto" />
                  <Toast position="bottom" bottomOffset={30} />
                </SafeAreaProvider>
              </BottomSheetModalProvider>
            </SessionProvider>
          </ThemeProvider>
        </PaperProvider>
      </RootContextProvider>
    </GestureHandlerRootView>
  );
}
