import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getClassById } from "../utils/classes";
import { getAllStudents, addStudentToClass, getStudentsByClass, removeStudentFromClass } from '../utils/students';

function Roster() {
    const { classId } = useParams();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [enrolled, setEnrolled] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [classData, setClassData] = useState(null)

    const fetchEnrolled = async () => {
        try {
            const data = await getStudentsByClass(classId);
            setEnrolled(data);
        } catch (error) {
            console.log("Error fetching enrolled students", error);
        }
    }

    const fetchAllStudents = async () => {
        try {
            const data = await getAllStudents();
            setAllStudents(data);
        } catch (error) {
            console.log("Error fetching students", error);
        }
    }

    const fetchClass = async () => {
        try {
            const data = await getClassById(classId);
            setClassData(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch class: ", error);
        }
    };

    const handleDelete = async (id) => {
        await removeStudentFromClass(id, classId);
        setDeleteTarget(null);
        fetchEnrolled();
    }

    const handleAdd = async () => {
        if (!selectedStudentId) return;
        await addStudentToClass(selectedStudentId, classId, classData);
        setSelectedStudentId('');
        fetchEnrolled();
    }

    useEffect(() => {
        fetchClass();
        fetchEnrolled();
        fetchAllStudents();
    }, [classId])

    const available = allStudents.filter(
        (s) => !enrolled.some((e) => e.id === s.id) && s.sgrade === classData?.cgrade
    );

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-xl font-semibold text-slate-800 mb-4">
                    Students in this class
                </h1>

                {enrolled.length === 0 ? (
                    <p className="text-sm text-slate-500">No students enrolled.</p>
                ) : (
                    <table className="min-w-full">
                        <thead className="border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Grade</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Student ID</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Address</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">DOB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolled.map((s) => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-800">{s.sname}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.sgrade}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.sid}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.address}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.DOB?.toDate().toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setDeleteTarget(s)}
                                                className="text-red-600 hover:text-red-800 text-xs border-2 p-2 rounded-2xl"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                )}
                <div className="mt-6 flex items-center gap-3">
                    <select
                        className="border border-slate-300 rounded-2xl px-3 py-2 text-sm"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">Select a student to add...</option>
                        {available.map((s) => (
                            <option key={s.id} value={s.id}>{s.sname}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        disabled={!selectedStudentId}
                        className="px-4 py-2 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 disabled:bg-slate-300"
                    >
                        Add
                    </button>
                </div>
            </div>

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">Remove from class?</h2>
                        <p className="text-sm text-slate-600 mb-4">
                            Remove <strong>{deleteTarget.sname}</strong> from this class? Their gradebook
                            entries here will be deleted, but their student record will remain.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteTarget(null)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-2xl hover:bg-slate-50">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteTarget.id)}
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-2xl hover:bg-red-700">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Roster;
