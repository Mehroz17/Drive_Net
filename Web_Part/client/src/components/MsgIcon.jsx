import React, { useEffect, useState } from 'react';
import MessageIcon from "@mui/icons-material/Message";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Badge } from '@mui/material';
import { resetUnread } from '../state';

const MsgIcon = ({ views = 0 }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const unreadMessages = useSelector((state) => state.unreadMessages);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Calculate total unread message count
    const totalUnreadCount = Object.values(unreadMessages).reduce(
      (acc, curr) => curr,
      0
    );
    
    // Set unread message count to zero if the current route is /chat
    if (location.pathname === '/chat') {
      setUnreadMessageCount(0);
    } else {
      setUnreadMessageCount(totalUnreadCount);
    }
  }, [unreadMessages, location.pathname, dispatch]);

  return (
    <IconButton component={Link} to="/chat">
      <Badge badgeContent={unreadMessageCount} color="error">
        <MessageIcon sx={{ fontSize: "25px" }} />
      </Badge>
    </IconButton>
  );
};

export default MsgIcon;
