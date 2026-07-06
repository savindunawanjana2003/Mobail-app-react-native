import { GoogleGenAI } from "@google/genai";
// const API_KEY = "AQ.Ab8RN6JHqYRUJfl0l_mbRzNje5Bm3WZXeCanATqIIHTUr2LRIQ";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: API_KEY });
export const askGemini = async (
  userMessage: string,
  chatHistory: any[] = [],
) => {
  try {
    const formattedHistory = chatHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: formattedHistory,
      config: {
        maxOutputTokens: 1000,
      },
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI එකෙන් පිළිතුරක් ලබාගන්න බැරි වුණා.");
  }
};
