import React from 'react';
import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import TeacherPage from "../pages/TeacherPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Room from "../pages/Room.jsx";
import StudentPage from "../pages/StudentPage.jsx";
import AIChessRoom from '../pages/AIChessRoom';

const GeneralRoutes = (
    <>
        <Route path="/auth/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/ai-room/:id" element={<AIChessRoom />} />
    </>
);

export default GeneralRoutes;