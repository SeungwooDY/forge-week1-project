import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { getAllEvents, addEvent, updateEvent, deleteEvent } from "../utils/events";
import { isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import '../styles/Calendar.css'

function Calendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    // Modal state to control visibility and editing
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // For searching
    const [searchQuery, setSearchQuery] = useState('');

    const searchResults = searchQuery
        ? events.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    // For jumping to months
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    const [form, setForm] = useState({
        title: '',
        start_date: '',
        end_date: ''
    });

    // Handles title, start date, and end date input changes by updating the form state
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    // Handles form submission
    const handleSubmit = async () => {
        // Data validation checks
        if (!form.title) {
            alert("Please enter an event title!");
            return;
        }
        if (!form.start_date || !form.end_date) {
            alert("Please enter both start and end dates!");
            return;
        }
        if (new Date(form.start_date) > new Date(form.end_date)) {
            alert("Start date cannot be after end date!");
            return;
        }

        // For duplicate events
        const isDuplicate = events.some(existingEvent => {
            // Ignores current event when checking for duplicates
            if (editingId && existingEvent.id === editingId) {
                return false; 
            }
            
            const sameName = existingEvent.title === form.title;
            const sameDate = isSameDay(existingEvent.start_date, new Date(form.start_date + 'T00:00:00'));
            return sameName && sameDate;
        });

        if (isDuplicate) {
            alert("An event with this title already exists!");
            return;
        }

        const end_date_obj = endOfDay(new Date(form.end_date + 'T00:00:00'));

        // Creates new event object, converts to proper date format, and adds to Firestore
        const newEvent = {
            ename: form.title,
            start_date: startOfDay(new Date(form.start_date + 'T00:00:00')), // Convert to start of day
            end_date: endOfDay(new Date(form.end_date + 'T00:00:00')), // Convert to end of day
            ongoing: new Date() < end_date_obj
        }
        try {
            if (editingId) {
                await updateEvent(editingId, newEvent);
            } else {
                await addEvent(newEvent);
            }
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    const fetchEvents = async () => {
        try {
            const eventsData = await getAllEvents();
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    
    // Fetch events when the component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    // Handles event deletion
    const handleDelete = async () => {
        try {
            await deleteEvent(editingId);
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    // Formats JS dates to YYYY-MM-DD for input fields
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const input = "w-full border border-blue-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400";
    const label = "block text-sm font-medium text-slate-800 mb-1 ml-1";
    
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex justify-center p-8">
                
                {/* Creates large white box for calendar */}
                <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
                    {/* Buttons at the top */}
                     <div className="flex justify-center mb-8">
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                setForm({ title: '', start_date: '', end_date: '' });
                                setIsModalOpen(true);
                            }}
                            className="px-6 py-2 border-2 border-black rounded-l-full text-sm font-medium hover:bg-slate-50"
                        >
                            Add Event
                        </button>

                        {/* Search bar */}
                        <div className="relative"> 
                            <input 
                                type="text" 
                                placeholder="Search Events" 
                                className="px-6 py-2 border-2 border-black border-l-0 rounded-r-full text-sm outline-none w-72 text-slate-500 placeholder-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* Search results dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {searchResults.map(event => (
                                          <div 
                                            key={event.id}
                                            onClick={() => {
                                                setDate(event.start_date);
                                                setActiveStartDate(event.start_date);
                                                setSearchQuery('');
                                            }}
                                            className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                                            >
                                            <div className="font-semibold text-sm text-slate-800">{event.title}</div>
                                            <div className="text-xs text-slate-500">{event.start_date ? event.start_date.toLocaleDateString() : 'No date specified'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar Component */}
                    <ReactCalendar 
                        onChange={setDate} 
                        value={date} 
                        activeStartDate={activeStartDate}
                        onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                        tileContent={({ date, view }) => {
                            
                            // Only show events on the month view
                            if (view === 'month') {
                                // Check if calendar date falls within start and end date
                                const dayEvents = events.filter(event => {
                                    return isWithinInterval(date, {
                                        start: startOfDay(event.start_date),
                                        end: endOfDay(event.end_date)
                                        });
                                    });
                            
                                // If there are events on this day, display them in a small box
                                if (dayEvents.length > 0) {
                                    return (
                                        <div className="flex flex-col gap-1 mt-1">
                                            {dayEvents.map(event => {
                                                // Use different background colors for ongoing and non-ongoing events
                                                const badgeColor = event.ongoing ? 'bg-blue-600' : 'bg-slate-800';
                                                return (
                                                    <div 
                                                        key={event.id} 
                                                        title={event.title}
                                                        onClick={(e) => {
                                                            setEditingId(event.id);
                                                            setForm({
                                                                title: event.title,
                                                                start_date: formatDateForInput(event.start_date),
                                                                end_date: formatDateForInput(event.end_date)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className={`text-[10px] px-1 py-0.5 rounded-sm truncate text-white ${badgeColor}`}
                                                    >    
                                                        {event.title}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                            }
                            // Return null for days without events or when not in month view
                            return null;
                        }}
                    />
                </div>
            </div>

            {/* Modal for adding events */}
             {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[1.5rem] p-8 w-full max-w-3xl shadow-2xl">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 ml-1">{editingId ? 'Edit Event' : 'Add Event'}</h2>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {/* Title spans both columns */}
                            <div className="col-span-2">
                                <label className={label}>Event Title</label>
                                <input className={input} name="title" value={form.title} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={label}>Start Date</label>
                                <input type="date" className={input} name="start_date" value={form.start_date} onChange={handleChange} />
                            </div>
                            <div>
                                <label className={label}>End Date</label>
                                <input type="date" className={input} name="end_date" value={form.end_date} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex justify-end mt-10">
                            {editingId && (
                                <button 
                                    onClick={handleDelete}
                                    className="px-6 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mr-auto hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            )}

                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-medium mr-3 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button 
                                className="px-8 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-black"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Calendar