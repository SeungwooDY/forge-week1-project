import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { getAllClasses, addClass, deleteClass, updateClass } from '../utils/classes'
import { getAllTeachers } from '../utils/teachers'
import { getAllStudents, deleteClassFromStudents } from '../utils/students'


export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [searchedClassName, setSearchedClassName] = useState('');
    const [errors, setErrors] = useState({});
    const [editTarget, setEditTarget] = useState(null);

    const [form, setForm] = useState({
        cname: '',
        cgrade: '',
        location: '',
        year: '',
        start_time: '',
        end_time: '',
        teacher_tid: '',
        teacher_tname: '',
        student_sid: '',
        student_sname: '',
        gd_homework: '',
        gd_quiz: '',
        gd_tests: '',
        gd_project: '',
    });

    const filteredClasses = classes.filter((c) => 
        c.cname?.toLowerCase().includes(searchedClassName.toLowerCase())
    );

    const fetchClasses = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);
        } catch (error) {
            console.log("Error fetching classes", error);
        }
    }
    
    const fetchStudents = async () => {
        try {
            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            console.log("Error fetching students", error);
        }
    }

    const fetchTeachers = async () => {
        try {
            const data = await getAllTeachers();
            setTeachers(data);
        } catch (error) {
            console.log("Error fetching teachers", error);
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        if (!isValid()) return;
        
        const gradeDist = {};
        if (form.gd_homework) gradeDist.homework = Number(form.gd_homework);
        if (form.gd_quiz) gradeDist.quiz = Number(form.gd_quiz);
        if (form.gd_tests) gradeDist.tests = Number(form.gd_tests);
        if (form.gd_project) gradeDist.project = Number(form.gd_project);

        const newClass = {
            cname: form.cname,
            cgrade: Number(form.cgrade),
            location: form.location,
            year: Number(form.year),
            start_time: form.start_time ? new Date(`1970-01-01T${form.start_time}`) : null,
            end_time: form.end_time ? new Date(`1970-01-01T${form.end_time}`) : null,
            teacher: { tid: form.teacher_tid, tname: form.teacher_tname },
            grade_distribution: gradeDist,
        };

        if (editTarget) {
            await updateClass(editTarget.id, newClass);
        } else {
            await addClass(newClass, form.student_sid, form.student_sname);
        }

        handleCancel();
        fetchClasses();
    }

    const handleAddClass = () => {
        setIsFormOpen(true);
    }

    const handleCancel = () => {
        setForm({
            cname: '', cgrade: '', location: '', year: '',
            start_time: '', end_time: '',
            teacher_tid: '', teacher_tname: '',
            student_sid: '', student_sname: '',
            gd_homework: '', gd_quiz: '', gd_tests: '', gd_project: '',
        });
        setIsFormOpen(false);
        setEditTarget(null);
    }

    const handleDelete = async (id) => {
        await deleteClassFromStudents(id);
        await deleteClass(id);
        setDeleteTarget(null);
        fetchClasses();
    }

    const isInt = (val) => val !== '' && Number.isInteger(Number(val));

    const isValid = () => {
        const next = {};

        if (!form.cname.trim()) {
            next.cname = 'Class name is required';
        }

        if (!form.cgrade) {
            next.cgrade = 'Grade is required';
        }

        if (!form.location.trim()) {
            next.location = 'Location is required';
        }

        if (!form.year) {
            next.year = 'Year is required';
        }

        if (!form.start_time) {
            next.start_time = 'Start time is required';
        }

        if (!form.end_time) {
            next.end_time = 'End time is required';
        }

        if (!form.teacher_tid) {
            next.teacher = 'Teacher is required';
        }

        if (form.gd_homework === '' || form.gd_project === '' || form.gd_quiz === '' || form.gd_tests === '') {
            next.grade_distribution = 'All grade categories are required';
        }

        if (form.cgrade && !isInt(form.cgrade)) next.cgrade = 'Must be a whole number';
        // make sure grade is reasonable (between 1 and 5)
        if (form.cgrade && (form.cgrade < 1 || form.cgrade > 5)) next.cgrade = "Grade must be between 1 and 5";
        if (form.year && !isInt(form.year)) next.year = 'Must be a whole number';
        // make sure year is reasonable (between 1900 and current year)
        const currentYear = new Date().getFullYear();
        if (form.year && (form.year < 1900 || form.year > currentYear)) {
            next.year = `Year must be between 1900 and ${currentYear}`;
        }
        // make sure start time is before end time
        if (form.start_time && form.end_time && form.start_time >= form.end_time) {
            next.end_time = 'End time must be after start time';
        }
        if (form.gd_homework && !isInt(form.gd_homework)) next.gd_homework = 'Whole number only';
        if (form.gd_quiz && !isInt(form.gd_quiz)) next.gd_quiz = 'Whole number only';
        if (form.gd_tests && !isInt(form.gd_tests)) next.gd_tests = 'Whole number only';
        if (form.gd_project && !isInt(form.gd_project)) next.gd_project = 'Whole number only';
        
        // ensure all grade distribution fields are between 0 and 100 and they sum to 100 
        const gdValues = [form.gd_homework, form.gd_quiz, form.gd_tests, form.gd_project].filter(v => v !== '');
        const gdSum = gdValues.reduce((sum, val) => sum + Number(val), 0);
        if (gdValues.some(v => v < 0 || v > 100)) {
            next.grade_distribution = 'Each category must be between 0 and 100';
        } else if (gdValues.length > 0 && gdSum !== 100) {
            next.grade_distribution = 'Percentages must sum to 100';
        }

        setErrors(next);
        // doesn't show the error messages anywhere but it prevents submission if there are errors, which is the main point
        console.log(next);
        return Object.keys(next).length === 0;
    }

    const timestampToHHMM = (ts) => {
        const d = ts.toDate();
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    const handleEdit = (c) => {
        setForm({
            cname: c.cname || '',
            cgrade: c.cgrade?.toString() || '',
            location: c.location || '',
            year: c.year?.toString() || '',
            start_time: c.start_time ? timestampToHHMM(c.start_time) : '',
            end_time: c.end_time ? timestampToHHMM(c.end_time) : '',
            teacher_tid: c.teacher?.tid || '',
            teacher_tname: c.teacher?.tname || '',
            gd_homework: c.grade_distribution?.homework?.toString() || '',
            gd_quiz: c.grade_distribution?.quiz?.toString() || '',
            gd_tests: c.grade_distribution?.tests?.toString() || '',
            gd_project: c.grade_distribution?.project?.toString() || '',
        });
        setEditTarget(c);
        setIsFormOpen(true);
    }

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
        fetchStudents();
    }, [])

    const input = "border border-slate-300 rounded-2xl px-2 py-1 text-sm";
    const label = "text-xs font-medium text-slate-600 mb-1";

    return (
        <>
            <Navbar />
            <div className="flex justify-center p-4">
                <button
                    onClick={handleAddClass}
                    className="px-4 py-2 border-2 rounded-2xl"
                >
                    Add Class
                </button>
                <input 
                    type="text"
                    placeholder='Search Classes'
                    className='px-5 py-2 border-2 rounded-2xl'
                    value={searchedClassName}
                    onChange={(e) => setSearchedClassName(e.target.value)}
                />
            </div>
                <br />
            <div className="overflow-auto" style={{ height: 'calc(100vh - 64px)' }}>
                <table className="min-w-full">
                    <thead className="sticky top-0 bg-white border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Class</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Grade</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Teacher</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Location</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Time</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Year</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Grading</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.map((c) => (
                            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm font-medium text-slate-800">{c.cname}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{c.cgrade}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{c.teacher?.tname}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{c.location}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">
                                    {c.start_time?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    {' – '}
                                    {c.end_time?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600">{c.year}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">
                                    {c.grade_distribution &&
                                        Object.entries(c.grade_distribution)
                                            .map(([category, percent]) => `${percent}% ${category}`)
                                            .join(', ')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="text-blue-600 hover:text-blue-800 text-xs border-2 p-2 rounded-2xl"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(c)}
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

                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setDeleteTarget(null)}>
                        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-lg font-semibold text-slate-800 mb-2">Delete class?</h2>
                            <p className="text-sm text-slate-600 mb-4">
                                Are you sure you want to delete <strong>{deleteTarget.cname}</strong>?
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

                    {/* Add class form */}
                    {isFormOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            onClick={handleCancel}>
                            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto"
                                onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    {editTarget ? 'Edit Class' : 'Add Class'}
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className={label}>Class name</label>
                                        <input className={input} name="cname" value={form.cname} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Grade</label>
                                        <input className={input} type="number" step="1" name="cgrade" value={form.cgrade} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Location</label>
                                        <input className={input} name="location" value={form.location} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Year</label>
                                        <input className={input} type="number" step="1" name="year" value={form.year} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Start time</label>
                                        <input className={input} type="time" step="60" name="start_time" value={form.start_time} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>End time</label>
                                        <input className={input} type="time" step="60" name="end_time" value={form.end_time} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Teacher</label>
                                        <select
                                            className={input}
                                            name="teacher_tid"
                                            value={form.teacher_tid}
                                            onChange={(e) => {
                                                const selected = teachers.find(t => t.id === e.target.value);
                                                setForm({
                                                    ...form,
                                                    teacher_tid: selected?.id || '',
                                                    teacher_tname: selected?.tname || '',
                                                });
                                            }}
                                        >
                                            <option value="">Select a teacher...</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.tname} ({t.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Student</label>
                                        <select
                                            className={input}
                                            name="student_sid"
                                            value={form.student_sid}
                                            onChange={(e) => {
                                                const selected = students.find(s => s.id === e.target.value);
                                                setForm({
                                                    ...form,
                                                    student_sid: selected?.id || '',
                                                    student_sname: selected?.sname || '',
                                                });
                                            }}
                                        >
                                            <option value="">Select a student...</option>
                                            {students.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.sname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <h3 className="text-sm font-semibold text-slate-700 mt-6 mb-2">Grade distribution (%)</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="flex flex-col">
                                        <label className={label}>Homework</label>
                                        <input className={input} type="number" step="1" name="gd_homework" value={form.gd_homework} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Quiz</label>
                                        <input className={input} type="number" step="1" name="gd_quiz" value={form.gd_quiz} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Tests</label>
                                        <input className={input} type="number" step="1" name="gd_tests" value={form.gd_tests} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={label}>Project</label>
                                        <input className={input} type="number" step="1" name="gd_project" value={form.gd_project} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 justify-end">
                                    <button onClick={handleCancel} className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-2xl hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button onClick={handleSubmit} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>                    
        </>
    )
}