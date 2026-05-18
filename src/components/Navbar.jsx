import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/students">Students</Link>
            <Link to="/teacherdirectory">TeacherDirectory</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/teacher-dashboard">Teacher Dashboard</Link>
        </nav>
    )
}

export default Navbar