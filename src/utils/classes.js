import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../../firebase";

export async function addClass(data, studentId, studentName) {
    const classRef = await addDoc(collection(db, 'Classes'), data);
    
    if (studentId && studentName) {
        // create associated gradebook subcollection for the intial student
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

        // add the class to the student's list of classes
        const studentRef = doc(db, 'Students', studentId);

        try {
            await updateDoc(studentRef, {
                classes: arrayUnion(classRef.id)
            });
            console.log("Student updated successfully");
        } catch (error) {
            console.error("updateDoc failed:", error);
        }
    }    
}

export async function getAllClasses() {
    const snapshot = await getDocs(collection(db, "Classes"));
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getClassById(id) {
    try {
        const snapshot = await getDoc(doc(db, "Classes", id));

        if (!snapshot.exists()) return null;

        const data = {
            id: snapshot.id,
            ...snapshot.data(),
        };
        return data;
    } catch (error) {
        console.error("Failed to fetch class: ", error);
        return null;
    }
}

export async function updateClass(id, data) {
    await updateDoc(doc(db, 'Classes', id), data);

    const gradeDist = data['grade_distribution'];
    const gradebook = await getDocs(collection(db, 'Classes', id, 'Gradebook'))
    
    // update all of the student's grades with new grade distribution
    try {
        await Promise.all(
            gradebook.docs.map(async (gradeDoc) => {
                const gradeData = gradeDoc.data();
                const existingGrades = gradeData.grades || {};
                const updatedGrades = {};
                Object.keys(gradeDist).forEach((category) => {
                    if (gradeDist[category] > 0) {
                        updatedGrades[category] = existingGrades[category] || [];
                    }
                });
                return updateDoc(gradeDoc.ref, {grades: updatedGrades});
            }) 
        );
    } catch (error) {
        console.error(error);
    }
}

export async function deleteClass(id) {
    await deleteDoc(doc(db, "Classes", id));
}
