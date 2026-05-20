export default function ClassRow({ classData }) {
    return (
        <>
            <div className="group flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-150 cursor-pointer w-full">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-800 transition-colors duration-150">
                        📚
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2.5">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                                {classData.cname}, Grade {classData.cgrade}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400">
                            Location: {classData.location}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
