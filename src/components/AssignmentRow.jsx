import { useState } from "react";

export default function AssignmentRow({ type, assignmentData, onEdit }) {
    return (
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200">
            <div className="col-span-1 min-w-0 text-sm text-slate-500">
                {type}
            </div>
            <div className="col-span-1 min-w-0 text-sm text-slate-500">
                {assignmentData.name}
            </div>
            <div className="col-span-1 min-w-0 text-sm text-slate-500">
                {assignmentData.max}
            </div>
            <div className="col-span-1 min-w-0 text-sm text-slate-500">
                {assignmentData.score} / {assignmentData.max}
            </div>
            <div className="text-right">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 cursor-pointer"
                >
                    Edit Grade
                </button>
            </div>
        </div>
    );
}
