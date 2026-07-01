import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const taskCollection = collection(db, "task");

export const addTask = async (
  title: string,
  description: string,
  isComplete: boolean = false,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authanticated...!");

  await addDoc(taskCollection, {
    title,
    description,
    isComplete,
    userId: user?.uid,
    createAt: new Date().toISOString(),
  });
};

// get all my tasks
// graphql APIs
export const getAllTasks = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authanticated...!");

  const q = query(
    taskCollection,
    where("userId", "==", user.uid), // where userId='U001'
    orderBy("createAt", "desc"),
  );

  // Firestore composite index
  //   getDoc
  const snapshot = await getDocs(q);

  const taskList = snapshot.docs.map((dataSet) => {
    const data = dataSet.data();
    return {
      id: dataSet.id,
      title: data.title as string,
      description: data.description as string,
      isComplete: data.isComplete as boolean,
      createAt: data.createAt as string,
    };
  });

  return taskList;
};
