import { useState } from "react";
import ClassRow from "./ClassRow";

export default function TeacherCard({
    teacherData,
    classes = [],
    onEdit,
    onDelete,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(teacherData);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(teacherData);
    };

    return (
        <>
            <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200">
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors duration-150"
                >
                    <div className="col-span-4 min-w-0 text-sm font-medium text-slate-800">
                        <span
                            className={`p-2 inline-block transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        >
                            ▶
                        </span>
                        {teacherData.tname}
                    </div>
                    <div className="col-span-5 min-w-0 text-sm text-slate-500">
                        {teacherData.email}
                    </div>
                    <div className="col-span-3 min-w-0 flex items-center justify-end gap-3">
                        <button
                            onClick={handleEditClick}
                            className="p-1.5 text-base hover:bg-slate-100 rounded-md transition-colors duration-150 cursor-pointer select-none"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-1.5 text-base hover:bg-red-50 rounded-md transition-colors duration-150 cursor-pointer select-none"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-100 px-12 py-3 flex flex-col gap-2 animate-fadeIn">
                        {classes.length === 0 ? (
                            <div className="text-xs text-slate-400 italic py-1">
                                No classes assigned to this teacher.
                            </div>
                        ) : (
                            classes.map((classObj) => (
                                <ClassRow
                                    key={classObj.id}
                                    classData={classObj}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
