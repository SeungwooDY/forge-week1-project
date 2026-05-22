import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getClassById } from "../utils/classes";
import { getStudentsByClass } from "../utils/students";
import { getGradebook, categoryAverage, overallGrade } from "../utils/grades";

function ClassPage() {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [gradebook, setGradebook] = useState([]);

    const fetchClass = async () => {
        try {
            const data = await getClassById(classId);
            setClassData(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch class: ", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await getStudentsByClass(classId);
            setStudents(data);
        } catch (error) {
            console.log("Error fetching students by class ID");
        }
    };

    const fetchGradebook = async () => {
        try {
            const data = await getGradebook(classId);
            console.log("gradebook: ", data);
            setGradebook(data);
        } catch (error) {
            console.log("Error fetching gradebook", error);
        }
    };

    useEffect(() => {
        fetchClass();
        fetchStudents();
        fetchGradebook();
    }, [classId]);

    const navigate = useNavigate();

    const handleAssignmentClick = () => {
        navigate(`/classes/${classId}/assignments`);
    };

    const handleStudentClick = () => {
        navigate(`/classes/${classId}/roster`);
    };

    const handleGradeClick = () => {
        navigate(`/classes/${classId}/grades`);
    };

    if (!classData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="text-slate-500 font-medium">
                    Loading class details...
                </div>
            </div>
        );
    }

    const cleanOverallGrades = (grades) => {
        if (!grades) return {};
        return Object.fromEntries(
            Object.entries(grades).map(([category, assignments]) => [
                category,
                (assignments || []).filter((a) => a.score !== null),
            ]),
        );
    };

    const getCategoryAverage = (assignments) => {
        if (!assignments) return null;
        const validAssignments = assignments.filter((a) => a.score !== null);
        if (validAssignments.length === 0) return null;
        return categoryAverage(validAssignments);
    };

    const fmt = (val) => (val == null ? "-" : `${val.toFixed(1)}%`);

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen w-full bg-slate-50">
                <div className="flex-1 p-8">
                    <div className="border-b border-slate-200 pb-6 mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                            {classData.cname}
                        </h1>

                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Teacher
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {classData.teacher?.tname || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Grade
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        Grade {classData.cgrade}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Location
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {classData.location}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        School Year
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {classData.year}-{String(classData.year + 1).slice(2)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Schedule
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {classData.start_time?.toDate().toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                        {" – "}
                                        {classData.end_time?.toDate().toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                <div className="sm:col-span-2 lg:col-span-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                        Grade Distribution
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {Object.entries(classData.grade_distribution || {}).map(
                                            ([category, percent]) => (
                                                <span
                                                    key={category}
                                                    className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200"
                                                >
                                                    {percent}% {category}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 mb-8 gap-4 px-6 md:flex md:flex-row md:justify-between w-full">
                        <button
                            onClick={handleAssignmentClick}
                            className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group text-left w-45"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
                                Coursework
                            </span>
                            <span className="text-sm font-bold text-slate-800 mt-1">
                                Edit Assignments
                            </span>
                        </button>
                        <button
                            onClick={handleGradeClick}
                            className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group text-left w-45"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
                                Performance
                            </span>
                            <span className="text-sm font-bold text-slate-800 mt-1">
                                Edit Grades
                            </span>
                        </button>
                        <button
                            onClick={handleStudentClick}
                            className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group text-left w-45 align-right"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
                                Roster
                            </span>
                            <span className="text-sm font-bold text-slate-800 mt-1">
                                Manage Students
                            </span>
                        </button>
                    </div>

                    {gradebook.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No students enrolled.
                        </p>
                    ) : (
                        <table className="min-w-full">
                            <thead className="border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Students
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Overall
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Homework
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Quiz
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Test
                                    </th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                                        Project
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradebook.map((g) => {
                                    const cleanGrades = cleanOverallGrades(
                                        g.grades,
                                    );
                                    return (
                                        <tr
                                            key={g.id}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 text-sm text-slate-800">
                                                {g.sname}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {fmt(
                                                    overallGrade(
                                                        cleanGrades,
                                                        classData.grade_distribution,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {fmt(
                                                    getCategoryAverage(
                                                        g.grades?.homework,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {fmt(
                                                    getCategoryAverage(
                                                        g.grades?.quiz,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {fmt(
                                                    getCategoryAverage(
                                                        g.grades?.tests,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {fmt(
                                                    getCategoryAverage(
                                                        g.grades?.project,
                                                    ),
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

export default ClassPage;
