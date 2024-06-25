import { Box, useMediaQuery, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbarAdmin";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import WidgetWrapper from "components/WidgetWrapper";
import EventHandlerComponent from "./EventHandler";
import IssuesHandlerComponent from "./IssuesHandler";
import Dashboard from "./Dashboard";
import VehicleDetailsComponent from "./VehicleDetails";
import ListingManagementComponent from "./ListingManagement";
import UserManagementComponent from "./UserManagement";
import { useTheme } from "@emotion/react";



const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [subMenu, setSubMenu] = useState("Dashboard");
  const theme = useTheme();

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


  const menu = {
    'Dashboard': <Dashboard />,
    'Events' : <EventHandlerComponent /> ,
    'Issues' : <IssuesHandlerComponent />,
    'Vehicle Details': <VehicleDetailsComponent />,
    'Listing Management': <ListingManagementComponent />,
    'User Management': <UserManagementComponent />,
    'Menu Main': <></>,
    'Menu Secondary': <></>,
  }

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
        <Box flexBasis={isNonMobileScreens ? "25%" : undefined}>
          <WidgetWrapper>
          <List>
            {Object.keys(menu).map((text, index) => (
              <ListItem button key={text} onClick={()=>{setSubMenu(text)}}
              sx={{backgroundColor: text==subMenu? theme.palette.primary.light: undefined}} 
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          </WidgetWrapper>

        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "75%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >

          <Typography
          
            variant="h1"
            fontWeight="500"
            sx={{ mb: "1.5rem" }}
          >
            {subMenu}
          </Typography>

          {
            menu[subMenu]
          }

        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;