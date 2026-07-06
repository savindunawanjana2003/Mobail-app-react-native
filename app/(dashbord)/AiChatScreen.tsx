import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { askGemini } from "../../service/geminiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AiChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "හෙලෝ! මම ඔයාගේ කාලගුණ සහායක AI. මොනවද දැනගන්න ඕනේ?",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    setInputText("");

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMsgText,
      sender: "user",
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiResponse = await askGemini(userMsgText, messages);

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse || "මට ඒක තේරුණේ නැහැ.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ ප්‍රශ්නයක් මතු වුණා. කරුණාකර නැවත උත්සාහ කරන්න.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-stone-100 mt-10"
    >
      {/* Header */}
      <View className="bg-blue-900 p-4 shadow-md">
        <Text className="text-xl font-bold text-white text-center">
          AI Weather Assistant
        </Text>
      </View>

      {/* Chat Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";
          return (
            <View
              className={`flex-row ${isUser ? "justify-end" : "justify-start"} mb-3`}
            >
              <View
                className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm ${
                  isUser
                    ? "bg-blue-800 rounded-tr-none text-white"
                    : "bg-white border border-stone-200 rounded-tl-none"
                }`}
              >
                <Text
                  className={`text-sm ${isUser ? "text-white" : "text-stone-800"}`}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Loader indicator */}
      {isLoading && (
        <View className="flex-row justify-start px-6 mb-3">
          <View className="bg-white p-3 rounded-2xl border border-stone-200 rounded-tl-none">
            <ActivityIndicator size="small" color="#1e3a8a" />
          </View>
        </View>
      )}

      {/* Input Bottom Bar */}
      <View className="flex-row p-3 bg-white border-t border-stone-200 items-center">
        <TextInput
          className="flex-1 bg-stone-100 p-3 rounded-xl border border-stone-300 mr-2 text-stone-800"
          placeholder="AI එකෙන් මොනවා හරි අහන්න..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          className={`p-3 rounded-xl justify-center items-center ${
            inputText.trim() && !isLoading ? "bg-blue-800" : "bg-stone-300"
          }`}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
