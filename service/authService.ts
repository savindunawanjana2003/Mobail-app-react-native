import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const register = async (
  fullname: string,
  email: string,
  password: string,
  role: string,
) => {
  // auth service
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: fullname });

  // firestore ( database service )
  const userId = userCred.user.uid;
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, {
    name: fullname,
    email,
    roles: role,
    createAt: new Date(),
  });
  return userCred.user;
};

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return await signOut(auth);
};
