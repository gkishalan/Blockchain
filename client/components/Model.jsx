"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";
import { FaUser, FaAddressCard, FaPaperPlane, FaTimes } from "react-icons/fa";

const Model = ({
    openBox,
    title,
    head,
    info,
    smallInfo,
    image,
    functionName,
    address,
}) => {
    const [name, setName] = useState("");
    const [accountAddress, setAccountAddress] = useState("");

    const { loading } = useContext(ChatAppContext);

    return (
        <div className="Model">
            <div className="Model_box">
                <div className="Model_box_left">
                    <Image src={image} alt="buddy" width={700} height={700} />
                </div>
                <div className="Model_box_right">
                    <h1>
                        {title} <span>{head}</span>
                    </h1>
                    <p>{info}</p>
                    <small>{smallInfo}</small>

                    {loading ? (
                        <div className="Loader">
                            <div className="Loader_box">
                                <Image src="/assets/loader.gif" alt="loader" width={50} height={50} />
                            </div>
                        </div>
                    ) : (
                        <div className="Model_box_right_name">
                            <div className="Model_box_right_name_info">
                                <FaUser />
                                <input
                                    type="text"
                                    placeholder="your name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="Model_box_right_name_info">
                                <FaAddressCard />
                                <input
                                    type="text"
                                    placeholder={address || "Enter address.."}
                                    onChange={(e) => setAccountAddress(e.target.value)}
                                />
                            </div>

                            <div className="Model_box_right_name_btn">
                                <button onClick={() => functionName({ name, accountAddress })}>
                                    <FaPaperPlane />
                                    Submit
                                </button>

                                <button onClick={() => openBox(false)}>
                                    <FaTimes />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Model;
