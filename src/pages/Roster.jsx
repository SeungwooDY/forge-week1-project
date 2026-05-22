import Navbar from "../components/Navbar";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllStudents, addStudentToClass, getStudentsByClass, removeStudentFromClass } from '../utils/students';

function Roster() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [enrolled, setEnrolled] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');

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

    const handleDelete = async (id) => {
        await removeStudentFromClass(id, classId);
        setDeleteTarget(null);
        fetchEnrolled();
    }

    const handleAdd = async () => {
        if (!selectedStudentId) return;
        await addStudentToClass(selectedStudentId, classId);
        setSelectedStudentId('');
        fetchEnrolled();
    }

    useEffect(() => {
        fetchEnrolled();
        fetchAllStudents();
    }, [classId])

    const available = allStudents.filter(
        (s) => !enrolled.some((e) => e.id === s.id)
    );

    return (
        <div className="flex flex-col min-h-screen w-full bg-slate-50">
            <Navbar />
            <div className="p-6">
                <button onClick={() => navigate(`/classes/${classId}`)} className="text-sm font-medium text-slate-500 hover:text-slate-800 mb-2 block transition-colors">
                    Back to Dashboard
                </button>

                <h1 className="text-xl font-semibold text-slate-800 mb-4">
                    Students in this class
                </h1>
    
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <select
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Add Student
                    </button>
                </div>
    
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {enrolled.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="text-3xl block mb-2">🎒</span>
                            <h3 className="text-sm font-medium text-slate-800 mb-1">
                                No students enrolled
                            </h3>
                            <p className="text-xs text-slate-500">
                                Add a student using the dropdown above
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">DOB</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrolled.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.sname}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.sgrade}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.sid}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.address}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.DOB?.toDate().toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setDeleteTarget(s)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                            >
                                                REMOVE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
    
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs"
                    onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl bg-red-50 p-2 rounded-lg">⚠️</span>
                            <div>
                                <h3 className="text-base font-semibold text-slate-950">
                                    Remove from class?
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    ID: {deleteTarget.id}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Remove <strong>{deleteTarget.sname}</strong> from this class? Their gradebook
                            entries here will be deleted, but their student record will remain.
                        </p>
                        <div className="flex gap-2.5 items-center justify-end">
                            <button onClick={() => setDeleteTarget(null)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteTarget.id)}
                                    className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Roster;
