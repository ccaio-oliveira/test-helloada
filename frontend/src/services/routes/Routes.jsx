import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import Dashboard from "../../pages/Dashboard/Dashboard";
import React from "react";

const RouteElement = () => {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        <Route path="/" Component={Login} />
                        <Route path="/register" Component={Register} />
                        <Route path="/dashboard" Component={Dashboard} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </Router>
    )
}

export default React.memo(RouteElement);