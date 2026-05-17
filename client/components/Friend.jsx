"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getProfilePhotoByAddress } from "../context/ChatAppContext";
import { FaUser } from "react-icons/fa";

const Friend = ({ el, i, readMessage, readUser, unreadCount }) => {
    const [photo, setPhoto] = useState(() => getProfilePhotoByAddress(el.pubkey));

    // Listen for profile photo changes broadcast by Settings
    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.address?.toLowerCase() === el.pubkey?.toLowerCase()) {
                setPhoto(e.detail.url || null);
            }
        };
        window.addEventListener("profilePhotoChanged", handler);
        return () => window.removeEventListener("profilePhotoChanged", handler);
    }, [el.pubkey]);

    // Re-read from localStorage whenever the friend's address changes
    useEffect(() => {
        setPhoto(getProfilePhotoByAddress(el.pubkey));
    }, [el.pubkey]);

    return (
        <div
            className="Friend_box_left_user"
            onClick={() => {
                readMessage(el.pubkey);
                readUser(el.pubkey);
            }}
        >
            {photo ? (
                <img
                    src={photo}
                    alt={el.name}
                    width={50}
                    height={50}
                    className="Friend_box_left_user_img"
                    style={{ borderRadius: "50%", objectFit: "cover", width: 50, height: 50 }}
                />
            ) : (
                <div className="Friend_avatar_fallback">
                    <FaUser size={22} />
                </div>
            )}
            <div className="Friend_box_left_user_info">
                <div className="Friend_box_left_user_info_name">
                    <div className="Friend_box_left_user_info_name_row">
                        <h4>{el.name}</h4>
                        {unreadCount > 0 && (
                            <span className="unread_badge">{unreadCount}</span>
                        )}
                    </div>
                    <small>{el.pubkey.slice(0, 25)}..</small>
                </div>
            </div>
        </div>
    );
};

export default Friend;
