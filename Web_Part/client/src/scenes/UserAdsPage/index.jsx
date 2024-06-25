import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserAdsProfileWidget from "scenes/widgets/UserAdsProfileWidget";
import UserVehicleAdWidgetGallery from "scenes/widgets/UserVehicleAdGalleryWidget";
import UserWidget from "scenes/widgets/UserWidget";


const UserAdsPage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const [vehicleAds, setVehicleAds] = useState([]);

  const getVehicleAds = async () => {
    const url = "http://localhost:3001/market/"+userId+"/ads";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setVehicleAds(data);
  };

  useEffect(() => {
    getVehicleAds();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "30%" : undefined}>
          <UserAdsProfileWidget userId={userId} picturePath={user.picturePath} vehicleAds={vehicleAds} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
          <Box flexBasis={isNonMobileScreens ? "70%" : undefined}>
            <UserVehicleAdWidgetGallery heading={"My Vehicle Ads"} isOwner={true} userId={userId} UserVehicleAds={vehicleAds} />
          </Box>
      </Box>
    </Box>
  );
};

export default UserAdsPage;