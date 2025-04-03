import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "react-native";
import Store from "@/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { auth } from "@/lib/firebaseService";
import { onAuthStateChanged } from "firebase/auth";
import { setLoggedIn, setLoading, setUser } from "@/redux/slices/authSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [fontLoaded, error] = useFonts({
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={Store}>
        {/* <GlobalProvider> */}
        <GestureHandlerRootView className="flex-1">
          <App />
        </GestureHandlerRootView>
        {/* </GlobalProvider> */}
      </Provider>
    </ThemeProvider>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            emailVerified: user.emailVerified,
          })
        );
        dispatch(setLoggedIn(true));
      } else {
        dispatch(setLoggedIn(false));
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [dispatch]);

  return (
    <SafeAreaView className="h-full bg-primary">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
};

export default RootLayout;
