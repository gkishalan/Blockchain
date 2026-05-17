"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";
import { saveProfilePhotoByAddress, getProfilePhotoByAddress } from "../context/ChatAppContext";
import { LANGUAGES } from "../context/translations";
import {
    FaCamera, FaUser, FaGlobe, FaComments, FaBell,
    FaDatabase, FaTrash, FaDownload, FaCheck, FaSave,
    FaPaintBrush, FaSearch, FaTimes, FaInfoCircle
} from "react-icons/fa";

const SECTIONS = [
    { id: "photo", icon: FaCamera, label: "settings_profilePhoto" },
    { id: "info", icon: FaUser, label: "settings_editInfo" },
    { id: "language", icon: FaGlobe, label: "settings_language" },
    { id: "chat", icon: FaComments, label: "settings_chatSettings" },
    { id: "notifications", icon: FaBell, label: "settings_notifications" },
    { id: "data", icon: FaDatabase, label: "settings_dataStorage" },
];

const SECTION_LABELS = {
    settings_profilePhoto: "Profile Photo",
    settings_editInfo: "Edit Info",
    settings_language: "Language",
    settings_chatSettings: "Chat Settings",
    settings_notifications: "Notifications",
    settings_dataStorage: "Data & Storage",
};

const Settings = () => {
    const { account, userName } = useContext(ChatAppContext);
    const [activeSection, setActiveSection] = useState("photo");
    const fileInputRef = useRef(null);

    // --- Profile Photo State ---
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoUploading, setPhotoUploading] = useState(false);

    // --- Edit Info State ---
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [birthday, setBirthday] = useState("");
    const [infoSaved, setInfoSaved] = useState(false);

    // --- Language State ---
    const [currentLang, setCurrentLang] = useState("en");
    const [langSearch, setLangSearch] = useState("");

    // --- Chat Settings State ---
    const [fontSize, setFontSize] = useState("medium");
    const [bubbleStyle, setBubbleStyle] = useState("rounded");
    const [enterToSend, setEnterToSend] = useState(true);

    // --- Notifications State ---
    const [messageSound, setMessageSound] = useState(true);
    const [desktopNotif, setDesktopNotif] = useState(false);

    // --- Data State ---
    const [storageUsed, setStorageUsed] = useState("0 KB");
    const [dataCleared, setDataCleared] = useState(false);
    const [dataExported, setDataExported] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        if (!account) return;
        // Load profile photo from global key (not per-account prefix)
        setProfilePhoto(getProfilePhotoByAddress(account));
        const prefix = `blockchat_${account.toLowerCase()}_`;
        setDisplayName(localStorage.getItem(prefix + "displayName") || "");
        setBio(localStorage.getItem(prefix + "bio") || "");
        setBirthday(localStorage.getItem(prefix + "birthday") || "");
        setCurrentLang(localStorage.getItem(prefix + "language") || "en");
        setFontSize(localStorage.getItem(prefix + "fontSize") || "medium");
        setBubbleStyle(localStorage.getItem(prefix + "bubbleStyle") || "rounded");
        setEnterToSend(localStorage.getItem(prefix + "enterToSend") !== "false");
        setMessageSound(localStorage.getItem(prefix + "messageSound") !== "false");
        setDesktopNotif(localStorage.getItem(prefix + "desktopNotif") === "true");
        calculateStorage();
    }, [account]);

    const saveToLocal = (key, value) => {
        if (!account) return;
        const prefix = `blockchat_${account.toLowerCase()}_`;
        localStorage.setItem(prefix + key, value);
    };

    // Broadcast profile photo change to all components on this page
    const broadcastPhotoChange = (newUrl) => {
        window.dispatchEvent(new CustomEvent('profilePhotoChanged', { detail: { address: account, url: newUrl } }));
    };

    const calculateStorage = () => {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage.getItem(key).length * 2; // UTF-16
            }
        }
        if (total < 1024) setStorageUsed(total + " B");
        else if (total < 1024 * 1024) setStorageUsed((total / 1024).toFixed(1) + " KB");
        else setStorageUsed((total / (1024 * 1024)).toFixed(2) + " MB");
    };

    // --- Photo Upload (Pinata IPFS) ---
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image under 5MB.");
            return;
        }
        setPhotoUploading(true);
        try {
            // Step 1: Compress the image in-browser (max 400×400px, JPEG 85%)
            const compressedBlob = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const img = new window.Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const MAX = 400;
                        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
                        canvas.width = img.width * scale;
                        canvas.height = img.height * scale;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
                    };
                    img.onerror = reject;
                    img.src = re.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Step 2: Upload compressed image to Pinata IPFS via existing API route
            const formData = new FormData();
            formData.append(
                "file",
                new File([compressedBlob], `profile_${account}.jpg`, { type: "image/jpeg" })
            );
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Upload failed");
            }
            const { url } = await res.json();

            // Step 3: Store the public IPFS URL in global key (tiny — just a URL string)
            // This URL is accessible from any device via Pinata's gateway
            saveProfilePhotoByAddress(account, url);
            setProfilePhoto(url);
            broadcastPhotoChange(url);
        } catch (err) {
            console.error(err);
            alert(`Failed to upload photo: ${err.message}`);
        } finally {
            setPhotoUploading(false);
            e.target.value = "";
        }
    };

    const removePhoto = () => {
        saveProfilePhotoByAddress(account, null);
        setProfilePhoto(null);
        broadcastPhotoChange(null);
    };

    // --- Save Info ---
    const saveInfo = () => {
        saveToLocal("displayName", displayName);
        saveToLocal("bio", bio);
        saveToLocal("birthday", birthday);
        setInfoSaved(true);
        setTimeout(() => setInfoSaved(false), 2000);
    };

    // --- Language ---
    const selectLanguage = (code) => {
        setCurrentLang(code);
        saveToLocal("language", code);
    };

    const filteredLanguages = LANGUAGES.filter(
        (l) =>
            l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
            l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
    );

    // --- Chat Settings ---
    const handleFontSize = (size) => {
        setFontSize(size);
        saveToLocal("fontSize", size);
    };

    const handleBubbleStyle = (style) => {
        setBubbleStyle(style);
        saveToLocal("bubbleStyle", style);
    };

    const toggleEnterToSend = () => {
        const next = !enterToSend;
        setEnterToSend(next);
        saveToLocal("enterToSend", next.toString());
    };

    // --- Notifications ---
    const toggleMessageSound = () => {
        const next = !messageSound;
        setMessageSound(next);
        saveToLocal("messageSound", next.toString());
    };

    const toggleDesktopNotif = () => {
        const next = !desktopNotif;
        setDesktopNotif(next);
        saveToLocal("desktopNotif", next.toString());
        if (next && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    };

    // --- Data ---
    const clearData = () => {
        if (!window.confirm("Are you sure? This will clear all local chat data.")) return;
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("lastSeen_")) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        setDataCleared(true);
        calculateStorage();
        setTimeout(() => setDataCleared(false), 2000);
    };

    const exportData = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blockchat_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setDataExported(true);
        setTimeout(() => setDataExported(false), 2000);
    };

    // --- Renderers ---
    const renderPhoto = () => (
        <div className="Settings_section">
            <h2><FaCamera /> Profile Photo</h2>
            <p className="Settings_section_hint">Upload a photo from your device. Max 5MB.</p>
            <div className="Settings_photo_container">
                <div className="Settings_photo_preview">
                    {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" />
                    ) : (
                        <div className="Settings_photo_placeholder">
                            <FaUser size={40} />
                        </div>
                    )}
                    <div
                        className="Settings_photo_overlay"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FaCamera size={20} />
                        <span>{photoUploading ? "Uploading..." : "Change"}</span>
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                />
                <div className="Settings_photo_actions">
                    <button
                        className="Settings_btn Settings_btn_primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photoUploading}
                    >
                        <FaCamera /> {profilePhoto ? "Change Photo" : "Upload Photo"}
                    </button>
                    {profilePhoto && (
                        <button className="Settings_btn Settings_btn_outline" onClick={removePhoto}>
                            <FaTrash /> Remove Photo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderInfo = () => (
        <div className="Settings_section">
            <h2><FaUser /> Edit Info</h2>

            <div className="Settings_field">
                <label>Username (on-chain)</label>
                <div className="Settings_input_group Settings_input_disabled">
                    <input type="text" value={userName || ""} disabled />
                    <FaInfoCircle className="Settings_field_icon" title="Username is stored on the blockchain and cannot be changed here." />
                </div>
                <small className="Settings_field_hint">Stored on the blockchain — cannot be changed.</small>
            </div>

            <div className="Settings_field">
                <label>Wallet Address</label>
                <div className="Settings_input_group Settings_input_disabled">
                    <input type="text" value={account || ""} disabled />
                </div>
            </div>

            <div className="Settings_field">
                <label>Display Name</label>
                <div className="Settings_input_group">
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter a display name..."
                        maxLength={50}
                    />
                </div>
            </div>

            <div className="Settings_field">
                <label>Bio</label>
                <textarea
                    className="Settings_textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell something about yourself..."
                    maxLength={200}
                    rows={3}
                />
                <small className="Settings_field_hint">{bio.length}/200 characters</small>
            </div>

            <div className="Settings_field">
                <label>Birthday</label>
                <div className="Settings_input_group">
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </div>
            </div>

            <button className="Settings_btn Settings_btn_primary Settings_btn_save" onClick={saveInfo}>
                {infoSaved ? <><FaCheck /> Saved!</> : <><FaSave /> Save Changes</>}
            </button>
        </div>
    );

    const renderLanguage = () => (
        <div className="Settings_section">
            <h2><FaGlobe /> Language</h2>
            <p className="Settings_section_hint">Select your preferred language for the app interface.</p>

            <div className="Settings_lang_search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search languages..."
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                />
                {langSearch && (
                    <FaTimes className="Settings_lang_search_clear" onClick={() => setLangSearch("")} />
                )}
            </div>

            <div className="Settings_lang_list">
                {filteredLanguages.map((lang) => (
                    <div
                        key={lang.code}
                        className={`Settings_lang_item ${currentLang === lang.code ? "Settings_lang_item_active" : ""}`}
                        onClick={() => selectLanguage(lang.code)}
                    >
                        <div className="Settings_lang_item_info">
                            <span className="Settings_lang_native">{lang.nativeName}</span>
                            <span className="Settings_lang_english">{lang.name}</span>
                        </div>
                        {currentLang === lang.code && (
                            <FaCheck className="Settings_lang_check" />
                        )}
                    </div>
                ))}
                {filteredLanguages.length === 0 && (
                    <p className="Settings_lang_empty">No languages found.</p>
                )}
            </div>
        </div>
    );

    const renderChatSettings = () => (
        <div className="Settings_section">
            <h2><FaComments /> Chat Settings</h2>

            <div className="Settings_option_group">
                <div className="Settings_option_header">
                    <span>Font Size</span>
                </div>
                <div className="Settings_font_selector">
                    {["small", "medium", "large"].map((size) => (
                        <button
                            key={size}
                            className={`Settings_font_btn ${fontSize === size ? "Settings_font_btn_active" : ""}`}
                            onClick={() => handleFontSize(size)}
                        >
                            <span style={{ fontSize: size === "small" ? "0.8rem" : size === "medium" ? "1rem" : "1.2rem" }}>
                                Aa
                            </span>
                            <small>{size.charAt(0).toUpperCase() + size.slice(1)}</small>
                        </button>
                    ))}
                </div>
            </div>

            <div className="Settings_option_group">
                <div className="Settings_option_header">
                    <span>Message Bubble Style</span>
                </div>
                <div className="Settings_bubble_selector">
                    <button
                        className={`Settings_bubble_btn ${bubbleStyle === "rounded" ? "Settings_bubble_btn_active" : ""}`}
                        onClick={() => handleBubbleStyle("rounded")}
                    >
                        <div className="Settings_bubble_preview Settings_bubble_rounded">Hello!</div>
                        <small>Rounded</small>
                    </button>
                    <button
                        className={`Settings_bubble_btn ${bubbleStyle === "sharp" ? "Settings_bubble_btn_active" : ""}`}
                        onClick={() => handleBubbleStyle("sharp")}
                    >
                        <div className="Settings_bubble_preview Settings_bubble_sharp">Hello!</div>
                        <small>Sharp</small>
                    </button>
                </div>
            </div>

            <div className="Settings_toggle_row">
                <div className="Settings_toggle_info">
                    <span>Press Enter to Send</span>
                    <small>When enabled, pressing Enter sends the message. Use Shift+Enter for new line.</small>
                </div>
                <div className={`Settings_toggle ${enterToSend ? "Settings_toggle_on" : ""}`} onClick={toggleEnterToSend}>
                    <div className="Settings_toggle_thumb" />
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="Settings_section">
            <h2><FaBell /> Notifications</h2>

            <div className="Settings_toggle_row">
                <div className="Settings_toggle_info">
                    <span>Message Sound</span>
                    <small>Play a sound when you receive a new message.</small>
                </div>
                <div className={`Settings_toggle ${messageSound ? "Settings_toggle_on" : ""}`} onClick={toggleMessageSound}>
                    <div className="Settings_toggle_thumb" />
                </div>
            </div>

            <div className="Settings_toggle_row">
                <div className="Settings_toggle_info">
                    <span>Desktop Notifications</span>
                    <small>Show browser notifications for new messages.</small>
                </div>
                <div className={`Settings_toggle ${desktopNotif ? "Settings_toggle_on" : ""}`} onClick={toggleDesktopNotif}>
                    <div className="Settings_toggle_thumb" />
                </div>
            </div>
        </div>
    );

    const renderData = () => (
        <div className="Settings_section">
            <h2><FaDatabase /> Data & Storage</h2>

            <div className="Settings_data_stat">
                <span>Local Storage Used</span>
                <span className="Settings_data_value">{storageUsed}</span>
            </div>

            <div className="Settings_data_actions">
                <div className="Settings_data_card" onClick={clearData}>
                    <div className="Settings_data_card_icon Settings_data_card_danger">
                        <FaTrash />
                    </div>
                    <div className="Settings_data_card_info">
                        <span>Clear Chat Data</span>
                        <small>Clear all locally cached chat data. Blockchain messages are not affected.</small>
                    </div>
                    {dataCleared && <span className="Settings_data_badge">Cleared!</span>}
                </div>

                <div className="Settings_data_card" onClick={exportData}>
                    <div className="Settings_data_card_icon Settings_data_card_export">
                        <FaDownload />
                    </div>
                    <div className="Settings_data_card_info">
                        <span>Export Chat Data</span>
                        <small>Download all your chat data as a JSON file.</small>
                    </div>
                    {dataExported && <span className="Settings_data_badge">Exported!</span>}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "photo": return renderPhoto();
            case "info": return renderInfo();
            case "language": return renderLanguage();
            case "chat": return renderChatSettings();
            case "notifications": return renderNotifications();
            case "data": return renderData();
            default: return renderPhoto();
        }
    };

    return (
        <div className="Settings">
            <div className="Settings_box">
                <div className="Settings_header">
                    <h1>Settings</h1>
                    <p>Customize your BlockChat experience</p>
                </div>

                <div className="Settings_layout">
                    {/* Sidebar */}
                    <div className="Settings_sidebar">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <div
                                    key={section.id}
                                    className={`Settings_sidebar_item ${activeSection === section.id ? "Settings_sidebar_item_active" : ""}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <Icon />
                                    <span>{SECTION_LABELS[section.label]}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="Settings_content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
