import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const UserImage = ({ image, size = "60px" }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Load image when the image prop changes
    setImageUrl(`http://localhost:3001/assets/${image}`);
  }, [image]);

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={imageUrl}
      />
    </Box>
  );
};

export default UserImage;
