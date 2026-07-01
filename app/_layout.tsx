import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoderContext";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

// This file same like react App.tsx
const RootLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <LoaderProvider>
      <AuthProvider>
        <View className="flex-1" style={{ marginTop: insets.top }}>
          <Slot />
        </View>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default RootLayout;
