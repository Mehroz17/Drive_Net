// ChatPage.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "scenes/navbar";
import { useSelector } from "react-redux";
import "./Chat.css";
import ChatParent from "./ChatParent";
import { useGetData } from "hooks/apiHook";

const ChatPage = () => {
  const token = useSelector((state) => state.token);
  const [userData, setUserData] = useState(null); // Initialize userData state

  // Custom hook to fetch user data
  const { data: userDataResponse, getData: getUserData } = useGetData(
    userData ? `/users/${userData._id}` : null, // Pass userData only if it's available
    token ,
    {defValue: undefined}
  );

  useEffect(() => {
    // Fetch user data when component mounts
    getUserData();
  }, []);

  useEffect(() => {
    if (userDataResponse) {
      // Update userData state when user data is fetched
      setUserData(userDataResponse);
    }
  }, [userDataResponse]);

  return (
    <Box>
      <Navbar />
      <ChatParent isModal={false} chatWith={userData?._id} />
    </Box>
  );
};

export default ChatPage;
