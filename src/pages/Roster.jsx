import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getStudentsByClass, deleteStudentCascade, updateStudent } from '../utils/students';

function Roster() {
    const { classId } = useParams();
    const [students, setStudents] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({
        sname: '',
        sgrade: '',
        sid: '',
        address: '',
        DOB: '',
    });

    const handleDelete = async (id) => {
        await deleteStudentCascade(id);
        setDeleteTarget(null);
        fetchStudents();
    }

    const handleEdit = (s) => {
        setForm({ 
            sname: s.sname || '',
            sgrade: s.sgrade || '',
            sid: s.sid || '',
            address: s.address || '',
            DOB: s.DOB ? timeStampToYYYYMMDD(s.DOB) : '',
        });
        setEditTarget(s);
        setIsFormOpen(true);
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleCancel = () => {
        setForm({ sname: '', sgrade: '', sid: '', address: '', DOB: ''});
        setEditTarget(null);
        setIsFormOpen(false);
    }

    const timeStampToYYYYMMDD = (ts) => {
        const d = ts.toDate();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    const handleSubmit = async () => {
        const data = {
            sname: form.sname,
            sgrade: form.sgrade ? Number(form.sgrade) : null,
            sid: form.sid,
            address: form.address,
            DOB: form.DOB ? new Date(form.DOB) : null,
        };
        await updateStudent(editTarget.id, data);
        handleCancel();
        fetchStudents();
    }

    const fetchStudents = async () => {
        try {
            const data = await getStudentsByClass(classId);
            setStudents(data);
        } catch (error) {
            console.log("Error fetching students by class ID");
        }
    }

    useEffect(() => {
        fetchStudents();
    }, [classId])

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-xl font-semibold text-slate-800 mb-4">
                    Students in this class
                </h1>

                {students.length === 0 ? (
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
                            {students.map((s) => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-800">{s.sname}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.sgrade}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.sid}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.address}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{s.DOB?.toDate().toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(s)}
                                                className="text-blue-600 hover:text-blue-800 text-xs border-2 p-2 rounded-2xl"
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(s)}
                                                className="text-red-600 hover:text-red-800 text-xs border-2 p-2 rounded-2xl"
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">Remove student?</h2>
                        <p className="text-sm text-slate-600 mb-4">
                            Delete <strong>{deleteTarget.sname}</strong>? This also removes their gradebook
                            entries from every class they're enrolled in.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteTarget(null)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-2xl hover:bg-slate-50">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteTarget.id)}
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-2xl hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={handleCancel}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit Student</h2>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">Name</label>
                                <input
                                    className="border border-slate-300 rounded-2xl px-2 py-1 text-sm"
                                    name="sname"
                                    value={form.sname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">Grade</label>
                                <input
                                    className="border border-slate-300 rounded-2xl px-2 py-1 text-sm"
                                    name="sgrade"
                                    type="number"
                                    step="1"
                                    value={form.sgrade}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">Student ID</label>
                                <input
                                    className="border border-slate-300 rounded-2xl px-2 py-1 text-sm"
                                    name="sid"
                                    value={form.sid}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">Address</label>
                                <input
                                    className="border border-slate-300 rounded-2xl px-2 py-1 text-sm"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-600 mb-1">Date of birth</label>
                                <input
                                    className="border border-slate-300 rounded-2xl px-2 py-1 text-sm"
                                    name="DOB"
                                    type="date"
                                    value={form.DOB}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 justify-end">
                            <button onClick={handleCancel}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-2xl hover:bg-slate-50">
                                Cancel
                            </button>
                            <button onClick={handleSubmit}
                                    className="px-4 py-2 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Roster;
