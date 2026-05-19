import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getAllTeachers, createTeacher } from "../services/teacherService";
import TeacherCard from "../components/TeacherCard";

function TeacherDirectory() {
    const [teachers, setTeachers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teacherData = await getAllTeachers();
                console.log("Teacher data: ", teacherData);
                setTeachers(teacherData);
                console.log("Fetch teachers worked");
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
    return (
        <div className="flex flex-row min-h-screen w-full bg-slate-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl tracking-tight font-bold text-slate-900 mb-6">
                    Teacher Directory
                </h1>
                <div className="grid grid-cols-2 gap-4 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 mb-2">
                    <div>Name</div>
                    <div>Email</div>
                </div>
                <ul className="flex flex-col gap-2">
                    {teachers.map((teacher) => (
                        <li key={teacher.id} className="list-none">
                            <TeacherCard teacherData={teacher} />
                        </li>
                    ))}
                </ul>

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
