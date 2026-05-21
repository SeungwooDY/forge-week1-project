import { useEffect, useState } from 'react'
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    Timestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'

function Students() {
    const [students, setStudents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const [newStudent, setNewStudent] = useState({
        sid: '',
        sname: '',
        DOB: '',
        sgrade: '',
        finalGPA: '',
        address: '',
        classes: [],
    })

    async function getStudents() {
        try {
            const querySnapshot = await getDocs(collection(db, 'Students'))

            const studentList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setStudents(studentList)
        } catch (error) {
            console.error('Error getting students:', error)
        }
    }

    useEffect(() => {
        getStudents()
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setNewStudent({
            ...newStudent,
            [name]: value,
        })
    }

    function resetForm() {
        setNewStudent({
            sid: '',
            sname: '',
            DOB: '',
            sgrade: '',
            finalGPA: '',
            address: '',
            classes: [],
        })

        setEditingId(null)
        setShowForm(false)
    }

    function formatDateForInput(studentDOB) {
        if (!studentDOB) {
            return ''
        }

        const date = studentDOB.toDate ? studentDOB.toDate() : new Date(studentDOB)

        return date.toISOString().split('T')[0]
    }

    function formatDateForTable(studentDOB) {
        if (!studentDOB) {
            return ''
        }

        const date = studentDOB.toDate ? studentDOB.toDate() : new Date(studentDOB)

        return date.toLocaleDateString()
    }

    function handleEdit(student) {
        setEditingId(student.id)

        setNewStudent({
            sid: student.sid || student.student_id || '',
            sname:
                student.sname ||
                `${student.firstName || student.fname || ''} ${student.lastName || ''}`.trim(),
            DOB: formatDateForInput(student.DOB || student.birthday),
            sgrade: student.sgrade || student.grade || '',
            finalGPA: student.finalGPA || '',
            address: Array.isArray(student.address)
                ? student.address.join(' ')
                : student.address || '',
            classes: student.classes || [],
        })

        setShowForm(true)
    }

    async function handleDelete(studentId) {
        try {
            await deleteDoc(doc(db, 'Students', studentId))
            await getStudents()
        } catch (error) {
            console.error('Error deleting student:', error)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            const studentData = {
                sid: Number(newStudent.sid),
                sname: newStudent.sname,
                DOB: Timestamp.fromDate(new Date(newStudent.DOB)),
                sgrade: Number(newStudent.sgrade),
                finalGPA: Number(newStudent.finalGPA),
                address: newStudent.address,
                classes: newStudent.classes || [],
            }

            if (editingId) {
                await updateDoc(doc(db, 'Students', editingId), studentData)
            } else {
                await addDoc(collection(db, 'Students'), studentData)
            }

            resetForm()
            await getStudents()
        } catch (error) {
            console.error('Error saving student:', error)
        }
    }

    const filteredStudents = students.filter((student) => {
        const name = student.sname || `${student.firstName || ''} ${student.lastName || ''}`

        return name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <div className="min-h-screen bg-white text-slate-700">
            <header className="flex items-center justify-between border-b border-slate-200 px-8 py-3">
                <div className="text-xl font-bold text-slate-800">🎓 TJES</div>

                <nav className="flex gap-8 text-sm font-semibold text-slate-500">
                    <a href="/">Home</a>
                    <a href="/dashboard">Dashboard</a>
                    <a href="/classes">Classes</a>
                    <a href="/students" className="rounded-md bg-slate-100 px-4 py-2 text-slate-800">
                        Students
                    </a>
                    <a href="/teachers">Teacher Directory</a>
                    <a href="/calendar">Calendar</a>
                </nav>
            </header>

            <main>
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => {
                            setEditingId(null)
                            setShowForm(true)
                        }}
                        className="rounded-2xl border-2 border-black px-5 py-2 text-black"
                    >
                        Add Student
                    </button>

                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search Students"
                        className="w-64 rounded-2xl border-2 border-black px-5 py-2 outline-none"
                    />
                </div>

                <table className="mt-12 w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-700">
                            <th className="px-4 py-4">Student ID</th>
                            <th className="px-4 py-4">Name</th>
                            <th className="px-4 py-4">Date of Birth</th>
                            <th className="px-4 py-4">Grade</th>
                            <th className="px-4 py-4">Final GPA</th>
                            <th className="px-4 py-4">Address</th>
                            <th className="px-4 py-4"></th>
                            <th className="px-4 py-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="border-b border-slate-100">
                                <td className="px-4 py-5 font-semibold text-slate-800">
                                    {student.sid || student.student_id || ''}
                                </td>

                                <td className="px-4 py-5">
                                    {student.sname ||
                                        `${student.firstName || student.fname || ''} ${student.lastName || ''}`}
                                </td>

                                <td className="px-4 py-5">
                                    {formatDateForTable(student.DOB || student.birthday)}
                                </td>

                                <td className="px-4 py-5">
                                    {student.sgrade || student.grade || ''}
                                </td>

                                <td className="px-4 py-5">
                                    {student.finalGPA || ''}
                                </td>

                                <td className="px-4 py-5">
                                    {Array.isArray(student.address)
                                        ? student.address.join(' ')
                                        : student.address || ''}
                                </td>

                                <td className="px-4 py-5">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="rounded-2xl border-2 border-blue-600 px-4 py-2 text-xs text-blue-600"
                                    >
                                        EDIT
                                    </button>
                                </td>

                                <td className="px-4 py-5">
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="rounded-2xl border-2 border-red-600 px-4 py-2 text-xs text-red-600"
                                    >
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                        <form
                            onSubmit={handleSubmit}
                            className="w-[800px] rounded-2xl bg-white p-10"
                        >
                            <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
                                {editingId ? 'Edit Student' : 'Add Student'}
                            </h2>

                            <div className="mb-8 grid grid-cols-3 gap-6">
                                <input
                                    name="sid"
                                    placeholder="Student ID"
                                    value={newStudent.sid}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="sname"
                                    placeholder="Student Name"
                                    value={newStudent.sname}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    type="date"
                                    name="DOB"
                                    value={newStudent.DOB}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="sgrade"
                                    placeholder="Grade"
                                    value={newStudent.sgrade}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="finalGPA"
                                    placeholder="Final GPA"
                                    value={newStudent.finalGPA}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />

                                <input
                                    name="address"
                                    placeholder="Address"
                                    value={newStudent.address}
                                    onChange={handleChange}
                                    className="rounded-lg border p-3"
                                />
                            </div>

                            <div className="flex justify-center gap-6">
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-800 px-8 py-3 font-bold text-white"
                                >
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl bg-slate-200 px-8 py-3 font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Students