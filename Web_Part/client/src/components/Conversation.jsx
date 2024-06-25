import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Divider } from "@mui/material";

const Conversation = ({ data, currentUser, online, unreadMessages }) => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token); // Retrieve token from Redux store

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserData(data);
        console.log(data.firstName + " " + data.lastName);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    getUserData();
  }, [data.members, currentUser, token]);

  if (!userData) {
    return null; // or a loading spinner, or any other placeholder
  }

  return (
    <>
      <div
        className="follower conversation"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex" }}>
          {online && <div className="online-dot"></div>}
          {unreadMessages > 0 && (
            <div className="unread-dot"> {unreadMessages}</div>
          )}
          <img
            src={
              userData?.picturePath
                ? "http://localhost:3001/assets/" + userData.picturePath
                : "/assets/kunwar-b.jpg"
            }
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          {userData && (
            <div style={{ fontSize: "0.8rem", marginLeft: "0.5rem" }}>
              <span className="name">
                {userData.firstName} {userData.lastName}
              </span>
              <div style={{ color: online ? "#51e200" : "" }}>
                {online ? "Online" : "Offline"}
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />
    </>
  );
};

export default Conversation;
