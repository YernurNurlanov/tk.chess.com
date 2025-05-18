import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import TeacherPage from "../pages/TeacherPage.jsx";
import StudentPage from "../pages/StudentPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Room from "../pages/Room.jsx";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/room/:id" element={<Room />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;