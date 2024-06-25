import React from "react";
import { Zoom, Card, CardMedia } from "@mui/material";

const MagnifiableImage = ({ imageUrl }) => {
  return (
    <Zoom
      overlayStyle={{ zIndex: 999 }}
      zoomMargin={50}
      transitionDuration={500}
      wrapStyle={{ width: "fit-content", margin: "auto" }}
    >
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia component="img" image={imageUrl} alt="Image" />
      </Card>
    </Zoom>
  );
};

export default MagnifiableImage;
