import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { getAllClasses, addClass } from '../utils/classes'

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [form, setForm] = useState({
        cname: '',
        cgrade: '',
        location: '',
        year: '',
        start_time: '',
        end_time: '',
        teacher_tid: '',
        teacher_tname: '',
        gd_homework: '',
        gd_quiz: '',
        gd_tests: '',
        gd_project: '',
    });

    const fetchClasses = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);
        } catch (error) {
            console.log("Error fetching classes", error);
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        // build grade_distribution from only non-empty fields
        const gradeDist = {};
        if (form.gd_homework) gradeDist.homework = Number(form.gd_homework);
        if (form.gd_quiz) gradeDist.quiz = Number(form.gd_quiz);
        if (form.gd_tests) gradeDist.tests = Number(form.gd_tests);
        if (form.gd_project) gradeDist.project = Number(form.gd_project);

        const newClass = {
            cname: form.cname,
            cgrade: form.cgrade,
            location: form.location,
            year: form.year,
            start_time: form.start_time ? new Date(`1970-01-01T${form.start_time}`) : null,
            end_time: form.end_time ? new Date(`1970-01-01T${form.end_time}`) : null,
            teacher: { tid: form.teacher_tid, tname: form.teacher_tname },
            grade_distribution: gradeDist,
        };

        await addClass(newClass);
        handleCancel();
        fetchClasses();
    }

    const handleCancel = () => {
        setForm({
            cname: '', cgrade: '', location: '', year: '',
            start_time: '', end_time: '',
            teacher_tid: '', teacher_tname: '',
            gd_homework: '', gd_quiz: '', gd_tests: '', gd_project: '',
        });
    }

    const handleDelete = () => {
        // TODO: needs a target class id — wire up once row selection exists
    }

    useEffect(() => {
        fetchClasses();
    }, [])

    const input = "border border-slate-300 rounded px-2 py-1 text-sm";
    const label = "text-xs font-medium text-slate-600 mb-1";

    return (
        <>
            <Navbar />

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
                        {classes.map((c) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="border-t border-slate-200 mt-6 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Class</h2>

                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                        <div className="flex flex-col">
                            <label className={label}>Class name</label>
                            <input className={input} name="cname" value={form.cname} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Grade</label>
                            <input className={input} name="cgrade" value={form.cgrade} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Location</label>
                            <input className={input} name="location" value={form.location} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Year</label>
                            <input className={input} name="year" value={form.year} onChange={handleChange} />
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
                            <label className={label}>Teacher ID</label>
                            <input className={input} name="teacher_tid" value={form.teacher_tid} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Teacher name</label>
                            <input className={input} name="teacher_tname" value={form.teacher_tname} onChange={handleChange} />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-700 mt-6 mb-2">Grade distribution (%)</h3>
                    <div className="grid grid-cols-4 gap-4 max-w-2xl">
                        <div className="flex flex-col">
                            <label className={label}>Homework</label>
                            <input className={input} type="number" name="gd_homework" value={form.gd_homework} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Quiz</label>
                            <input className={input} type="number" name="gd_quiz" value={form.gd_quiz} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Tests</label>
                            <input className={input} type="number" name="gd_tests" value={form.gd_tests} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className={label}>Project</label>
                            <input className={input} type="number" name="gd_project" value={form.gd_project} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button onClick={handleSubmit} className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700">
                            Submit
                        </button>
                        <button onClick={handleCancel} className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50">
                            Cancel
                        </button>
                        <button onClick={handleDelete} className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}