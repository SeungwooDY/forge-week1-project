import { Link, useLocation } from 'react-router-dom'

const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/classes', label: 'Classes' },
    { to: '/students', label: 'Students' },
    { to: '/teachers', label: 'Teachers' },
    { to: '/calendar', label: 'Calendar' },
]

export default function Navbar() {
    const { pathname } = useLocation()

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
            <span className="text-slate-800 font-semibold tracking-tight text-lg">
                🎓 TJES
            </span>

            <ul className="flex items-center gap-1">
                {links.map(({ to, label }) => {
                    const active = pathname === to
                    return (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
                                    ${active
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}