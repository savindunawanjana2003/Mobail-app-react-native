import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// AsyncStorage.setItem("key", "value")
// AsyncStorage.getItem("key")
// await AsyncStorage.getItem("key")

const firebaseConfig = {
  apiKey: "AIzaSyCP4L4QSvvgsM6MRcvpFmNFRH6mB8NuMNo",
  authDomain: "wether-app-c708c.firebaseapp.com",
  projectId: "wether-app-c708c",
  storageBucket: "wether-app-c708c.firebasestorage.app",
  messagingSenderId: "367952458088",
  appId: "1:367952458088:web:5f839acc71cc307f3ba6dd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// before 9
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
