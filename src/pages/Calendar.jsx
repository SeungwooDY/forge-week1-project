import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { getAllEvents } from "../utils/events";
import { isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import '../styles/Calendar.css'

function Calendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    
    // Fetch events when the component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getAllEvents();
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);
    
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex justify-center p-8">
                
                {/* Creates large white box for calendar */}
                <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    
                    {/* Calendar Component */}
                    <ReactCalendar 
                        onChange={setDate} 
                        value={date} 
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
        </div>
    )
}
export default Calendar