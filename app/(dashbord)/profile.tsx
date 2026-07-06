import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";
import { logOut } from "@/service/authService";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const handleLogOut = async () => {
    try {
      showLoader();
      await logOut();
      hideLoader();

      Alert.alert("Success", "Logged out successfully!");
      router.replace("/login");
    } catch (error) {
      hideLoader();
      Alert.alert("Error", "Logout වෙන්න බැරි වුනා.");
    }
  };

  return (
    <View className="flex-1 bg-stone-100 p-6 justify-between pt-14">
      {/* Top Profile Content Section */}
      <View className="items-center mt-4">
        {/* Title */}
        <Text className="text-2xl font-black text-stone-800 self-start mb-8">
          My Profile
        </Text>

        <View className="bg-blue-800 w-24 h-24 rounded-full justify-center items-center shadow-md mb-4">
          <FontAwesome name="user" size={45} color="white" />
        </View>

        <Text className="text-xl font-black text-stone-800">
          {user?.displayName || "Weather User"}
        </Text>
        <Text className="text-sm text-stone-500 font-medium mt-1 mb-8">
          {user?.email || "user@email.com"}
        </Text>

        <View className="w-full bg-white p-5 rounded-3xl shadow-sm border border-stone-200/60">
          {/* Full Name Row */}
          <View className="flex-row items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <View className="flex-row items-center">
              <FontAwesome
                name="vcard-o"
                size={18}
                color="#1e40af"
                className="mr-3"
              />
              <Text className="text-stone-700 font-bold text-sm ml-2">
                Full Name
              </Text>
            </View>
            <Text className="text-stone-500 text-sm font-semibold">
              {user?.displayName || "Not Setup"}
            </Text>
          </View>

          {/* Email Address Row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FontAwesome
                name="envelope-o"
                size={18}
                color="#1e40af"
                className="mr-3"
              />
              <Text className="text-stone-700 font-bold text-sm ml-2">
                Email Address
              </Text>
            </View>
            <Text className="text-stone-500 text-sm font-semibold">
              {user?.email
                ? user.email.length > 20
                  ? `${user.email.substring(0, 18)}...`
                  : user.email
                : "Not Setup"}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button  */}
      <TouchableOpacity
        className="bg-red-600 p-4 rounded-2xl items-center mb-6 shadow-sm active:opacity-80"
        onPress={handleLogOut}
      >
        <Text className="text-white font-black text-base tracking-wide">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
