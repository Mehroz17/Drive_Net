import { useState, useEffect } from "react";

import { numberWithCommas } from "utils/math";

import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";

import { ToLacOrCrore } from "utils/extra";

import DetailsGrid from "components/DetailsGrid";

import { Link } from 'react-router-dom';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  LocationOnOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import Friend from "components/Friend";
import { setPost } from "state";
import { useDispatch, useSelector } from "react-redux";
import ApproveRejectAd from "./ApproveRejectAd";
import { useGetData } from "hooks/apiHook";
import { getTimeDiff } from "utils/extra";

const VehicleAdWidget = ({
  vehicle, redirectTo, isAdmin = false
}) => {

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  

  
  return (
    <WidgetWrapper>
      <Link to={redirectTo} style={{ textDecoration: 'none', color: 'inherit' }}>
        {(
          <img
            width="100%"
            height="200rem"
            alt="post"
            style={{ borderRadius: "0.75rem", objectFit: "cover", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${vehicle.images[0]}`}
          />
        )}

        <Typography variant="h4" fontWeight={500} color={'orange'}
          mt={1}
        >
          PKR {ToLacOrCrore(vehicle.price)}
        </Typography>
        <Typography variant="h5" fontWeight={500}
          mb={1}
          color={palette.mode == 'dark'? 'white': undefined}
        >
          {vehicle.title}
        </Typography>

        <DetailsGrid vehicle={vehicle} />

        <Box mt="0.5rem" mb="0.5rem" display="flex" flexDirection="row" gap={'0.5rem'} >
          <LocationOnOutlined />
          <Typography variant="subtitle2"  color={palette.mode == 'dark'? 'white': undefined}>{`${vehicle.location.area ? vehicle.location.area + ', ' : ''}${vehicle.location.city}`}</Typography>
          {/* <Typography>{vehicle.location.city}</Typography> */}
          <Typography color={palette.mode == 'dark'? 'white': undefined}>|</Typography>
          <Typography variant="subtitle2" color={palette.mode == 'dark'? 'white': undefined}>{getTimeDiff(vehicle)} days ago</Typography>
        </Box>
      </Link>
      {
        isAdmin &&
        <ApproveRejectAd vehicleAdId={vehicle._id} curStatus={vehicle.status}/>
      }
    </WidgetWrapper>
  );
};

export default VehicleAdWidget;
