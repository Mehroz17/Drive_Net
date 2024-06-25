import { Button, Typography, useTheme, IconButton,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Center from "components/Center";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import useAlertBox from "../../components/AlertBox";
import { useLocation } from "react-router-dom";


const AdvertWidget = ({
  image,
  title,
  date,
  description,
  onDelete,
  eventId,
  isUserInterested
}) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const [interested, setInterested] = useState(isUserInterested);
  const [openModal, setOpenModal] = useState(false); // State to control modal open/close

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Initialize the custom alert box hook
  const { AlertBox, ShowAlertBox } = useAlertBox();
  const location = useLocation(); // Get current location


  const isAdmin = location.pathname === "/admin" 

  const handleInterestClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/events/${eventId}/${loggedInUserId}/interest`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error updating interest status: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (interested) {
        ShowAlertBox("Event Unsubscribed successfully", 'error');
      } else {
        ShowAlertBox("Event Subscribed successfully", 'success');
      }

      setInterested(!interested);
      
    } catch (error) {
      console.error("Error updating interest status:", error);
      ShowAlertBox("Failed to update interest status", 'error');
    }
  };

  const handleUnsubscribe = () => {
    handleCloseModal(); // Close the modal
    handleInterestClick(); // Unsubscribe from event
  };

  return (
    <WidgetWrapper>
      {/* Render the custom alert box */}
      {AlertBox}

      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Upcoming Auto Event
        </Typography>
        {onDelete && (
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        )}
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`http://localhost:3001/assets/${image}`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main} fontWeight="500">
          {title}
        </Typography>
        <Typography color={medium}>{date.replace('T', ' ')}</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        {description}
      </Typography>
      <Center>
        { !isAdmin && <Button
          onClick={interested ? handleOpenModal : handleInterestClick}
          sx={{
            color: palette.background.alt,
            backgroundColor: interested
              ? palette.success.main
              : palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          {interested ? "Subscribed" : "Subscribe"}
        </Button>}
      </Center>
      {/* Unsubscribe confirmation modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Unsubscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unsubscribe from this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          {!isAdmin && <Button onClick={handleUnsubscribe} variant="contained" color="error">
            Unsubscribe
          </Button>}
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
