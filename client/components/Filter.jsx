"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";
import { useLanguage } from "../context/LanguageContext";
import Model from "./Model";
import { FaSearch, FaUserPlus } from "react-icons/fa";

const Filter = () => {
    const { account, addFriends } = useContext(ChatAppContext);
    const { t } = useLanguage();
    const [addFriend, setAddFriend] = useState(false);

    return (
        <div className="Filter">
            <div className="Filter_box">
                <div className="Filter_box_left">
                    <div className="Filter_box_left_search">
                        <FaSearch color="white" />
                        <input type="text" placeholder={t("filter_search")} />
                    </div>
                </div>
                <div className="Filter_box_right">
                    <button onClick={() => setAddFriend(true)}>
                        <FaUserPlus />
                        {t("filter_addFriend")}
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
