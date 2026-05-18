import './App.css'

import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import ClassPage from './pages/ClassPage'
import Students from './pages/Students'
import Teachers from './pages/TeacherDirectory'
import Calendar from './pages/Calendar'
import TeacherDashboard from './pages/TeacherDashboard'

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/classes/:classId" element={<ClassPage />} />
                <Route path="/students" element={<Students />} />
                <Route path="/teachers" element={<TeacherDirectory />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            </Routes>
        </>
    )
}

export default App