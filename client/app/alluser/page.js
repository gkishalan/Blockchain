"use client";

import React, { useState, useEffect, useContext } from "react";
import UserCard from "../../components/UserCard";
import { ChatAppContext } from "../../context/ChatAppContext";

const alluser = () => {
    const { userLists, addFriends, account } = useContext(ChatAppContext);
    return (
        <div>
            <div className="alluser_info">
                <h1>Find Your Friends</h1>
            </div>

            <div className="alluser_info">
                {userLists.map((el, i) => {
                    if (el.accountAddress.toLowerCase() === account.toLowerCase()) return null;
                    return <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />;
                })}
            </div>
        </div>
    );
};

export default alluser;
