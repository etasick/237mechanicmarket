// services/firebaseService.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp,getDocs } from "firebase/firestore";

// Add subscriber
export const addSubscriber = async (email: string) => {
  try {
    await addDoc(collection(db, "subscribers"), {
      email,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error adding subscriber:", err);
    return false;
  }
};


export const getSubscribers = async () => {
  const snapshot = await getDocs(collection(db, "subscribers"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all contacts
export const getContacts = async () => {
  const snapshot = await getDocs(collection(db, "contacts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add contact
export const addContact = async (name: string, email: string, message: string) => {
  try {
    await addDoc(collection(db, "contacts237mechanicmarket"), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error adding contact:", err);
    return false;
  }
};
