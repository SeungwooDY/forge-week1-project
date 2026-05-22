import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClassById } from "../utils/classes";
import { getStudentsByClass } from "../utils/students";
import { overallGrade, getGradebook } from "../utils/grades";
import StudentRow from "../components/StudentRow";
import Navbar from "../components/Navbar";

function Grades() {
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState(null);
    const [gradeBook, setGradebook] = useState(null);
    const [gradeDistribution, setGradeDistribution] = useState(null);
    const { classId } = useParams();

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const data = await getClassById(classId);
                setClassData(data);
                setGradeDistribution(data.grade_distribution);
            } catch (error) {
                console.error("Failed to fetch class: ", error);
            }
        };
        const fetchStudents = async () => {
            try {
                const data = await getStudentsByClass(classId);
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students: ", error);
            }
        };
        const fetchGradebook = async () => {
            try {
                const data = await getGradebook(classId);
                setGradebook(data);
                console.log("gradebook: ", data);
            } catch (error) {
                console.log("Error fetching gradebook", error);
            }
        };

        fetchClass();
        fetchStudents();
        fetchGradebook();
    }, [classId]);

    const getOverallGrade = (studentGrades, gradeDistribution) => {
        console.log(studentGrades);
        const filteredGrades = Object.fromEntries(
            Object.entries(studentGrades).map(([category, assignments]) => [
                category,
                assignments.filter((assignment) => assignment.score !== null),
            ]),
        );

        const rawScore = overallGrade(filteredGrades, gradeDistribution);

        return rawScore !== null ? `${rawScore.toFixed(1)}%` : "-";
    };

    const handleRefresh = () => {
        const fetchGradebook = async () => {
            try {
                const data = await getGradebook(classId);
                setGradebook(data);
            } catch (error) {
                console.log("Error fetching gradebook", error);
            }
        };
        fetchGradebook();
    };

    if (!classData || !students || !gradeBook) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="text-slate-500 font-medium">
                    Loading grade records...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-slate-50">
            <Navbar />
            <div className="flex-1 p-8">
                <button onClick={() => navigate(`/classes/${classId}`)} className="text-sm font-medium text-slate-500 hover:text-slate-800 mb-2 block transition-colors">
                    Back to Dashboard
                </button>
                <div className="py-2 border-b border-slate-200 pb-5 justify-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {classData.cname}
                    </h1>
                </div>
                <div className="grid grid-cols-4 gap-4 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 mb-2">
                    <div className="col-span-2">Student</div>
                    <div className="col-span-2 text-right">Overall Grade</div>
                </div>
                <div className="space-y-3">
                    {gradeBook && gradeBook.length > 0 ? (
                        gradeBook.map((record) => (
                            <StudentRow
                                key={record.id}
                                studentData={record}
                                assignments={record.grades}
                                overallGrade={() =>
                                    getOverallGrade(
                                        record.grades,
                                        gradeDistribution,
                                    )
                                }
                                classId={classId}
                                gradebookId={record.id}
                                onUpdateSuccess={handleRefresh}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">
                            No student grade records found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Grades;
