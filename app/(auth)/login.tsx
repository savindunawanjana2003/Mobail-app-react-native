import { login } from "@/service/authService";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) {
      alert("Please enter your email address!");
      return;
    }
    if (!password.trim()) {
      alert("Please enter your password!");
      return;
    }

    try {
      const userCredential = await login(email, password);
      console.log("Success! User ID:", userCredential.user.uid);
      router.replace("../(dashbord)/Home");
    } catch (error: any) {
      console.log("Firebase Error Code:", error.code);

      switch (error.code) {
        case "auth/invalid-email":
          alert("ඔයා දාපු Email format එක වැරදියි! (e.g., user@gmail.com)");
          break;
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          alert("ඇතුලත් කල Email එක හෝ Password එක වැරදියි!");
          break;
        case "auth/missing-password":
          alert("Password එක ඇතුලත් කර නැත!");
          break;
        case "auth/too-many-requests":
          alert("වැරදි password ගොඩක් ගැහුවා. ඩිංගක් වෙලා ඉඳලා try කරන්න!");
          break;
        default:
          alert("An unknown error occurred: " + error.message);
          break;
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="w-full bg-white/50 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold mb-6 text-center text-gray-900">
            Login
          </Text>
          <TextInput
            placeholder="email"
            placeholderTextColor="#6B7280"
            className="border bg-gray-300 p-3 mb-4 rounded-xl"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="password"
            placeholderTextColor="#6B7280"
            className="border bg-gray-300 p-3 mb-4 rounded-xl"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            className="bg-blue-600/80 px-6 py-3 rounded-2xl"
            onPress={handleLogin}
          >
            <Text className="text-white text-lg text-center">Login</Text>
          </Pressable>
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-700">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/register");
              }}
            >
              <Text className="text-blue-600 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
