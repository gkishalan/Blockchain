"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatAppContext } from "../context/ChatAppContext";
import { getProfilePhotoByAddress } from "../context/ChatAppContext";
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft, FaCopy, FaTrash, FaBan, FaTimes, FaUser, FaDownload, FaExternalLinkAlt, FaFileWord, FaFilePdf, FaFileAlt } from "react-icons/fa";

const Chat = ({ functionName, readMessage, friendMsg, account, userName, loading, currentUserName, currentUserAddress }) => {
    const { clearCurrentChat, setError, readStatusMap, deleteMessage, hideMessageForMe, getHiddenMessages } = useContext(ChatAppContext);
    const [message, setMessage] = useState("");
    const [chatData, setChatData] = useState({
        name: "",
        address: "",
    });

    // Friend's profile photo
    const [friendPhoto, setFriendPhoto] = useState(null);
    useEffect(() => {
        setFriendPhoto(getProfilePhotoByAddress(currentUserAddress));
    }, [currentUserAddress]);
    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.address?.toLowerCase() === currentUserAddress?.toLowerCase()) {
                setFriendPhoto(e.detail.url || null);
            }
        };
        window.addEventListener("profilePhotoChanged", handler);
        return () => window.removeEventListener("profilePhotoChanged", handler);
    }, [currentUserAddress]);

    // Context menu state
    const [contextMenu, setContextMenu] = useState({ visible: false, msgIndex: null, x: 0, y: 0 });
    const contextMenuRef = useRef(null);

    // Check if a message is an IPFS gateway URL (Pinata gateway endpoint)
    const isIpfsUrl = (msg) => {
        return /^https?:\/\/.*\.(mypinata\.cloud|pinata\.cloud)\/(ipfs|files)\//i.test(msg) ||
               /^ipfs:\/\//i.test(msg);
    };

    const checkImage = (msg) => {
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

    const isMediaOrFile = (msg) => checkImage(msg) || checkVideo(msg) || checkDocument(msg) || isIpfsUrl(msg);

    const router = useRouter();

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenu({ visible: false, msgIndex: null, x: 0, y: 0 });
            }
        };
        if (contextMenu.visible) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [contextMenu.visible]);

    // Determine message status: 'sent', 'delivered', or 'read'
    const getMessageStatus = (msgIndex) => {
        if (!currentUserAddress) return 'sent';
        const friendAddr = currentUserAddress.toLowerCase();
        const statusInfo = readStatusMap[friendAddr];
        if (!statusInfo) return 'sent';

        const messagePosition = msgIndex + 1;

        if (statusInfo.friendLastSeen >= messagePosition) {
            return 'read';
        }
        if (statusInfo.totalMessages >= messagePosition) {
            return 'delivered';
        }
        return 'sent';
    };

    // MessageStatus tick mark component
    const MessageStatus = ({ status }) => {
        if (status === 'read') {
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
            return (
                <span className="msg_status msg_status_delivered" title="Delivered">
                    <svg width="20" height="14" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.071 0.653a0.457 0.457 0 0 0-0.637 0.056L5.435 6.652 2.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L5.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                        <path d="M14.071 0.653a0.457 0.457 0 0 0-0.637 0.056L8.435 6.652 5.684 4.2a0.457 0.457 0 0 0-0.636 0.056 0.457 0.457 0 0 0 0.056 0.636L8.155 7.67a0.457 0.457 0 0 0 0.636-0.056l5.336-6.324a0.457 0.457 0 0 0-0.056-0.637z" fill="currentColor"/>
                    </svg>
                </span>
            );
        }
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

    // Upload a file to Pinata IPFS via our API route
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

    // File Upload Handler
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            if (file.type.startsWith("image/")) {
                if (file.size > 20 * 1024 * 1024) {
                    setError("Image is too large. Please select an image under 20MB.");
                    e.target.value = "";
                    setUploading(false);
                    return;
                }

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

    // --- Context Menu Handlers ---
    const handleMessageClick = (e, msgIndex) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const isSender = friendMsg[msgIndex]?.sender?.toLowerCase() === account.toLowerCase();
        setContextMenu({
            visible: true,
            msgIndex,
            isSender,
            x: isSender ? rect.right : rect.left,
            y: rect.top,
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, msgIndex: null, x: 0, y: 0 });
    };

    const handleCopy = (content) => {
        if (content) {
            navigator.clipboard.writeText(content);
        }
        closeContextMenu();
    };

    const handleDeleteForEveryone = async (msgIndex, content) => {
        closeContextMenu();
        if (!window.confirm("Delete this message for everyone? This cannot be undone.")) return;
        await deleteMessage({
            friendAddress: currentUserAddress,
            msgIndex,
            messageContent: content,
        });
    };

    const handleDeleteForMe = (msgIndex) => {
        closeContextMenu();
        hideMessageForMe(currentUserAddress, msgIndex);
    };

    // Get hidden messages for current chat
    const hiddenMsgIndices = currentUserAddress ? getHiddenMessages(currentUserAddress) : [];

    // Render message content
    const renderMessageContent = (content) => {
        if (!content || content === "") {
            return (
                <p className="deleted_message">
                    <FaBan style={{ marginRight: '0.4rem', opacity: 0.7 }} />
                    This message was deleted
                </p>
            );
        }

        if (checkImage(content)) {
            return (
                <img
                    src={content}
                    alt="Sent image"
                    style={{ maxWidth: "100%", borderRadius: "10px", marginBottom: "0.5rem", display: "block" }}
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }
        if (checkVideo(content)) {
            return (
                <video
                    src={content}
                    controls
                    style={{ maxWidth: "100%", borderRadius: "10px", marginBottom: "0.5rem" }}
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }
        if (checkDocument(content)) {
            // Detect file extension for icon & label
            const ext = (content.match(/\.([a-zA-Z0-9]+)(?:\?|$)/) || [])[1]?.toLowerCase();
            const isPdf = ext === "pdf";
            const isWord = ext === "doc" || ext === "docx";
            const FileIcon = isPdf ? FaFilePdf : isWord ? FaFileWord : FaFileAlt;
            const iconColor = isPdf ? "#ef4444" : isWord ? "#3b82f6" : "#94a3b8";
            const label = ext ? ext.toUpperCase() + " Document" : "Document";
            // Extract filename from URL
            const filename = decodeURIComponent(content.split("/").pop().split("?")[0]) || label;

            return (
                <div className="chat_file_bubble" onClick={(e) => e.stopPropagation()}>
                    <div className="chat_file_bubble_icon" style={{ color: iconColor }}>
                        <FileIcon size={28} />
                    </div>
                    <div className="chat_file_bubble_info">
                        <span className="chat_file_bubble_name">{filename}</span>
                        <span className="chat_file_bubble_type">{label}</span>
                    </div>
                    <div className="chat_file_bubble_actions">
                        <a
                            href={content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chat_file_action_btn"
                            title="Open in new tab"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaExternalLinkAlt size={13} />
                        </a>
                        <a
                            href={content}
                            download={filename}
                            className="chat_file_action_btn"
                            title="Download"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaDownload size={13} />
                        </a>
                    </div>
                </div>
            );
        }
        if (isIpfsUrl(content)) {
            // Try to render as image first; if it fails, show a file card
            const filename = decodeURIComponent(content.split("/").pop().split("?")[0]) || "IPFS File";
            return (
                <div className="ipfs_file_container" style={{ marginBottom: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                    <img
                        src={content}
                        alt="Shared file"
                        style={{ maxWidth: "100%", borderRadius: "10px", display: "block" }}
                        onError={(ev) => {
                            ev.target.style.display = 'none';
                            ev.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="chat_file_bubble" style={{ display: 'none' }}>
                        <div className="chat_file_bubble_icon">
                            <FaFileAlt size={28} />
                        </div>
                        <div className="chat_file_bubble_info">
                            <span className="chat_file_bubble_name">{filename}</span>
                            <span className="chat_file_bubble_type">IPFS File</span>
                        </div>
                        <div className="chat_file_bubble_actions">
                            <a
                                href={content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat_file_action_btn"
                                title="Open file"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaExternalLinkAlt size={13} />
                            </a>
                            <a
                                href={content}
                                download={filename}
                                className="chat_file_action_btn"
                                title="Download"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaDownload size={13} />
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
        return <p>{content}</p>;
    };

    return (
        <>
            <div className="Chat">
                {currentUserName && currentUserAddress ? (
                    <div className="Chat_user_info">
                        <div className="mobile_back_btn" onClick={() => clearCurrentChat()}>
                            <FaArrowLeft size={20} />
                        </div>
                        {friendPhoto ? (
                            <img
                                src={friendPhoto}
                                alt={currentUserName}
                                width={70}
                                height={70}
                                style={{ borderRadius: "50%", objectFit: "cover", width: 70, height: 70, border: "2px solid var(--secondary-color)" }}
                            />
                        ) : (
                            <div className="Chat_avatar_fallback">
                                <FaUser size={28} />
                            </div>
                        )}
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
                            {friendMsg.map((el, i) => {
                                if (hiddenMsgIndices.includes(i)) return null;

                                const isSender = el.sender.toLowerCase() === account.toLowerCase();
                                const isDeleted = !el.content || el.content === "";

                                return (
                                    <div
                                        key={i + 1}
                                        className={isSender ? "chat_message_right" : "chat_message_left"}
                                    >
                                        <div
                                            className={`chat_message_box ${contextMenu.visible && contextMenu.msgIndex === i ? 'chat_message_selected' : ''}`}
                                            onClick={(e) => !isDeleted && handleMessageClick(e, i)}
                                            style={{ cursor: isDeleted ? 'default' : 'pointer' }}
                                        >
                                            {renderMessageContent(el.content)}
                                            <small>
                                                {new Date(Number(el.timestamp) * 1000).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                                {isSender && !isDeleted && (
                                                    <MessageStatus status={getMessageStatus(i)} />
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {currentUserName && currentUserAddress ? (
                        <div className="Chat_box_send">
                            <div className="Chat_box_send_img">
                                <FaSmile size={25} style={{ cursor: "pointer" }} />
                                <input
                                    type="text"
                                    placeholder="Type your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />

                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: "none" }}
                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />

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

            {/* Context Menu — rendered via Portal on document.body to escape backdrop-filter */}
            {contextMenu.visible && contextMenu.msgIndex !== null && typeof document !== 'undefined' && createPortal(
                <>
                    <div className="context_menu_overlay" onClick={closeContextMenu} />
                    <div
                        ref={contextMenuRef}
                        className="context_menu"
                        style={{
                            top: `${Math.max(10, contextMenu.y - 120)}px`,
                            left: `${contextMenu.isSender
                                ? Math.max(10, contextMenu.x - 210)
                                : Math.min(contextMenu.x, window.innerWidth - 220)
                            }px`,
                        }}
                    >
                        <div className="context_menu_header">
                            <span>Message Options</span>
                            <FaTimes className="context_menu_close" onClick={closeContextMenu} />
                        </div>

                        <button
                            className="context_menu_item"
                            onClick={() => handleCopy(friendMsg[contextMenu.msgIndex]?.content)}
                        >
                            <FaCopy />
                            <span>Copy</span>
                        </button>

                        {friendMsg[contextMenu.msgIndex]?.sender?.toLowerCase() === account.toLowerCase() ? (
                            <button
                                className="context_menu_item context_menu_item_danger"
                                onClick={() => handleDeleteForEveryone(contextMenu.msgIndex, friendMsg[contextMenu.msgIndex]?.content)}
                            >
                                <FaTrash />
                                <span>Delete for Everyone</span>
                            </button>
                        ) : (
                            <button
                                className="context_menu_item context_menu_item_danger"
                                onClick={() => handleDeleteForMe(contextMenu.msgIndex)}
                            >
                                <FaTrash />
                                <span>Delete for Me</span>
                            </button>
                        )}
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export default Chat;
