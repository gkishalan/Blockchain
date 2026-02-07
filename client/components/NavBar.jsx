"use client";

import React, { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChatAppContext } from "../context/ChatAppContext";
import { MdWidgets, MdClose, MdMenu } from "react-icons/md";
import { FaUser, FaPlus, FaWallet } from "react-icons/fa";
import Model from "./Model";
import UserCard from "./UserCard";
import Error from "./Error";

const NavBar = () => {
    const menuItems = [
        {
            menu: "All Users",
            link: "alluser",
        },
        {
            menu: "Chat",
            link: "/",
        },
        {
            menu: "Profile",
            link: "profile",
        },
        {
            menu: "Settings",
            link: "/",
        },
        {
            menu: "FAQs",
            link: "/",
        },
        {
            menu: "Terms of Use",
            link: "/",
        },
    ];

    const [active, setActive] = useState(2);
    const [open, setOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { account, userName, connectWallet, createAccount, error } = useContext(ChatAppContext);

    return (
        <div className="NavBar">
            <div className="NavBar_box">
                <div className="NavBar_box_left">
                    <Image src="/assets/logo.png" alt="logo" width={50} height={50} />
                </div>
                <div className="NavBar_box_right">
                    {/* Desktop */}
                    <div className="NavBar_box_right_menu">
                        {menuItems.map((el, i) => (
                            <div
                                onClick={() => setActive(i + 1)}
                                key={i + 1}
                                className={`${active == i + 1 ? "active_btn" : ""}`}
                            >
                                <Link className="NavBar_box_right_menu_items" href={el.link}>
                                    {el.menu}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Mobile */}
                    {open && (
                        <div className="mobile_menu">
                            {menuItems.map((el, i) => (
                                <div
                                    onClick={() => {
                                        setActive(i + 1);
                                        setOpen(false); // Close menu on click
                                    }}
                                    key={i + 1}
                                    className={`${active == i + 1 ? "mobile_menu_items_active" : "mobile_menu_items"}`}
                                >
                                    <Link className="mobile_menu_items_link" href={el.link}>
                                        {el.menu}
                                    </Link>
                                </div>
                            ))}
                            <p className="mobile_menu_btn">
                                <MdClose onClick={() => setOpen(false)} size={30} />
                            </p>
                        </div>
                    )}

                    {/* Connect Wallet */}
                    <div className="NavBar_box_right_connect">
                        {account == "" ? (
                            <button onClick={() => connectWallet()}>
                                <FaWallet />
                                <span>Connect Wallet</span>
                            </button>
                        ) : (
                            <button onClick={() => setOpenModel(true)}>
                                {userName ? <FaUser /> : <FaPlus />}
                                <small>{userName || "Create Account"}</small>
                            </button>
                        )}
                    </div>

                    <div className="NavBar_box_right_open" onClick={() => setOpen(true)}>
                        <MdMenu size={30} />
                    </div>
                </div>
            </div>

            {/* Model Component */}
            {/* Model Component */}
            {openModel && mounted && createPortal(
                <div className="modelBox">
                    <Model
                        openBox={setOpenModel}
                        title="WELCOME TO"
                        head="CHAT BUDDY"
                        info="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum sit doloribus quod vel expedita, facilis neque."
                        smallInfo="Kindley select your name..."
                        image="/assets/hero.png"
                        functionName={createAccount}
                        address={account}
                    />
                </div>,
                document.body
            )}
            {error == "" ? "" : <Error error={error} />}
        </div>
    );
};

export default NavBar;
