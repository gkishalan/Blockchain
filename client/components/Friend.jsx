"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";

const Friend = ({ el, i, readMessage, readUser, unreadCount }) => {
    return (
        <div
            className="Friend_box_left_user"
            onClick={() => {
                readMessage(el.pubkey);
                readUser(el.pubkey);
            }}
        >
            <Image
                src={`/assets/img${(i % 10) + 1}.png`}
                alt="user"
                width={50}
                height={50}
                className="Friend_box_left_user_img"
            />
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
