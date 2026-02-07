"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatAppContext } from "../context/ChatAppContext";
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

const Chat = ({ functionName, readMessage, deleteMessage, friendMsg, account, userName, loading, currentUserName, currentUserAddress }) => {
    const { clearCurrentChat, setError } = useContext(ChatAppContext);
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

    const checkVideo = (msg) => {
        return /^data:video\/(mp4|webm|ogg);base64,/.test(msg);
    };

    const checkDocument = (msg) => {
        return /^data:application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document);base64,/.test(msg);
    };

    const router = useRouter();

    useEffect(() => {
        // if (!router.isReady) return;
        // const { name, address } = router.query;
        // setChatData({ name, address });
    }, []);

    const [readUser, setReadUser] = useState("");

    // File Upload Handler with Compression for Images
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            // If it's an image, we can compress it
            if (file.type.startsWith("image/")) {
                // Determine max input size for images (e.g. 10MB) - we will compress it anyway
                if (file.size > 10 * 1024 * 1024) {
                    setError("Image is too large. Please select an image under 10MB.");
                    e.target.value = "";
                    return;
                }

                reader.onload = (readerEvent) => {
                    const img = new window.Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const MAX_WIDTH = 500; // Increased resolution slightly
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // Compress to JPEG 
                        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

                        // Check compressed size (limit ~100KB data URL length)
                        if (dataUrl.length > 150000) { // approx 150KB char length ~ 110KB bytes
                            setError("Compressed image is still too large for blockchain storage.");
                            e.target.value = "";
                        } else {
                            setMessage(dataUrl);
                        }
                    };
                    img.src = readerEvent.target.result;
                };
                reader.readAsDataURL(file);

            } else {
                // For non-images (PDF, Video), strict checks
                // Limit to 200KB to allow small docs, else reject
                if (file.size > 200 * 1024) {
                    setError("File is too large for blockchain. Please use files under 200KB.");
                    e.target.value = "";
                    return;
                }

                reader.onload = (readerEvent) => {
                    setMessage(readerEvent.target.result);
                };
                reader.readAsDataURL(file);
            }
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
                                    ) : checkVideo(el.content) ? (
                                        <video
                                            src={el.content}
                                            controls
                                            style={{
                                                maxWidth: "100%",
                                                borderRadius: "10px",
                                                marginBottom: "0.5rem",
                                            }}
                                        />
                                    ) : checkDocument(el.content) ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <FaPaperclip />
                                            <a download="document" href={el.content} style={{ color: 'inherit', textDecoration: 'underline' }}>
                                                Download Document
                                            </a>
                                        </div>
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
                                accept="image/*,video/*,.pdf,.doc,.docx"
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
