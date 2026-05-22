import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getClassById } from "../utils/classes";
import { getAssignments, addAssignment, updateAssignment, deleteAssignment } from "../utils/assignments";

function Assignments() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form state for both adding and editing
    const [form, setForm] = useState({
        title: '',
        category: 'homework', 
        max_score: 100
    });

    // Fetching data
    const fetchData = async () => {
        try {
            const cData = await getClassById(classId);
            setClassData(cData);

            const aData = await getAssignments(classId);
            setAssignments(aData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.category || !form.max_score) {
            alert("Please fill in all fields!");
            return;
        }

        const isDuplicate = assignments.some(a => 
            a.title.toLowerCase() === form.title.trim().toLowerCase() 
            && a.id !== editingId);

        if (isDuplicate) {
            alert("An assignment with this name already exists!");
            return;
        }

        try {
            if (editingId) {
                await updateAssignment(classId, editingId, form);
            } else {
                await addAssignment(classId, form);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
    };

    const handleDelete = async() => {
        try {
            await deleteAssignment(classId, editingId);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm({
            title: '',
            category: 'homework',
            max_score: 100
        });
        setIsModalOpen(true);
    };

    const openEditModal = (assignment) => {
        setEditingId(assignment.id);
        setForm({
            title: assignment.title,
            category: assignment.category,
            max_score: assignment.max_score
        });
        setIsModalOpen(true);
    };

    const inputStyle = "w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400 bg-slate-50 focus:bg-white transition-colors";
    const labelStyle = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-end border-b border-slate-200 pb-5 mb-8">
                        <div>
                            <button onClick={() => navigate(`/classes/${classId}`)} className="text-sm font-medium text-slate-500 hover:text-slate-800 mb-2 block transition-colors">
                                Back to Dashboard
                            </button>

                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {classData ? classData.cname : "Loading..."} Coursework
                            </h1>
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            Add Assignment
                        </button>

                    </div>

                    {/* Assignments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {assignments.length === 0 ? (
                            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-base font-semibold text-slate-800">No assignments yet</h3>
                                <p className="text-sm text-slate-500 mt-1">Click the button above to create one!</p>
                            </div>
                        ) : (
                            assignments.map(assignment => (
                                <div 
                                    key={assignment.id}
                                    onClick={() => openEditModal(assignment)}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                                            {assignment.category}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                            {assignment.max_score} pts
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {assignment.title}
                                    </h3>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
     
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                            {editingId ? "Edit Assignment" : "New Assignment"}
                        </h2>
                        
                        <div className="flex flex-col gap-5 mb-8">
                            <div>
                                <label className={labelStyle}>Assignment Title</label>
                                <input 
                                    type="text" 
                                    className={inputStyle} 
                                    name="title" 
                                    value={form.title} 
                                    onChange={handleChange} 
                                    placeholder="ex: Homework 1"
                                />
                            </div>
                            
                            <div>
                                <label className={labelStyle}>Grading Category</label>
                                <select 
                                    className={inputStyle} 
                                    name="category" 
                                    value={form.category} 
                                    onChange={handleChange}
                                >
                                    <option value="homework">Homework (15%)</option>
                                    <option value="project">Project (15%)</option>
                                    <option value="quiz">Quiz (40%)</option>
                                    <option value="tests">Tests (30%)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className={labelStyle}>Maximum Score</label>
                                <input 
                                    type="number" 
                                    className={inputStyle} 
                                    name="max_score" 
                                    value={form.max_score} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            {editingId && (
                                <button 
                                    onClick={handleDelete}
                                    className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-bold mr-auto hover:bg-red-100 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-slate-500 hover:text-slate-800 text-sm font-bold rounded-xl mr-2 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black shadow-md transition-colors"
                            >
                                {editingId ? "Save Changes" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Assignments;