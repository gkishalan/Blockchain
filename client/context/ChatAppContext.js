"use client";

import React, { useState, useEffect, createContext } from "react";
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
            setError("Transaction failed. File might be too large (max ~100KB) or gas limit exceeded.");
        }
    };

    // Read Message
    const readMessage = async (friendAddress) => {
        try {
            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);
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
                setError, // Expose setError for child components
            }}
        >
            {children}
        </ChatAppContext.Provider>
    );
};
