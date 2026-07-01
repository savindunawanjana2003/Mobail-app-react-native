// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeApp } from "firebase/app";

// import {
//   getReactNativePersistence,
//   initializeAuth,
// } from "firebase/auth/react-native"; //  මෙන්න මෙහෙන් ගන්න
// import { getFirestore } from "firebase/firestore";

// // AsyncStorage.setItem("key", "value")
// // AsyncStorage.getItem("key")
// // await AsyncStorage.getItem("key")

// const firebaseConfig = {
//   apiKey: "AIzaSyCP4L4QSvvgsM6MRcvpFmNFRH6mB8NuMNo",
//   authDomain: "wether-app-c708c.firebaseapp.com",
//   projectId: "wether-app-c708c",
//   storageBucket: "wether-app-c708c.firebasestorage.app",
//   messagingSenderId: "367952458088",
//   appId: "1:367952458088:web:5f839acc71cc307f3ba6dd",
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);

// // before 9
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 💡 1. initializeAuth සහ persistence ක්‍රම standard විදිහට import කරනවා
import { browserSessionPersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

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

// 💡 2. Firebase v11/v12 වලට ගැලපෙන persistence config එක
let firebaseAuth;

if (Platform.OS === "web") {
  firebaseAuth = initializeAuth(app, {
    persistence: browserSessionPersistence,
  });
} else {
  // Mobile (Android/iOS) වලදී AsyncStorage එක custom storage එකක් විදිහට දෙනවා
  firebaseAuth = initializeAuth(app, {
    persistence: {
      async getItem(key: any) {
        return AsyncStorage.getItem(key);
      },
      async setItem(key: any, value: any) {
        return AsyncStorage.setItem(key, value);
      },
      async removeItem(key: any) {
        return AsyncStorage.removeItem(key);
      },
    } as any,
  });
}

export const auth = firebaseAuth;
