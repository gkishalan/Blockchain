"use client";

import React, { useState, useEffect, useRef, useCallback, createContext } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from "./constants";

export const ChatAppContext = createContext();

export const ChatAppProvider = ({ children }) => {
    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [error, setError] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    const [unreadCounts, setUnreadCounts] = useState({});
    const [readStatusMap, setReadStatusMap] = useState({});
    const friendListsRef = useRef([]);
    const accountRef = useRef("");

    const router = useRouter();

    // Fetch data
    const fetchData = async () => {
        try {
            const contract = await connectingWithContract();
            const connectAccount = await connectWallet();
            setAccount(connectAccount);

            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);

            const friendLists = await contract.getMyFriendList();
            setFriendLists(friendLists);
            friendListsRef.current = friendLists;
            accountRef.current = connectAccount;

            const userList = await contract.getAllAppUser();
            setUserLists(userList);
        } catch (error) {
            console.log(error);
            // setError("Please install and connect your wallet");
        }
    };

    useEffect(() => {
        fetchData();

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", () => {
                window.location.reload();
            });
        }
    }, []);

    // Connect Wallet
    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
            return accounts[0];
        } catch (error) {
            console.log(error);
        }
    };

    // Connect Contract
    const connectingWithContract = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
            return contract;
        } catch (error) {
            console.log(error);
        }
    };

    // Create Account
    const createAccount = async ({ name }) => {
        try {
            if (!name) return setError("Name cannot be empty");
            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setError("Error while creating your account. Please reload browser.");
        }
    };

    // Add Friend
    const addFriends = async ({ name, accountAddress }) => {
        try {
            if (!name || !accountAddress) return setError("Please provide data");
            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress, name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();
        } catch (error) {
            setError("Something went wrong while adding friend, try again");
        }
    };

    // Send Message
    const sendMessage = async ({ msgAddress, msg }) => {
        try {
            if (!msgAddress || !msg) return setError("Please type your message");
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(msgAddress, msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            // Instead of reloading, refresh the messages
            readMessage(msgAddress);
            readMessage(msgAddress);
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Transaction failed. Please check your wallet and try again.");
        }
    };

    // Read Message
    const readMessage = async (friendAddress) => {
        try {
            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);

            // Mark messages as read by saving current count to localStorage
            const acc = accountRef.current || account;
            if (acc && friendAddress) {
                const key = `lastSeen_${acc.toLowerCase()}_${friendAddress.toLowerCase()}`;
                localStorage.setItem(key, read.length.toString());
                setUnreadCounts((prev) => ({ ...prev, [friendAddress.toLowerCase()]: 0 }));
            }
        } catch (error) {
            console.log("Currently you have no messages");
        }
    };

    // Read User
    const readUser = async (userAddress) => {
        const contract = await connectingWithContract();
        const userName = await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurrentUserAddress(userAddress);
    };

    // Clear Chat (For Mobile Back Button)
    const clearCurrentChat = () => {
        setCurrentUserName("");
        setCurrentUserAddress("");
        setFriendMsg([]); // Optional: Clear messages too if desired
    };

    // Fetch unread counts for all friends + build read status map
    const fetchUnreadCounts = useCallback(async () => {
        try {
            const friends = friendListsRef.current;
            const acc = accountRef.current;
            if (!friends || friends.length === 0 || !acc) return;

            const contract = await connectingWithContract();
            const counts = {};
            const statusMap = {};

            for (const friend of friends) {
                try {
                    const messages = await contract.readMessage(friend.pubkey);
                    const totalCount = messages.length;
                    const key = `lastSeen_${acc.toLowerCase()}_${friend.pubkey.toLowerCase()}`;
                    const lastSeen = parseInt(localStorage.getItem(key) || "0", 10);
                    counts[friend.pubkey.toLowerCase()] = Math.max(0, totalCount - lastSeen);

                    // Build read status: check what the FRIEND has last seen
                    // The friend stores their lastSeen as: lastSeen_<friend>_<me>
                    const friendSeenKey = `lastSeen_${friend.pubkey.toLowerCase()}_${acc.toLowerCase()}`;
                    const friendLastSeen = parseInt(localStorage.getItem(friendSeenKey) || "0", 10);
                    statusMap[friend.pubkey.toLowerCase()] = {
                        totalMessages: totalCount,
                        friendLastSeen: friendLastSeen,
                    };
                } catch (e) {
                    counts[friend.pubkey.toLowerCase()] = 0;
                    statusMap[friend.pubkey.toLowerCase()] = { totalMessages: 0, friendLastSeen: 0 };
                }
            }

            setUnreadCounts(counts);
            setReadStatusMap(statusMap);
        } catch (error) {
            console.log("Error fetching unread counts:", error);
        }
    }, []);

    // Poll for unread messages every 10 seconds
    useEffect(() => {
        // Initial fetch after a short delay to allow friendLists to load
        const initialTimer = setTimeout(() => {
            fetchUnreadCounts();
        }, 2000);

        const interval = setInterval(() => {
            fetchUnreadCounts();
        }, 10000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [fetchUnreadCounts]);

    // Delete Message removed as per user request

    return (
        <ChatAppContext.Provider
            value={{
                readMessage,
                createAccount,
                addFriends,
                sendMessage,
                readUser,
                connectWallet,
                checkContract: connectingWithContract,
                account,
                userName,
                friendLists,
                friendMsg,
                userLists,
                loading,
                error,
                currentUserName,
                currentUserAddress,
                clearCurrentChat,
                unreadCounts,
                readStatusMap,
                setError, // Expose setError for child components
            }}
        >
            {children}
        </ChatAppContext.Provider>
    );
};
