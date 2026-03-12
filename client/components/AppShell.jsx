"use client";

import React, { useContext } from "react";
import { ChatAppContext } from "../context/ChatAppContext";
import NavBar from "./NavBar";
import LoginPage from "./LoginPage";

const AppShell = ({ children }) => {
    const { userName, account } = useContext(ChatAppContext);

    // Show login page if no account or no username
    if (!userName) {
        return <LoginPage />;
    }

    // Show main app with NavBar
    return (
        <>
            <NavBar />
            {children}
        </>
    );
};

export default AppShell;
