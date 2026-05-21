import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase";

export async function addClass(data, studentId, studentName) {
    const classRef = await addDoc(collection(db, 'Classes'), data);
    if (studentId && studentName) {
        const gradebookDocRef = doc(db, 'Classes', classRef.id, 'Gradebook', studentId);
        
        const dynamicGrades = {};
        const gradeDist = data['grade_distribution'];
        Object.keys(gradeDist).forEach((key) => {
            if (gradeDist[key] > 0) {
                dynamicGrades[key] = [];
            }
        });

        await setDoc(gradebookDocRef, {
            sname: studentName || '',
            avg_grade: 0,
            grades: dynamicGrades
        });
    }
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