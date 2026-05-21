import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Classes from "./pages/Classes.jsx";
import ClassPage from "./pages/ClassPage.jsx";
import Students from "./pages/Students.jsx";
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
                path: "dashboard",
                element: <Dashboard />,
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
