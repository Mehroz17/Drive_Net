import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery, Modal } from "@mui/material";
import Register from "./Register";
import Login from "./Login";
import Center from "components/Center";

const LoginPage = ({isModal, onLogin}) => {
  const [login, setLogin] = useState(true);
  const [register, setRegister] = useState(false);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      {
        !isModal &&
        <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          <span style={{ color: 'orange' }}>DriveNet</span> Market
        </Typography>
      </Box>
      }
{/*       {
        isModal &&
        <Typography textAlign={'center'} fontWeight="bold" fontSize="32px" color="primary">
          DriveNet Market
        </Typography>
      } */}
      <Box
        width={isNonMobileScreens && !isModal? "45%" : "93%"}
        p={isModal? "1rem":"3rem"}
        m={isModal? "0rem auto" :"2rem auto"}
        mb={isModal? "0.2rem":"2rem"}
        borderRadius="2rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Center>{!isModal && <Typography textAlign={'center'} fontWeight="500" variant="h5" sx={{ mb: isModal? "0.5rem":"1.5rem" }}>
          Welcome to DriveNet Market and Community, for Car Enthusiasts!
        </Typography>}</Center>
        
        {login && (
          <Login onLogin={onLogin}
            handleRegister={() => {
              setRegister(true);
              setLogin(false);
            }}
          />
        )}
        {register && (
          <Register
            handleLogin={() => {
              setLogin(true);
              setRegister(false);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
