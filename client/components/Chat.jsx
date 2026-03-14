"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatAppContext } from "../context/ChatAppContext";
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

const Chat = ({ functionName, readMessage, deleteMessage, friendMsg, account, userName, loading, currentUserName, currentUserAddress }) => {
    const { clearCurrentChat, setError, readStatusMap } = useContext(ChatAppContext);
    const [message, setMessage] = useState("");
    const [chatData, setChatData] = useState({
        name: "",
        address: "",
    });

    // State to track which message is selected for deletion
    const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);

    const checkImage = (msg) => {
        // Match image extensions in URLs (including /uploads/ paths)
        const hasImageExt = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(msg);
        const isUrl = /^(\/|http|https)/i.test(msg);
        const isDataUrl = /^data:image\/(jpeg|jpg|gif|png|webp);base64,/.test(msg);
        return (hasImageExt && isUrl) || isDataUrl;
    };

    const checkVideo = (msg) => {
        const hasVideoExt = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(msg);
        const isUrl = /^(\/|http|https)/i.test(msg);
        const isDataUrl = /^data:video\/(mp4|webm|ogg);base64,/.test(msg);
        return (hasVideoExt && isUrl) || isDataUrl;
    };

    const checkDocument = (msg) => {
        const hasDocExt = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)(\?.*)?$/i.test(msg);
        const isUrl = /^(\/|http|https)/i.test(msg);
        const isDataUrl = /^data:application\/(pdf|msword|vnd\.openxmlformats)/i.test(msg);
        return (hasDocExt && isUrl) || isDataUrl;
    };

    const router = useRouter();

    useEffect(() => {
        // if (!router.isReady) return;
        // const { name, address } = router.query;
        // setChatData({ name, address });
    }, []);

    // Determine message status: 'sent', 'delivered', or 'read'
    const getMessageStatus = (msgIndex) => {
        if (!currentUserAddress) return 'sent';
        const friendAddr = currentUserAddress.toLowerCase();
        const statusInfo = readStatusMap[friendAddr];
        if (!statusInfo) return 'sent';

        // msgIndex is 0-based, friendLastSeen is a count (1-based length)
        const messagePosition = msgIndex + 1;

        if (statusInfo.friendLastSeen >= messagePosition) {
            return 'read';
        }
        // If friend has fetched messages at all (totalMessages > 0 means they exist on chain)
        // and the message is within total, it's at least "delivered" (on-chain)
        if (statusInfo.totalMessages >= messagePosition) {
            return 'delivered';
        }
        return 'sent';
    };

    // MessageStatus tick mark component
    const MessageStatus = ({ status }) => {
        if (status === 'read') {
            // Double cyan ticks
            return (
                <span className="msg_status msg_status_read" title="Read">
                    <svg width="20" height="14" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.071 0.653a0.457 0.457 0 0 0-0.637 0.056L5.435 6.652 2.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L5.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                        <path d="M14.071 0.653a0.457 0.457 0 0 0-0.637 0.056L8.435 6.652 7.5 5.8" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                        <path d="M14.071 0.653a0.457 0.457 0 0 0-0.637 0.056L8.435 6.652 5.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L8.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                    </svg>
                </span>
            );
        }
        if (status === 'delivered') {
            // Double grey ticks
            return (
                <span className="msg_status msg_status_delivered" title="Delivered">
                    <svg width="20" height="14" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.071 0.653a0.457 0.457 0 0 0-0.637 0.056L5.435 6.652 2.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L5.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                        <path d="M14.071 0.653a0.457 0.457 0 0 0-0.637 0.056L8.435 6.652 5.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L8.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                    </svg>
                </span>
            );
        }
        // Single grey tick (sent)
        return (
            <span className="msg_status msg_status_sent" title="Sent">
                <svg width="16" height="14" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.071 0.653a0.457 0.457 0 0 0-0.637 0.056L5.435 6.652 2.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L5.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                </svg>
            </span>
        );
    };

    const [readUser, setReadUser] = useState("");

    const [uploading, setUploading] = useState(false);

    // Upload a file (or blob) to local storage via our API route
    const uploadFile = async (fileOrBlob) => {
        const formData = new FormData();
        formData.append("file", fileOrBlob);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();
        return data.url;
    };

    // File Upload Handler — uploads to IPFS, stores only the URL on-chain
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            if (file.type.startsWith("image/")) {
                // Limit input to 20MB for images
                if (file.size > 20 * 1024 * 1024) {
                    setError("Image is too large. Please select an image under 20MB.");
                    e.target.value = "";
                    setUploading(false);
                    return;
                }

                // Compress image before uploading to save IPFS storage
                const compressedBlob = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        const img = new window.Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const MAX_WIDTH = 800;
                            const scale = Math.min(1, MAX_WIDTH / img.width);
                            canvas.width = img.width * scale;
                            canvas.height = img.height * scale;

                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            canvas.toBlob(
                                (blob) => resolve(blob),
                                "image/jpeg",
                                0.8
                            );
                        };
                        img.onerror = reject;
                        img.src = readerEvent.target.result;
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const url = await uploadFile(
                    new File([compressedBlob], file.name || "image.jpg", { type: "image/jpeg" })
                );
                setMessage(url);

            } else if (file.type.startsWith("video/")) {
                if (file.size > 50 * 1024 * 1024) {
                    setError("Video is too large. Please select a video under 50MB.");
                    e.target.value = "";
                    setUploading(false);
                    return;
                }
                const url = await uploadFile(file);
                setMessage(url);

            } else {
                // Documents (PDF, DOC, etc.)
                if (file.size > 10 * 1024 * 1024) {
                    setError("File is too large. Please select a file under 10MB.");
                    e.target.value = "";
                    setUploading(false);
                    return;
                }
                const url = await uploadFile(file);
                setMessage(url);
            }
        } catch (err) {
            console.error("File upload error:", err);
            setError("Failed to upload file. Please check your connection and try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
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
                                        {el.sender.toLowerCase() === account.toLowerCase() && (
                                            <MessageStatus status={getMessageStatus(i)} />
                                        )}
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



                            {loading || uploading ? (
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
