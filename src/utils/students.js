import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    arrayRemove,
    arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";

export async function addStudentToClass(studentId, classId, classData) {
    const studentSnap = await getDoc(doc(db, "Students", studentId));
    const student = studentSnap.data();

    const gradeDist = classData.grade_distribution;
    const grades = {};

    Object.entries(gradeDist).forEach((key) => {
        if (gradeDist[key] > 0) {
            dynamicGrades[key] = [];
        }
    });

    await updateDoc(doc(db, "Students", studentId), {
        classes: arrayUnion(classId),
    });

    await setDoc(doc(db, "Classes", classId, "Gradebook", studentId), {
        sname: student.sname,
        avg_grade: null,
        grades
    });
}

export async function removeStudentFromClass(studentId, classId) {
    await updateDoc(doc(db, "Students", studentId), {
        classes: arrayRemove(classId),
    });
    await deleteDoc(doc(db, "Classes", classId, "Gradebook", studentId));
}

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
        collection(db, "Students"),
        where("classes", "array-contains", classId),
    );
    const snapshot = await getDocs(q);

    // Remove the class ID from each matching student's classes array
    await Promise.all(
        snapshot.docs.map((studentDoc) =>
            updateDoc(studentDoc.ref, {
                classes: arrayRemove(classId),
            }),
        ),
    );
}

export async function getStudentsByClass(classId) {
    if (!classId) return [];
    try {
        const q = query(
            collection(db, "Students"),
            where("classes", "array-contains", classId),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Failed to fetch student profiles: ", error);
        return [];
    }
}

export async function deleteStudent(id) {
    await deleteDoc(doc(db, "Students", id));
}

export async function updateStudent(id, data) {
    await updateDoc(doc(db, "Students", id), data);
}

export async function removeStudentFromGradebooks(studentId) {
    const studentSnap = await getDoc(doc(db, "Students", studentId));
    const classIds = studentSnap.data()?.classes || [];

    await Promise.all(
        classIds.map((classId) =>
            deleteDoc(doc(db, "Classes", classId, "Gradebook", studentId)),
        ),
    );
}

export async function deleteStudentCascade(studentId) {
    await removeStudentFromGradebooks(studentId);
    await deleteStudent(studentId);
}
