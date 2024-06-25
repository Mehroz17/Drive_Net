/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Box,
  Typography,
  Link,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useGetData } from "hooks/apiHook";

const BuyerCard = ({
  id
}) => {
  const token = useSelector((state) => state.token);

  const {data:seller} = useGetData(`users/${id}`, token, {defValue: null})

  return (
    <WidgetWrapper m="1rem 0">
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Typography variant="h5" color={'orange'}>
            DriveNet Buyer
          </Typography>
          <Typography>
            Number Viewed By : {seller?.firstName + " " + seller?.lastName}
          </Typography>
          {/* <Typography>
            Phone : {isRevealed? seller?.phone : "03XX XXXXXXX"}
          </Typography>
          <Typography>
            Member since : {getUpdatedAt(seller)}
          </Typography> */}
          {/* <Box display={'flex'} gap={1}>
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
              disabled={seller?._id == user?._id}
              variant="contained"
              color="primary"
              startIcon={<Chat />}
              onClick={()=>{createChat(true, ()=>{})}}
              sx={{ fontSize: 10 }}
            >
              Chat
            </Button>
          </Box> */}
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

      </Box>
    </WidgetWrapper>
  );
};

export default BuyerCard;
