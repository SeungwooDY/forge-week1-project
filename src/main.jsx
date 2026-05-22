import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Classes from "./pages/Classes.jsx";
import ClassPage from "./pages/ClassPage.jsx";
import Students from "./pages/Students.jsx";
import Assignments from "./pages/Assignments.jsx";
import Grades from "./pages/Grades.jsx";
import Roster from "./pages/Roster.jsx";
import TeacherDirectory from "./pages/TeacherDirectory.jsx";
import Calendar from "./pages/Calendar.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "classes",
                element: <Classes />,
            },
            {
                path: "classes/:classId",
                element: <ClassPage />,
            },
            {
                path: "classes/:classId/assignments",
                element: <Assignments />,
            },
            {
                path: "classes/:classId/grades",
                element: <Grades />,
            },
            {
                path: "classes/:classId/roster",
                element: <Roster />,
            },
            {
                path: "students",
                element: <Students />,
            },
            {
                path: "teacherdirectory",
                element: <TeacherDirectory />,
            },
            {
                path: "calendar",
                element: <Calendar />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
