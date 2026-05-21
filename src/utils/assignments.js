import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Fetch all assignments for a class
export const getAssignments = async (classId) => {
    const assignmentsRef = collection(db, 'Classes', classId, 'Assignments');
    const snapshot = await getDocs(assignmentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add assignment and push to all gradebooks
export const addAssignment = async (classId, assignmentData) => {
    // Saves to Assignments collection
    const assignmentsRef = collection(db, 'Classes', classId, 'Assignments');
    const newDocRef = await addDoc(assignmentsRef, assignmentData);
    const newAssignmentId = newDocRef.id;

    // Prepares new grade entry for each student
    const newGradeEntry = {
        id: newAssignmentId,
        name: assignmentData.title,
        score: null,
        max: Number (assignmentData.max_score)
    };

    // Push to all students
    const gradebookRef = collection(db, 'Classes', classId, 'Gradebook');
    const gradebookSnapshot = await getDocs(gradebookRef);

    const updatePromises = gradebookSnapshot.docs.map(async (studentDoc) => {
        const studentData = studentDoc.data();
        const existingGrades = studentData.grades || [];
        const category = assignmentData.category;

        const categoryArray = esistingGrades[category] || [];
        categoryArray.push(newGradeEntry);
        existingGrades[category] = categoryArray;

        return updateDoc(studentDoc.ref, { grades: existingGrades });
    });

    await Promise.all(updatePromises);
}

// Update assignment and reflect changes in gradebooks
export const updateAssignment = async (classId, assignmentId, updatedData) => {
    // Update assignment details
    const assignmentRef = doc(db, 'Classes', classId, 'Assignments', assignmentId);
    await updateDoc(assignmentRef, updatedData);

    // Update grade entries in gradebooks
    const gradebookRef = collection(db, 'Classes', classId, 'Gradebook');
    const gradebookSnapshot = await getDocs(gradebookRef);

    const updatePromises = gradebookSnapshot.docs.map(async (studentDoc) => {
        const studentData = studentDoc.data();
        const existingGrades = studentData.grades || {};
        let needsUpdate = false;

        Object.keys(existingGrades).forEach(category => {
            const arr = existingGrades[category];
            const index = arr.findIndex(item => item.id === assignmentId);

            if (index !== -1) {
                if (category !== updatedData.category) {
                    const extractedItem = arr.splice(index, 1)[0];
                    extractedItem.name = updatedData.title;
                    extractedItem.max = Number (updatedData.max_score);

                    if (!existingGrades[updatedData.category]) {
                        existingGrades[updatedData.category] = [];
                    }
                    existingGrades[updatedData.category].push(extractedItem);
                } else {
                    arr[index].name = updatedData.title;
                    arr[index].max = Number (updatedData.max_score);
                }
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            return updateDoc(studentDoc.ref, { grades: existingGrades });
        }
    });

    await Promise.all(updatePromises);
}

// Delete assignment and remove from gradebooks
export const deleteAssignment = async (classId, assignmentId) => {
    // Delete from Assignments collection
    const assignmentRef = doc(db, 'Classes', classId, 'Assignments', assignmentId);
    await deleteDoc(assignmentRef);

    // Remove from gradebooks
    const gradebookRef = collection(db, 'Classes', classId, 'Gradebook');
    const gradebookSnapshot = await getDocs(gradebookRef);

    const updatePromises = gradebookSnapshot.docs.map(async (studentDoc) => {
        const studentData = studentDoc.data();
        const existingGrades = studentData.grades || {};
        let needsUpdate = false;

        Object.keys(existingGrades).forEach(category => {
            const arr = existingGrades[category];
            const index = arr.findIndex(item => item.id === assignmentId);

            if (index !== -1) {
                arr.splice(index, 1);
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            return updateDoc(studentDoc.ref, { grades: existingGrades });
        }
    });

    await Promise.all(updatePromises);
}