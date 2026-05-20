import { db } from "../../firebase";
import {
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
} from "firebase/firestore";

export const getAllTeachers = async () => {
    try {
        const snapshot = await getDocs(collection(db, "Teachers"));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return data;
    } catch (error) {
        console.error("Failed to fetch teachers: ", error);
        return [];
    }
};

export const getTeacherById = async (id) => {
    try {
        const snapshot = await getDoc(doc(db, "Teachers", id));

        // Invalid id so nothing returns
        if (!snapshot.exists()) return null;

        const data = {
            id: snapshot.id,
            ...snapshot.data(),
        };
        return data;
    } catch (error) {
        console.error("Failed to fetch teacher: ", error);
        return null;
    }
};

export const getTeacherByName = async (name) => {
    if (!name) {
        throw new Error("Missing_name");
    }

    try {
        const nameQuery = query(
            collection(db, "Teachers"),
            where("tname", "==", name),
        );
        const querySnapshot = await getDocs(nameQuery);
        if (querySnapshot.empty) return [];

        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return data;
    } catch (error) {
        console.error("Failed to fetch teacher: ", error);
        return [];
    }
};

export const createTeacher = async (teacherName, teacherEmail) => {
    if (!teacherName || !teacherEmail) {
        throw new Error("Missing_fields");
    }
    try {
        const docRef = await addDoc(collection(db, "Teachers"), {
            tname: teacherName,
            email: teacherEmail,
        });
        return docRef.id;
    } catch (error) {
        console.error("Failed to create new teacher: ", error);
        throw error;
    }
};

export const updateTeacher = async (id, field, newValue) => {
    if (!id || !field) {
        throw new Error("Missing_parameters");
    }
    try {
        const snapshot = await getDoc(doc(db, "Teachers", id));
        if (!snapshot.exists()) {
            throw new Error("Teacher_not_found");
        }
        const allowedFields = ["tname", "email"];
        if (!allowedFields.includes(field)) {
            throw new Error("Unauthorized_field_update");
        }
        await updateDoc(doc(db, "Teachers", id), {
            [field]: newValue,
        });
        return true;
    } catch (error) {
        console.error("Failed to edit teacher: ", error);
        throw error;
    }
};

export const deleteTeacher = async (id) => {
    if (!id) {
        throw new Error("Missing_id");
    }
    try {
        const snapshot = await getDoc(doc(db, "Teachers", id));
        if (!snapshot.exists()) {
            throw new Error("Teacher_not_found");
        }

        await deleteDoc(doc(db, "Teachers", id));
        return true;
    } catch (error) {
        console.error("Failed to delete teacher: ", error);
        throw error;
    }
};
