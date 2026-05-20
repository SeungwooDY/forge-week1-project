import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
    getAllTeachers,
    createTeacher,
    getTeacherByName,
    getClassesByTeacherName,
    deleteTeacherById,
} from "../services/teacherService";
import TeacherCard from "../components/TeacherCard";

function TeacherDirectory() {
    const [teachers, setTeachers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [teacherToDelete, setTeacherToDelete] = useState(false);
    // const [teacherToEdit, setTeacherToEdit] = useState(false)

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teacherData = await getAllTeachers();

                const teachersWithClasses = await Promise.all(
                    teacherData.map(async (teacher) => {
                        const classData = await getClassesByTeacherName(
                            teacher.tname,
                        );
                        return {
                            ...teacher,
                            classes: classData,
                        };
                    }),
                );
                setTeachers(teachersWithClasses);
            } catch (error) {
                console.error("Error fetching teacher data", error);
            }
        };
        fetchTeachers();
    }, []);

    const handleNewTeacher = async () => {
        try {
            const newId = await createTeacher(newName, newEmail);
            const newTeacherObject = {
                id: newId,
                tname: newName,
                email: newEmail,
            };
            setTeachers((prev) => [...prev, newTeacherObject]);
            setNewName("");
            setNewEmail("");
        } catch (error) {
            console.error("Failed creating new teacher: ", error);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        try {
            const filteredTeachers = teachers.filter((teacher) => {
                return teacher.tname.includes(searchName);
            });

            setSearchResults(filteredTeachers);
            setSearchName("");
        } catch (error) {
            console.error("Failed to get teacher: ", error);
        }
    };

    const handleClearSearch = () => {
        setSearchResults(null);
    };

    // const handleOpenEdit = (teacher) => {
    //     setTeacherToEdit(teacher);
    // };

    // const handleEdit = async (id) => {

    // }

    const handleOpenDelete = (teacher) => {
        setTeacherToDelete(teacher);
    };

    const handleDelete = async () => {
        try {
            await deleteTeacherById(teacherToDelete.id);

            setTeachers((prev) =>
                prev.filter((t) => t.id !== teacherToDelete.id),
            );
            if (searchResults !== null) {
                setSearchResults((prev) =>
                    prev.filter((t) => t.id !== teacherToDelete.id),
                );
            }

            setTeacherToDelete(null);
        } catch (error) {
            console.error("Failed to delete teacher: ", error);
        }
    };

    return (
        <div className="flex flex-row min-h-screen w-full bg-slate-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl tracking-tight font-bold text-slate-900 mb-6">
                    Teacher Directory
                </h1>
                <form
                    onSubmit={handleSearch}
                    className="flex gap-2 max-w-md mb-8"
                >
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Search for a teacher"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 cursor-pointer"
                    >
                        Search
                    </button>
                </form>

                {searchResults !== null && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-lg w-fit">
                        <span>Showing filtered results</span>
                        <button
                            onClick={handleClearSearch}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 underline ml-2 cursor-pointer"
                        >
                            Clear Search & Show All
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 mb-2">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-5">Email</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>
                {searchResults !== null && searchResults.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm mt-2">
                        <span className="text-3xl block mb-2">🔍</span>
                        <h3 className="text-sm font-medium text-slate-800 mb-1">
                            No teachers found
                        </h3>
                        <p className="text-xs text-slate-500">
                            We couldn't find anyone matching that exact name.
                        </p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {(searchResults !== null
                            ? searchResults
                            : teachers
                        ).map((teacher) => (
                            <li key={teacher.id} className="list-none">
                                <TeacherCard
                                    teacherData={teacher}
                                    classes={teacher.classes || []}
                                    onDelete={handleOpenDelete}
                                    // onEdit={handleOpenEdit}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {teacherToDelete && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl bg-red-50 p-2 rounded-lg">
                                    ⚠️
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-950">
                                        Permanently delete profile?
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                        ID: {teacherToDelete.id}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Are you sure you want to delete{" "}
                                <strong className="text-slate-900 font-medium">
                                    {teacherToDelete.tname}
                                </strong>
                                ? This will remove their record from the
                                directory permanently. This action cannot be
                                reversed.
                            </p>

                            <div className="flex items-center justify-end gap-2.5">
                                <button
                                    onClick={() => setTeacherToDelete(null)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm max-w-3xl">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-4 flex items-center gap-2">
                        <span>➕</span> Add New Teacher
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <label className="flex-1 w-full text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span className="block mb-1.5 normal-case font-medium text-sm text-slate-700">
                                Name
                            </span>
                            <input
                                type="text"
                                value={newName}
                                placeholder="Enter new name here"
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 placeholder:normal-case font-normal focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:bg-white transition-all duration-150"
                            />
                        </label>

                        <label className="flex-1 w-full text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span className="block mb-1.5 normal-case font-medium text-sm text-slate-700">
                                Email
                            </span>
                            <input
                                type="text"
                                value={newEmail}
                                placeholder="Enter new email here"
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 placeholder:normal-case font-normal focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:bg-white transition-all duration-150"
                            />
                        </label>

                        <button
                            onClick={handleNewTeacher}
                            className="w-full sm:w-auto h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-950 dynamic-btn whitespace-nowrap cursor-pointer"
                        >
                            Add Teacher
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDirectory;
