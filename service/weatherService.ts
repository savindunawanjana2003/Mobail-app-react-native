import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const saveLocation = async (cityName: string, userId: string) => {
  try {
    if (!userId) throw new Error("යූසර් ලොග් වෙලා නැත!");

    await addDoc(collection(db, "saved_locations"), {
      userId: userId,
      cityName: cityName,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Location save කරන්න බැරි වුනා:", error);
    return { success: false, error };
  }
};

export const getSavedLocations = async (userId: string) => {
  try {
    if (!userId) return [];

    const q = query(
      collection(db, "saved_locations"),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);
    const locations: any[] = [];

    querySnapshot.forEach((doc) => {
      locations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return locations;
  } catch (error) {
    console.error("Locations ගන්න බැරි වුනා:", error);
    return [];
  }
};

export const removeLocation = async (docId: string) => {
  try {
    await deleteDoc(doc(db, "saved_locations", docId));
    return { success: true };
  } catch (error) {
    console.error("Location delete කරන්න බැරි වුනා:", error);
    return { success: false };
  }
};
