import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useMediaQuery, Typography, Box } from "@mui/material";
import Center from "components/Center";
import VehicleAdWidget from "./VehicleAdWidget";
import WidgetWrapper from "components/WidgetWrapper";
import UserVehicleAdWidget from "./UserVehicleAdWidget";
import useAlertBox from "components/AlertBox";

const UserVehicleAdWidgetGallery = ({ heading, UserVehicleAds = [], isOwner, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector(state=>state.user);

  const [vehicleAds, setVehicleAds] = useState(UserVehicleAds);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const {AlertBox, ShowAlertBox} = useAlertBox();

  return (
    <>
      {!vehicleAds || vehicleAds.length === 0 ? (
        <Center>

          <Typography variant="h3" color="textSecondary">
            No Vehicles Listed for sale yet!
          </Typography>
        </Center>
      ) : (
        <Box
          width="100%">
          <Typography variant="h4" fontWeight={500}
            mt={1} mb={1}
            ml={1}
          >
            {heading}
          </Typography>
          {
            AlertBox
          }
          <Box
            display="grid"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${isNonMobileScreens && isOwner? "33%": "100%"}, 1fr))`,
              gap: '0.5rem'
            }}
          >
            {vehicleAds.map((item, index) => (
              <div
                key={item.title || index} // Use index as fallback if title is not unique
              >
                <UserVehicleAdWidget
                  isOwner={user._id == item.seller}
                  vehicle={item}
                  redirectTo={'/market/' + item._id}
                  onDeleteSuccess={(id)=>{
                    setVehicleAds(vehicleAds.filter(item=> id != item._id));
                    ShowAlertBox("Your Vehicle Ad deleted Successfully!");
                  }}
                />
              </div>
            ))}
          </Box>

        </Box>

      )}
    </>
  );
};

export default UserVehicleAdWidgetGallery;
