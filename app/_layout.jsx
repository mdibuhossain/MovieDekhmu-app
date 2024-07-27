import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalProvider from "../context/GlobalProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../tamagui.config";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [fontLoaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    "MavenPro-Bold": require("../assets/fonts/MavenPro-Bold.ttf"),
    "MavenPro-Black": require("../assets/fonts/MavenPro-Black.ttf"),
    "MavenPro-Medium": require("../assets/fonts/MavenPro-Medium.ttf"),
    "MavenPro-Regular": require("../assets/fonts/MavenPro-Regular.ttf"),
    "MavenPro-SemiBold": require("../assets/fonts/MavenPro-SemiBold.ttf"),
    "MavenPro-ExtraBold": require("../assets/fonts/MavenPro-ExtraBold.ttf"),
    "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, error]);

  if (!fontLoaded) return null;

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GlobalProvider>
          {/* <GestureHandlerRootView className="flex-1"> */}
          <SafeAreaView className="h-full bg-primary">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </SafeAreaView>
          {/* </GestureHandlerRootView> */}
        </GlobalProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
};

export default RootLayout;
