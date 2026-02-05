"use client";

import React from "react";
import Image from "next/image";

const UserCard = ({ el, i, addFriends }) => {
    return (
        <div className="UserCard">
            <div className="UserCard_box">
                <Image
                    className="UserCard_box_img"
                    src={`/assets/img${i + 1}.png`}
                    alt="user"
                    width={100}
                    height={100}
                />

                <div className="UserCard_box_info">
                    <h3>{el.name}</h3>
                    <p>{el.accountAddress.slice(0, 25)}..</p>
                    <button
                        onClick={() =>
                            addFriends({ name: el.name, accountAddress: el.accountAddress })
                        }
                    >
                        Add Friend
                    </button>
                </div>
            </div>
            <small className="number">{i + 1}</small>
        </div>
    );
};

export default UserCard;
