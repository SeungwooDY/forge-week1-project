import { collection, getDocs, updateDoc, query, where, arrayRemove } from 'firebase/firestore';
import { db } from "../../firebase";

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