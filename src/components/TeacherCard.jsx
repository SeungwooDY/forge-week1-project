export default function TeacherCard({ teacherData }) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 items-center px-6 py-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors duration-150">
                <div className="text-sm font-medium text-slate-800">
                    {teacherData.tname}
                </div>
                <div className="text-sm text-slate-500">
                    {teacherData.email}
                </div>
            </div>
        </>
    );
}
