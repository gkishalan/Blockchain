"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatAppContext } from "../context/ChatAppContext";
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

const Chat = ({ functionName, readMessage, deleteMessage, friendMsg, account, userName, loading, currentUserName, currentUserAddress }) => {
    const { clearCurrentChat } = useContext(ChatAppContext);
    const [message, setMessage] = useState("");
    const [chatData, setChatData] = useState({
        name: "",
        address: "",
    });

    // State to track which message is selected for deletion
    const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);

    const checkImage = (msg) => {
        const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(msg);
        const isUrl = /^(http|https):\/\//i.test(msg);
        const isDataUrl = /^data:image\/(jpeg|jpg|gif|png|webp);base64,/.test(msg);
        return (isImage && isUrl) || isDataUrl;
    };

    const router = useRouter();

    useEffect(() => {
        // if (!router.isReady) return;
        // const { name, address } = router.query;
        // setChatData({ name, address });
    }, []);

    const [readUser, setReadUser] = useState("");

    // File Upload Handler with Compression
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 300; // Resize to small width for gas optimization
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                    setMessage(dataUrl);
                };
                img.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="Chat">
            {currentUserName && currentUserAddress ? (
                <div className="Chat_user_info">
                    <div className="mobile_back_btn" onClick={() => clearCurrentChat()}>
                        <FaArrowLeft size={20} />
                    </div>
                    <Image src="/assets/img1.png" alt="image" width={70} height={70} />
                    <div className="Chat_user_info_box">
                        <h4>{currentUserName}</h4>
                        <p className="show">{currentUserAddress}</p>
                    </div>
                </div>
            ) : (
                ""
            )}

            <div className="Chat_box_box">
                <div className="Chat_box">
                    <div className="Chat_box_left">
                        {friendMsg.map((el, i) => (
                            <div
                                key={i + 1}
                                className={
                                    el.sender.toLowerCase() === account.toLowerCase()
                                        ? "chat_message_right"
                                        : "chat_message_left"
                                }
                            >
                                <div className="chat_message_box">
                                    {checkImage(el.content) ? (
                                        <img
                                            src={el.content}
                                            alt="Sent image"
                                            style={{
                                                maxWidth: "100%",
                                                borderRadius: "10px",
                                                marginBottom: "0.5rem",
                                            }}
                                        />
                                    ) : (
                                        <p>{el.content}</p>
                                    )}
                                    <small>
                                        {new Date(Number(el.timestamp) * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {currentUserName && currentUserAddress ? (
                    <div className="Chat_box_send">
                        <div className="Chat_box_send_img">
                            <FaSmile size={25} style={{ cursor: "pointer" }} />
                            <input
                                type="text"
                                placeholder="Type your message"
                                value={message} // Controlled input
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {/* Paperclip Trigger */}
                            <label htmlFor="fileInput">
                                <FaPaperclip size={25} style={{ cursor: "pointer" }} />
                            </label>



                            {loading ? (
                                <div className="Loader">
                                    <Image src="/assets/loader.gif" alt="loader" width={50} height={50} />
                                </div>
                            ) : (
                                <div className="send_icon" onClick={() => {
                                    functionName({ msgAddress: currentUserAddress, msg: message });
                                    setMessage("");
                                }}>
                                    <FaPaperPlane size={18} />
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default Chat;
