import Navbar from "../components/Navbar"
import { Link } from 'react-router-dom'

function Home() {
    const quickAccessItems = [
        { label: 'Student Directory', to: '/students', icon: '👥' },
        { label: 'Teacher Directory', to: '/teacherdirectory', icon: '🧑‍🏫' },
        { label: 'Class Directory', to: '/classes', icon: '📚' },
        { label: 'School Calendar', to: '/calendar', icon: '📅' },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <div className="mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Welcome to Thomas Jefferson Elementary School
                    </h1>
                    <p className="text-slate-600">Manage students, teachers, classes, and events</p>
                </div>

                {/* Quick Access Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                        Quick Access
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickAccessItems.map(({ label, to, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className="group relative inline-block w-full"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200"></div>
                                <div className="relative p-6 bg-white rounded-lg border border-slate-200 group-hover:border-slate-300 group-hover:shadow-lg transition-all duration-200">
                                    <div className="text-4xl mb-3">{icon}</div>
                                    <h3 className="font-semibold text-slate-900 text-lg">{label}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Announcements Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                        Recent Announcements
                    </h2>
                    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <p className="text-slate-500">No announcements yet</p>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home