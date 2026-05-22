import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

import AssignmentRow from "./AssignmentRow";

export default function StudentRow({
    studentData,
    overallGrade,
    assignments = [],
    classId,
    gradebookId,
    onUpdateSuccess,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [gradeToEdit, setGradeToEdit] = useState(null);
    const [newScore, setNewScore] = useState("");

    const flatAssignments = Object.entries(assignments || {}).flatMap(
        ([category, list]) => {
            if (!Array.isArray(list)) return [];

            return list.map((item) => ({
                ...item,
                category: category,
            }));
        },
    );

    const handleOpenEdit = (assignment) => {
        setGradeToEdit(assignment);
        setNewScore(assignment.score.toString());
    };

    const handleSaveGrade = async (e) => {
        e.preventDefault();
        if (!gradeToEdit) return;

        const parsedScore = parseFloat(newScore);
        if (isNaN(parsedScore) || parsedScore < 0) {
            console.error("Please enter a valid, non-negative score.");
            return;
        }

        try {
            const targetStudentId = gradebookId;
            if (!targetStudentId || !classId) {
                throw new Error(
                    "Missing class configuration or student reference.",
                );
            }

            const docRef = doc(
                db,
                "Classes",
                classId,
                "Gradebook",
                targetStudentId,
            );

            const updatedAssignments = JSON.parse(JSON.stringify(assignments));

            const categoryArray = updatedAssignments[gradeToEdit.category];
            if (!categoryArray)
                throw new Error("Target grading category was not found.");

            const assignmentIndex = categoryArray.findIndex(
                (a) => a.name === gradeToEdit.name,
            );

            if (assignmentIndex === -1) {
                throw new Error(
                    "Selected assignment record missing from database.",
                );
            }

            categoryArray[assignmentIndex].score = parsedScore;

            await updateDoc(docRef, {
                grades: updatedAssignments,
            });

            if (onUpdateSuccess) {
                onUpdateSuccess();
            }

            setGradeToEdit(null);
        } catch (err) {
            console.error("Failed to update grade:", err);
        }
    };

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="grid grid-cols-4 gap-4 items-center px-6 py-4 hover:border-slate-200 transition-all duration-200"
            >
                <div className="col-span-2 min-w-0 text-sm font-medium text-slate-800">
                    <span
                        className={`p-2 inline-block transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    >
                        ▶
                    </span>
                    {studentData.sname}
                </div>
                <div className="col-span-2 text-right min-w-0 text-sm text-slate-500">
                    {overallGrade()}
                </div>
            </div>
            {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-100 px-12 py-3 flex flex-col gap-2 animate-fadeIn">
                    <div className="grid grid-cols-5 gap-4 py-2 text-xs font-semibold uppercase tracking-wider">
                        <span className="col-span-1 text-xs font-bold text-slate-800 mt-1">
                            Type
                        </span>
                        <span className="col-span-1 text-xs font-bold text-slate-800 mt-1">
                            Assignment Name
                        </span>
                        <span className="col-span-1 text-xs font-bold text-slate-800 mt-1">
                            Max
                        </span>
                        <span className="col-span-1 text-xs font-bold text-slate-800 mt-1">
                            Score
                        </span>
                    </div>
                    <div className="space-y-3">
                        {flatAssignments.length > 0 ? (
                            flatAssignments.map((assignment, index) => (
                                <AssignmentRow
                                    key={assignment.name + index}
                                    type={assignment.category}
                                    assignmentData={assignment}
                                    onEdit={() => handleOpenEdit(assignment)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">
                                No assignments were found.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {gradeToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 mx-4 space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 px-2.5 py-1 bg-blue-50 rounded-full">
                                {gradeToEdit.category}
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mt-2">
                                Edit Grade for {studentData.sname}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Assignment:{" "}
                                <strong className="text-slate-600">
                                    {gradeToEdit.name}
                                </strong>
                            </p>
                        </div>

                        <form onSubmit={handleSaveGrade} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500">
                                    Earned Score
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        autoFocus
                                        value={newScore}
                                        onChange={(e) =>
                                            setNewScore(e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <span className="text-sm font-semibold text-slate-400">
                                        / {gradeToEdit.max} max
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setGradeToEdit(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
