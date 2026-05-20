import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'

import Sidebar from '../components/Sidebar'

function Students() {
    const navigate = useNavigate()

    const [students, setStudents] = useState([])
    const [showForm, setShowForm] = useState(false)

    const [newStudent, setNewStudent] = useState({
        student_id: '',
        firstName: '',
        lastName: '',
        birthday: '',
        grade: '',
        finalGPA: '',
        address: '',
        classes: [],
    })

    async function getStudents() {
        try {
            console.log('Loading students...')

            const querySnapshot = await getDocs(collection(db, 'Students'))

            const studentList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            console.log('Students loaded:', studentList)

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

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            console.log('Submitting student:', newStudent)

            await addDoc(collection(db, 'Students'), {
                student_id: newStudent.student_id,
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                birthday: newStudent.birthday,
                grade: Number(newStudent.grade),
                finalGPA: Number(newStudent.finalGPA),
                address: newStudent.address,
                classes: [],
            })

            console.log('Student added successfully')

            setNewStudent({
                student_id: '',
                firstName: '',
                lastName: '',
                birthday: '',
                grade: '',
                finalGPA: '',
                address: '',
                classes: [],
            })

            setShowForm(false)

            await getStudents()
        } catch (error) {
            console.error('Error adding student:', error)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#b8b0a7]">
            <Sidebar />

            <main className="flex-1 p-10 text-center">
                <button
                    onClick={() => navigate('/')}
                    className="bg-purple-700 text-white px-8 py-4 rounded-2xl text-2xl font-bold mb-6"
                >
                    ⌂ Home
                </button>

                <h1 className="text-6xl font-bold text-purple-700 mb-10">
                    Student Directory
                </h1>

                <div className="flex justify-center gap-6 mb-10">
                    <button
                        onClick={getStudents}
                        className="bg-purple-700 text-white px-10 py-4 rounded-2xl text-2xl font-bold"
                    >
                        All Students
                    </button>

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-purple-700 text-white px-10 py-4 rounded-2xl text-2xl font-bold"
                    >
                        Create/Edit Students
                    </button>
                </div>

                <div className="overflow-x-auto flex justify-center">
                    <table className="bg-white shadow-lg">
                        <thead>
                            <tr>
                                <th className="border border-black p-4">Student ID</th>
                                <th className="border border-black p-4">First Name</th>
                                <th className="border border-black p-4">Last Name</th>
                                <th className="border border-black p-4">Date of Birth</th>
                                <th className="border border-black p-4">Grade</th>
                                <th className="border border-black p-4">Final GPA</th>
                                <th className="border border-black p-4">Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td className="border border-black p-3">
                                        {student.student_id || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {student.firstName || student.fname || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {student.lastName || student.sname || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {student.birthday || student.DOB?.toDate?.().toLocaleDateString() || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {student.grade || student.sgrade || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {student.finalGPA || ''}
                                    </td>

                                    <td className="border border-black p-3">
                                        {Array.isArray(student.address)
                                            ? student.address.join(' ')
                                            : student.address || ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-10 rounded-2xl w-[900px]"
                        >
                            <div className="grid grid-cols-4 gap-6 mb-8">
                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        Student ID
                                    </label>

                                    <input
                                        name="student_id"
                                        value={newStudent.student_id}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        Student First Name
                                    </label>

                                    <input
                                        name="firstName"
                                        value={newStudent.firstName}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        Student Last Name
                                    </label>

                                    <input
                                        name="lastName"
                                        value={newStudent.lastName}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        Date of Birth
                                    </label>

                                    <input
                                        name="birthday"
                                        value={newStudent.birthday}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        Grade
                                    </label>

                                    <input
                                        name="grade"
                                        value={newStudent.grade}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-left mb-2 font-bold">
                                        GPA
                                    </label>

                                    <input
                                        name="finalGPA"
                                        value={newStudent.finalGPA}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-left mb-2 font-bold">
                                        Address
                                    </label>

                                    <input
                                        name="address"
                                        value={newStudent.address}
                                        onChange={handleChange}
                                        className="border p-3 w-full rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-10">
                                <button
                                    type="submit"
                                    className="bg-purple-700 text-white px-10 py-4 rounded-xl text-2xl font-bold"
                                >
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-200 px-10 py-4 rounded-xl text-2xl font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-10 py-4 rounded-xl text-2xl font-bold"
                                >
                                    Delete
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