import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, increment } from 'firebase/firestore';
import { db } from "../../firebase";

export async function addClass(data) {
    await addDoc(collection(db, 'Classes'), data);
}

export async function getAllClasses() {
    const snapshot = await getDocs(collection(db, "Classes"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

export async function updateClass(id, data) {
    await updateDoc(doc(db, 'Classes', id), data);
}

export async function deleteClass(id) {
    await deleteDoc(doc(db, 'Classes', id));
}