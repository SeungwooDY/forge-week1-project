import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../components/Navbar";
import StudentCard from "../components/StudentCard";
import { getAllClasses } from "../utils/classes";
import { useNavigate } from "react-router-dom";

function Students() {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [studentToDelete, setStudentToDelete] = useState(null);

    const blankStudent = {
        sid: "",
        sname: "",
        DOB: "",
        sgrade: "",
        address: "",
        classes: [],
    };

    const navigate = useNavigate();

    const handleClassNavigation = (classId) => {
        navigate(`/classes/${classId}`);
    };

    const [allClasses, setAllClasses] = useState([]);

    const getClasses = async () => {
        const data = await getAllClasses();
        setAllClasses(data);
    };

    const [newStudent, setNewStudent] = useState(blankStudent);

    async function getStudents() {
        try {
            const querySnapshot = await getDocs(collection(db, "Students"));

            const studentList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setStudents(studentList);
        } catch (error) {
            console.error("Error getting students:", error);
        }
    }

    useEffect(() => {
        getStudents();
        getClasses();
    }, []);

    const resolveClasses = (classIds) => {
        if (!classIds) return [];
        return classIds
            .map((id) => allClasses.find((c) => c.id === id))
            .filter(Boolean);
    };

    function handleChange(event) {
        const { name, value } = event.target;

        setNewStudent({
            ...newStudent,
            [name]: value,
        });
    }

    function resetForm() {
        setNewStudent(blankStudent);
        setEditingId(null);
        setShowForm(false);
    }

    function openAddStudentForm() {
        setNewStudent(blankStudent);
        setEditingId(null);
        setShowForm(true);
    }

    function parseDOB(dateString) {
        if (!dateString) {
            return null;
        }

        const trimmedDate = dateString.trim();

        if (trimmedDate.includes("/")) {
            const parts = trimmedDate.split("/");
            const month = Number(parts[0]);
            const day = Number(parts[1]);
            const year = Number(parts[2]);

            return new Date(year, month - 1, day);
        }

        return new Date(trimmedDate);
    }

    function formatDateForInput(studentDOB) {
        if (!studentDOB) {
            return "";
        }

        const date = studentDOB.toDate
            ? studentDOB.toDate()
            : new Date(studentDOB);

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    function formatDateForTable(studentDOB) {
        if (!studentDOB) {
            return "";
        }

        const date = studentDOB.toDate
            ? studentDOB.toDate()
            : new Date(studentDOB);

        return date.toLocaleDateString();
    }

    function handleEdit(student) {
        setEditingId(student.id);

        setNewStudent({
            sid: student.sid || student.student_id || "",
            sname:
                student.sname ||
                `${student.firstName || student.fname || ""} ${student.lastName || ""}`.trim(),
            DOB: formatDateForInput(student.DOB || student.birthday),
            sgrade: student.sgrade || student.grade || "",
            address: Array.isArray(student.address)
                ? student.address.join(" ")
                : student.address || "",
            classes: student.classes || [],
        });

        setShowForm(true);
    }

    const openDelete = (student) => {
        setStudentToDelete(student);
    };

    async function handleDelete(student) {
        try {
            const studentClasses = student.classes || [];

            for (const classId of studentClasses) {
                await deleteDoc(
                    doc(db, "Classes", classId, "Gradebook", student.id),
                );
            }

            await deleteDoc(doc(db, "Students", student.id));
            setStudentToDelete(null);
            await getStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const parsedDOB = parseDOB(newStudent.DOB);

            const studentData = {
                sid: Number(newStudent.sid),
                sname: newStudent.sname,
                DOB: Timestamp.fromDate(parsedDOB),
                sgrade: Number(newStudent.sgrade),
                address: newStudent.address,
                classes: newStudent.classes || [],
            };

            if (editingId) {
                await updateDoc(doc(db, "Students", editingId), studentData);
            } else {
                await addDoc(collection(db, "Students"), studentData);
            }

            resetForm();
            await getStudents();
        } catch (error) {
            console.error("Error saving student:", error);
        }
    }

    const filteredStudents = students.filter((student) => {
        const name =
            student.sname ||
            `${student.firstName || ""} ${student.lastName || ""}`;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col min-h-screen w-full bg-slate-50">
            <Navbar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl tracking-tight font-bold text-slate-900 mb-6">
                    Student Directory
                </h1>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <button
                        onClick={openAddStudentForm}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 cursor-pointer"
                    >
                        Add Student
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search students by name..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                <div className="grid grid-cols-13 gap-4 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 mb-2">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-1">ID</div>
                    <div className="col-span-1">Grade</div>
                    <div className="col-span-2">Birthday</div>
                    <div className="col-span-3">Address</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
                            <span className="text-3xl block mb-2">🔍</span>
                            <h3 className="text-sm font-medium text-slate-800 mb-1">
                                No students found
                            </h3>
                            <p className="text-xs text-slate-500">
                                We couldn't find any students matching that
                                search
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {filteredStudents.map((student) => (
                                <li key={student.id} className="list-none">
                                    <StudentCard
                                        studentData={student}
                                        classes={resolveClasses(
                                            student.classes,
                                        )}
                                        onEdit={handleEdit}
                                        onDelete={openDelete}
                                        onClassClick={handleClassNavigation}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs"
                    onClick={resetForm}
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
                        autoComplete="off"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl bg-slate-100 p-2 rounded-lg">
                                {editingId ? "✏️" : "➕"}
                            </span>
                            <h2 className="text-lg font-semibold text-slate-950">
                                {editingId ? "Edit Student" : "Add New Student"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">
                                    Student ID
                                </label>
                                <input
                                    name="sid"
                                    value={newStudent.sid}
                                    onChange={handleChange}
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">
                                    Name
                                </label>
                                <input
                                    name="sname"
                                    value={newStudent.sname}
                                    onChange={handleChange}
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="text"
                                    name="DOB"
                                    placeholder="MM/DD/YYYY"
                                    value={newStudent.DOB}
                                    onChange={handleChange}
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">
                                    Grade
                                </label>
                                <input
                                    name="sgrade"
                                    value={newStudent.sgrade}
                                    onChange={handleChange}
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className="text-xs font-medium text-slate-600 mb-1">
                                    Address
                                </label>
                                <input
                                    name="address"
                                    value={newStudent.address}
                                    onChange={handleChange}
                                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2.5 items-center justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {studentToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs"
                    onClick={() => setStudentToDelete(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 max-w-md w-full mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl bg-red-50 p-2 rounded-lg">
                                ⚠️
                            </span>
                            <h2 className="text-lg font-semibold text-slate-950">
                                Delete Student Account
                            </h2>
                        </div>

                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Are you sure you want to remove{" "}
                            <strong className="text-slate-900">
                                {studentToDelete.sname || "this student"}
                            </strong>{" "}
                            from the dashboard? This action will also remove
                            them from associated gradebooks and cannot be
                            undone.
                        </p>

                        <div className="flex gap-2.5 items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setStudentToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(studentToDelete)}
                                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Students;
