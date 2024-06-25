import { Button, Typography, useTheme, IconButton } from "@mui/material";
import Center from "components/Center";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

const AdvertWidgetShow = ({
  heading="heading",
  image,
  title,
  description,
}) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          {heading}
        </Typography>
      </FlexBetween>
      <img
        width="300px"
        height="auto"
        alt="advert"
        src={image}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main} fontWeight="500">
          {title}
        </Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        {description}
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidgetShow;
