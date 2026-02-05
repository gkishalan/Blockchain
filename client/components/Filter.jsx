"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";
import Model from "./Model";
import { FaSearch, FaUserPlus } from "react-icons/fa";

const Filter = () => {
    const { account, addFriends } = useContext(ChatAppContext);
    const [addFriend, setAddFriend] = useState(false);

    return (
        <div className="Filter">
            <div className="Filter_box">
                <div className="Filter_box_left">
                    <div className="Filter_box_left_search">
                        <FaSearch color="white" />
                        <input type="text" placeholder="Search.." />
                    </div>
                </div>
                <div className="Filter_box_right">
                    <button onClick={() => setAddFriend(true)}>
                        <FaUserPlus />
                        Add Friend
                    </button>
                </div>
            </div>

            {/* Model */}
            {addFriend && (
                <div className="modelBox">
                    <Model
                        openBox={setAddFriend}
                        title="WELCOME TO"
                        head="CHAT BUDDY"
                        info="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum sit doloribus quod vel expedita, facilis neque."
                        smallInfo="Kindley select your friend name & address..."
                        image="/assets/hero.png"
                        functionName={addFriends}
                    />
                </div>
            )}
        </div>
    );
};

export default Filter;
