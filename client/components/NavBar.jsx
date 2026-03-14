"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatAppContext } from "../context/ChatAppContext";
import { MdClose, MdMenu } from "react-icons/md";
import { FaUser } from "react-icons/fa";
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
            link: "settings",
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

    const { userName, error } = useContext(ChatAppContext);

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
                                        setOpen(false);
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

                    {/* User Button */}
                    <div className="NavBar_box_right_connect">
                        <button>
                            <FaUser />
                            <small>{userName}</small>
                        </button>
                    </div>

                    <div className="NavBar_box_right_open" onClick={() => setOpen(true)}>
                        <MdMenu size={30} />
                    </div>
                </div>
            </div>
            {error == "" ? "" : <Error error={error} />}
        </div>
    );
};

export default NavBar;

