import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import Friend from "components/Friend";
import { setPost } from "state";
import { useDispatch, useSelector } from "react-redux";
import MagnifiableImage from "./MagnifiableImage";

const ImageGallery = ({
  images
}) => {

  const [bigImage, setBigImage] = useState(0);
  const { palette } = useTheme();


  return (
    <WidgetWrapper m="1rem 0">
      {(
        <img
          width="100%"
          height="400vh"
          alt="post"

          style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: 'contain', background: 'black' }}
          src={`http://localhost:3001/assets/${images[bigImage]}`}
        />
        // <MagnifiableImage imageUrl={`http://localhost:3001/assets/${images[bigImage]}`}/>
      )}

      {/* Display selected images */}
      <Box mt={2}>
        <Typography variant="h6">Other Images:</Typography>
        <Box display="flex" alignItems="center" flexWrap={'wrap'} width={'100%'}>
          {
            Array.from(images).map((image, index) => (
              <Box key={index} mr={1}>
                <img
                  src={`http://localhost:3001/assets/${images[index]}`}
                  alt={`Image ${index}`}
                  width={100}
                  height={80}
                  onClick={()=>{setBigImage(index)}}
                  style={index == bigImage? {border: '3px solid orange' /*#00d5fa */, borderRadius: '0.25rem', padding: '0.15rem', objectFit:'contain', background: 'black'}:{}}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default ImageGallery;
