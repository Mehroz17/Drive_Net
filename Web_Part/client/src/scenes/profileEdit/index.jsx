import React, { useState } from "react";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Center from "components/Center";
import Navbar from "scenes/navbar";
import EditProfileForm from "./EditProfileForm";
import EditProfilePassword from "./EditProfilePassword";

const ProfilePage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Get token and user ID from Redux state
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
  };

  const handleEditProfileClick = () => {
    setIsChangingPassword(false);
  };

  return (
    <Box>
      <Navbar />

      <Box
        width={isNonMobileScreens ? "45%" : "93%"}
        p="3rem"
        m="2rem auto"
        borderRadius="2rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Center>
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Welcome to DriveNet. Here you can {isChangingPassword ? "Change your Password" : "Edit your Profile Details"}!
          </Typography>
        </Center>

        {isChangingPassword ? (
          <>
            <EditProfilePassword userId={loggedInUserId} token={token} />
            <Button variant="contained" color="primary" onClick={handleEditProfileClick} sx={{ mt: "1rem" }}>
              Edit Profile
            </Button>
          </>
        ) : (
          <>
            <EditProfileForm userId={loggedInUserId} token={token} />
            <Button variant="contained" color="primary" onClick={handleChangePasswordClick} sx={{ mt: "1rem" }}>
              Change Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
