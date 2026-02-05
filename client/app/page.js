"use client";

import React, { useContext } from "react";
import { ChatAppContext } from "../context/ChatAppContext";
import Filter from "../components/Filter";
import Friend from "../components/Friend";
import Chat from "../components/Chat";

const Home = () => {
  const {
    readMessage,
    readUser,
    createAccount,
    addFriends,
    sendMessage,
    account,
    userName,
    friendLists,
    friendMsg,
    loading,
    userLists,
    error,
    currentUserName,
    currentUserAddress,
  } = useContext(ChatAppContext);

  return (
    <div>
      <Filter />
      <div className="Friend">
        <div className="Friend_box">
          <div className="Friend_box_left">
            {friendLists.map((el, i) => (
              <Friend key={i + 1} el={el} i={i} readMessage={readMessage} readUser={readUser} />
            ))}
          </div>
          <div className="Friend_box_right">
            <Chat
              functionName={sendMessage}
              readMessage={readMessage}
              friendMsg={friendMsg}
              account={account}
              userName={userName}
              loading={loading}
              currentUserName={currentUserName}
              currentUserAddress={currentUserAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
