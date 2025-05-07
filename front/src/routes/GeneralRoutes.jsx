import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import TeacherPage from "../pages/TeacherPage.jsx";

const GeneralRoutes = (
    <>
        <Route path="/auth/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
    </>
);

export default GeneralRoutes;