import { Redirect, Stack } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.email) return <Redirect href="/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};

export default AuthLayout;
