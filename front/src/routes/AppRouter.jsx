import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import GeneralRoutes from "./GeneralRoutes";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {GeneralRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;