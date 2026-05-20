import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { getAllEvents } from "../utils/events";

function Calendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    try {
        useEffect(() => {
            const fetchEvents = async () => {
                const eventsData = await getAllEvents();
                setEvents(eventsData);
            }
        fetchEvents();
    }, []);
    } catch (error) {
        console.error("Error fetching events:", error);
    }

    return (
        <div className= "min-h-screen bg-slate-50">
            <div>
                <Navbar />
                <div className="p-8">
                    <ReactCalendar onChange={setDate} value={date} />
                </div>
                    
            </div>
        </div>
    )
}

export default Calendar