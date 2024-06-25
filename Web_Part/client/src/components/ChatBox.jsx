/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useTheme, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { addMessage, getMessages } from "../../src/api/MessageRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import VehicleAdWidgetLink from "scenes/widgets/VehicleAdWidgetLink";
import BuyerCard from "./BuyerCard";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage, isModal, vehicleData, buyerData }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { palette } = useTheme();

  const isVehicleAdSent = useRef(false);
  const isBuyerAdSent = useRef(false);
  const scroll = useRef();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (!chat) return;

    const userId = chat.members.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    getUserData();
    
    if (!isVehicleAdSent.current) {
      sendVehicleAdMessage();
      isVehicleAdSent.current = true;
    }
    if (!isBuyerAdSent.current) {
      sendBuyerAdMessage();
      isBuyerAdSent.current = true;
    }
  }, [chat, currentUser, token]);

  const sendVehicleAdMessage = async () => {
    if (vehicleData && chat) {
      const message = {
        senderId: currentUser,
        text: `vehiclead:${vehicleData._id}`,
        chatId: chat._id,
      };
      const receiverId = chat.members.find((id) => id !== currentUser);
      setSendMessage({ ...message, receiverId });
      try {
        await addMessage(message);
      } catch (error) {
        console.log("Error sending vehicle ad message", error);
      }
    }
  };

  const sendBuyerAdMessage = async () => {
    if (buyerData && chat) {
      const message = {
        senderId: currentUser,
        text: `buyerad:${buyerData._id}`,
        chatId: chat._id,
      };
      const receiverId = chat.members.find((id) => id !== currentUser);
      setSendMessage({ ...message, receiverId });
      try {
        await addMessage(message);
      } catch (error) {
        console.log("Error sending vehicle ad message", error);
      }
    }
  };

  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (receivedMessage && chat && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={isModal ? "ChatBox-container-modal" : "ChatBox-container"}
      style={{
        backgroundColor: palette.background.alt,
        borderRadius: "0.75rem",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      }}>
      {chat ? (
        <>
          <div className="chat-header">
            <div className="follower">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={userData?.picturePath ? `http://localhost:3001/assets/${userData.picturePath}` : "/assets/kunwar-b.jpg"}
                  alt="Profile" className="followerImage" style={{ width: "50px", height: "50px" }} />
                {userData && (
                  <div className="name" style={{ fontSize: "0.9rem", padding: '1rem' }}>
                    <span>{userData.firstName} {userData.lastName}</span>
                  </div>
                )}
              </div>
            </div>
            <Divider />
          </div>

          <div className={isModal ? "chat-body-modal" : "chat-body"}>
            {messages.map((message, index) => (
              <div key={index} ref={scroll} className={message.senderId === currentUser ? "message own" : "message"}>
                {message.text.includes("vehiclead:") && (
                  <VehicleAdWidgetLink id={message.text.replace("vehiclead:", "").trim()} />
                )}
                {message.text.includes("buyerad:") && (
                  <BuyerCard id={message.text.replace("buyerad:", "").trim()} />
                )}
                <span>{message.text}</span> <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          <div className="chat-sender">
            <div>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <button style={{
              padding: "0.65rem",
              backgroundColor: palette.primary.main,
              color: palette.background.default,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
              onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
      )}
    </div>
  );
};

export default ChatBox;
