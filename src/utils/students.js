import { collection, getDocs, updateDoc, query, where, arrayRemove } from 'firebase/firestore';
import { db } from "../../firebase";

export const getAllStudents = async () => {
    try {
        const snapshot = await getDocs(collection(db, "Students"));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return data;
    } catch (error) {
        console.error("Failed to fetch students: ", error);
        return [];
    }
};

export async function deleteClassFromStudents(classId) {
    const q = query(
        collection(db, 'Students'),
        where('classes', 'array-contains', classId)
    );
    const snapshot = await getDocs(q);

    // Remove the class ID from each matching student's classes array
    await Promise.all(
        snapshot.docs.map(studentDoc =>
            updateDoc(studentDoc.ref, {
                classes: arrayRemove(classId)
            })
        )
    );
}