import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, increment } from 'firebase/firestore';
import { db } from "../../firebase";

export async function getAllTeachers() {
    const snapshot = await getDocs(collection(db, "Teachers"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}