import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import ClassPage from "./pages/ClassPage";
import Students from "./pages/Students";
import TeacherDirectory from "./pages/TeacherDirectory";
import Calendar from "./pages/Calendar";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/classes/:classId" element={<ClassPage />} />
                <Route path="/students" element={<Students />} />
                <Route
                    path="/teacherdirectory"
                    element={<TeacherDirectory />}
                />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </>
    );
}
