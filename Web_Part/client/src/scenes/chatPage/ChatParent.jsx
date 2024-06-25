import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mui/material";
import "./Chat.css";
import { userChats } from "../../api/ChatRequests";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import Conversation from "components/Conversation";
import ChatBox from "components/ChatBox";
import WidgetWrapper from "components/WidgetWrapper";
import { incrementUnread, resetUnread } from "../../state";

const ChatParent = ({ isModal, chatWith, vehicleData, buyerData }) => {
  const socket = useRef();
  const user = useSelector((state) => state.user);
  const unreadMessages = useSelector((state) => state.unreadMessages);
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const isMobileScreens = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    if (user && user._id) {
      const getChats = async () => {
        try {
          const { data } = await userChats(user._id);
          setChats(data);
          if (chatWith) {
            const targetChat = data.find((item) => item.members.includes(chatWith));
            if (targetChat) {
              setCurrentChat(targetChat);
              setIsChatClicked(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      getChats();
    }
  }, [user, chatWith]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    if (user && user._id) {
      socket.current = io("ws://localhost:8800");
      socket.current.emit("new-user-add", user._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
      socket.current.on("receive-message", (data) => {
        setReceivedMessage(data);
        dispatch(incrementUnread({ chatId: data.chatId }));
      });
      socket.current.on("incrementUnread", ({ senderId }) => {
        dispatch(incrementUnread({ chatId: senderId }));
      });
    }
  }, [user, dispatch]);

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    setIsChatClicked(true);
    dispatch(resetUnread({ chatId: chat._id }));
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  if (!user) {
    return null; // or a loading spinner, or any other placeholder
  }

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className={`Left-side-chat ${isChatClicked && !isMobileScreens ? 'hide' : ''}`}>
        <div className={isModal ? "Chat-container-modal" : "Chat-container"}>
          <WidgetWrapper>
            <h2>Chats</h2>
            <div className="Chat-list">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                >
                  <Conversation
                    data={chat}
                    currentUser={user._id}
                    online={checkOnlineStatus(chat)}
                    unreadMessages={unreadMessages[chat._id] || 0}
                  />
                </div>
              ))}
            </div>
          </WidgetWrapper>
        </div>
      </div>

      {/* Right Side */}
      <div className={`Right-side-chat ${!isMobileScreens && !isChatClicked ? 'hide' : 'show'}`}>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          isModal={isModal}
          vehicleData={vehicleData}
          buyerData={buyerData}
        />
      </div>
    </div>
  );
};

export default ChatParent;
