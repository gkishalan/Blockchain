"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { ChatAppContext } from "../context/ChatAppContext";
import { FaUser, FaWallet, FaArrowRight, FaShieldAlt, FaLock, FaComments } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const LoginPage = () => {
    const [name, setName] = useState("");
    const { account, connectWallet, createAccount, loading, error, setError } = useContext(ChatAppContext);
    const { t } = useLanguage();

    const handleCreateAccount = () => {
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }
        createAccount({ name: name.trim() });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleCreateAccount();
        }
    };

    return (
        <div className="LoginPage">
            {/* Animated background elements */}
            <div className="LoginPage_bg">
                <div className="LoginPage_bg_orb LoginPage_bg_orb1"></div>
                <div className="LoginPage_bg_orb LoginPage_bg_orb2"></div>
                <div className="LoginPage_bg_orb LoginPage_bg_orb3"></div>
            </div>

            <div className="LoginPage_container">
                {/* Left Side - Branding */}
                <div className="LoginPage_left">
                    <div className="LoginPage_left_content">
                        <div className="LoginPage_logo">
                            <Image src="/assets/logo.png" alt="BlockChat" width={60} height={60} />
                            <h2>BlockChat</h2>
                        </div>
                        <div className="LoginPage_hero">
                            <Image
                                src="/assets/hero.png"
                                alt="BlockChat Hero"
                                width={400}
                                height={400}
                                className="LoginPage_hero_img"
                            />
                        </div>
                        <div className="LoginPage_features">
                            <div className="LoginPage_feature">
                                <FaShieldAlt />
                                <span>Decentralized & Secure</span>
                            </div>
                            <div className="LoginPage_feature">
                                <FaLock />
                                <span>Blockchain Powered</span>
                            </div>
                            <div className="LoginPage_feature">
                                <FaComments />
                                <span>Real-time Messaging</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="LoginPage_right">
                    <div className="LoginPage_form_card">
                        <div className="LoginPage_form_header">
                            <h1>
                                Welcome to <span>BlockChat</span>
                            </h1>
                            <p>Connect your wallet and create your account to start chatting on the blockchain.</p>
                        </div>

                        {!account ? (
                            /* Step 1: Connect Wallet */
                            <div className="LoginPage_form_step">
                                <div className="LoginPage_step_badge">Step 1</div>
                                <h3>Connect Your Wallet</h3>
                                <p>Link your MetaMask wallet to get started.</p>
                                <button
                                    className="LoginPage_btn LoginPage_btn_primary"
                                    onClick={() => connectWallet()}
                                >
                                    <FaWallet />
                                    <span>Connect Wallet</span>
                                </button>
                            </div>
                        ) : (
                            /* Step 2: Create Account */
                            <div className="LoginPage_form_step">
                                <div className="LoginPage_step_badge">
                                    <FaWallet style={{ fontSize: "0.7rem" }} /> Wallet Connected
                                </div>
                                <h3>{t("login_createTitle")}</h3>
                                <p>{t("login_createHint")}</p>

                                <div className="LoginPage_input_group">
                                    <FaUser className="LoginPage_input_icon" />
                                    <input
                                        type="text"
                                        placeholder={t("login_namePlaceholder")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="LoginPage_wallet_info">
                                    <small>Connected as</small>
                                    <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
                                </div>

                                {loading ? (
                                    <button className="LoginPage_btn LoginPage_btn_primary LoginPage_btn_loading" disabled>
                                        <Image src="/assets/loader.gif" alt="loading" width={24} height={24} />
                                        <span>Creating Account...</span>
                                    </button>
                                ) : (
                                    <button
                                        className="LoginPage_btn LoginPage_btn_primary"
                                        onClick={handleCreateAccount}
                                    >
                                        <span>{t("login_createAccount")}</span>
                                        <FaArrowRight />
                                    </button>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="LoginPage_error">
                                {error}
                            </div>
                        )}

                        <div className="LoginPage_footer">
                            <small>{t("login_footer")}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
