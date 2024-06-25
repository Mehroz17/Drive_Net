/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
} from "@mui/material";
import {
  Call,
  Chat,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { getUpdatedAt } from "utils/extra";
import ChatParent from "scenes/chatPage/ChatParent";

const SellerCard = ({
  seller,
  user,
  onPressChat
}) => {
  const token = useSelector((state) => state.token);

  const [isRevealed, setIsRevealed] = useState(false);

  const reveal = ()=> {
    setIsRevealed(true);
  }

  const createChat = async (shouldOpen=false,  afterChatCreated) => {
    try {
      const chatResponse = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: user?._id, receiverId: seller?._id }),
      });

      if (!chatResponse.ok) {
        throw new Error("Failed to create chat");
      }
      // Chat created successfully, now open the modal
      if (shouldOpen)
        onPressChat();
      if (afterChatCreated)
        afterChatCreated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WidgetWrapper m="1rem 0">
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Typography variant="h5" color={'orange'}>
            DriveNet Seller Card
          </Typography>
          <Typography>
            Name : {seller?.firstName + " " + seller?.lastName + (seller?._id === user?._id ? " (You) " : "")}
          </Typography>
          <Typography>
            Phone : {isRevealed? seller?.phone : "03XX XXXXXXX"}
          </Typography>
          <Typography>
            Member since : {getUpdatedAt(seller)}
          </Typography>
          <Box display={'flex'} gap={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Call sx={{ fontSize: 4 }} />}
              onClick={() => {
                
                createChat(false, ()=>{
                  reveal();
                });
              }}
              sx={{ fontSize: 10 }}
            >
              Contact
            </Button>
            <Button
              disabled={seller?._id === user?._id}
              variant="contained"
              color="primary"
              startIcon={<Chat />}
              onClick={()=>{createChat(true, ()=>{})}}
              sx={{ fontSize: 10 }}
            >
              Chat
            </Button>
          </Box>
          <Box mt={2} />
          <Link href={"http://localhost:3000/profile/" + seller?._id} target="_blank">View Profile</Link>
        </Box>
        <Box>
          <img
            src={`http://localhost:3001/assets/${seller?.picturePath}`}
            alt={`Image `}
            width={80}
            height={100}
            style={{ borderRadius: "0.75rem", objectFit: 'cover' }}
          />
        </Box>

        {
        isRevealed && 
        <Box display={'none'}>
          <ChatParent isModal={true} chatWith={seller?._id}  buyerData={user} />
        </Box>
        }
      </Box>
    </WidgetWrapper>
  );
};

export default SellerCard;
