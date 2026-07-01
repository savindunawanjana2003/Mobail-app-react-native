import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="login"
        
      />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
