"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { ChatAppContext } from "../../context/ChatAppContext";
import { FaCopy, FaEye, FaArrowUp, FaArrowDown, FaEthereum } from "react-icons/fa";

const Profile = () => {
    const { account, userName, friendLists, checkContract } = useContext(ChatAppContext);
    const [balance, setBalance] = useState("0");
    const [recentChats, setRecentChats] = useState([]);

    useEffect(() => {
        const fetchBalance = async () => {
            if (account && window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const balanceBigInt = await provider.getBalance(account);
                    const balanceEth = ethers.formatEther(balanceBigInt);
                    setBalance(parseFloat(balanceEth).toFixed(4));
                } catch (error) {
                    console.log("Error fetching balance:", error);
                }
            }
        };
        fetchBalance();
    }, [account]);

    // Fetch and sort recent chats
    useEffect(() => {
        const fetchRecentChats = async () => {
            if (!friendLists || !checkContract) return;

            try {
                const contract = await checkContract();
                const chatsWithDetails = await Promise.all(
                    friendLists.map(async (friend) => {
                        // Fetch messages between user and this friend
                        // Note: readMessage in contract takes friend address
                        const messages = await contract.readMessage(friend.pubkey);

                        if (messages.length > 0) {
                            const lastMsg = messages[messages.length - 1];
                            return {
                                ...friend,
                                lastMessage: lastMsg.content,
                                timestamp: Number(lastMsg.timestamp),
                                isImage: /\.(jpeg|jpg|gif|png|webp)$/i.test(lastMsg.content) || /^data:image/.test(lastMsg.content),
                            };
                        } else {
                            return null; // No messages
                        }
                    })
                );

                // Filter out nulls (friends with no chat) and sort by timestamp desc
                const sortedChats = chatsWithDetails
                    .filter((chat) => chat !== null)
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 3); // Top 3

                setRecentChats(sortedChats);
            } catch (error) {
                console.error("Error fetching recent chats:", error);
            }
        };

        if (friendLists.length > 0) {
            fetchRecentChats();
        }
    }, [friendLists, checkContract, account]);

    const copyAddress = () => {
        navigator.clipboard.writeText(account);
        alert("Address copied!");
    };

    const formatTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp * 1000)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return "Just now";
    };

    return (
        <div className="Profile">
            <div className="Profile_box">
                <div className="Profile_header">
                    <h1>Wallet Profile</h1>
                    <p>Manage your digital assets and transaction history</p>
                </div>

                <div className="Profile_grid">
                    {/* User Identity Card */}
                    <div className="Profile_card Profile_identity">
                        <div className="Profile_identity_info">
                            <div className="Profile_avatar">
                                <Image src="/assets/img1.png" alt="avatar" width={80} height={80} />
                            </div>
                            <div className="Profile_identity_text">
                                <h2>{userName || "User"}</h2>
                                <p>Web3 Identity • Connected via MetaMask</p>
                                <div className="Profile_identity_btns">
                                    <button>EDIT IDENTITY</button>
                                    <button className="outline">PRIVACY SETTINGS</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Card */}
                    <div className="Profile_card Profile_portfolio">
                        <div className="Profile_portfolio_header">
                            <span>Total Portfolio</span>
                            <FaEye />
                        </div>
                        <div className="Profile_portfolio_balance">
                            <h1>{balance} ETH</h1>
                            <span className="badge">+2.45%</span>
                        </div>
                        <div className="Profile_portfolio_actions">
                            <button><FaArrowUp /> Send</button>
                            <button className="outline"><FaArrowDown /> Receive</button>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="Profile_card Profile_address">
                        <div className="Profile_address_header">
                            <span>PUBLIC WALLET ADDRESS</span>
                        </div>
                        <div className="Profile_address_value">
                            <p>{account}</p>
                            <button onClick={copyAddress}><FaCopy /> Copy</button>
                        </div>
                    </div>
                </div>

                {/* Recent Chat History */}
                <div className="Profile_transactions">
                    <h3>Recent Chat History</h3>
                    <div className="Profile_transactions_list">
                        {recentChats.length > 0 ? (
                            recentChats.map((chat, i) => (
                                <div className="Profile_transaction_item" key={i}>
                                    <div className="Profile_transaction_icon sent" style={{ overflow: 'hidden' }}>
                                        <Image src="/assets/img1.png" alt="friend" width={40} height={40} />
                                    </div>
                                    <div className="Profile_transaction_info">
                                        <h4>{chat.name}</h4>
                                        <p>
                                            {chat.isImage ? "Sent an image" :
                                                chat.lastMessage.length > 30 ? chat.lastMessage.substring(0, 30) + "..." : chat.lastMessage}
                                        </p>
                                    </div>
                                    <div className="Profile_transaction_amount positive">
                                        <small>{formatTimeAgo(chat.timestamp)}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#64748b', textAlign: 'center' }}>No recent chats found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
