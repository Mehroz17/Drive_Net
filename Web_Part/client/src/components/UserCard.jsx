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
  Block,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useGetData, usePatchData } from "hooks/apiHook";

const UserCard = ({
  user
}) => {

  const [status, setStatus] = useState(user.status);

  const {getData:handleBlocking, data:userStatus} = useGetData();
  
  const token = useSelector((state) => state.token);

  return (
    <WidgetWrapper m="1rem 0">
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Typography variant="h5" color={'orange'}>
            DriveNet User Card
          </Typography>
          <Typography>
            Name : {user?.firstName + " " + user?.lastName}
          </Typography>
          <Typography>
            Phone : {user?.phone}
          </Typography>
          <Typography>
            Status : {status == 1? "Active": "Blocked"}
          </Typography>
          <Box display={'flex'} gap={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Block sx={{ fontSize: 4 }} />}
              onClick={() => {
                handleBlocking(`users/${user._id}/blocking`);
                setStatus((status+1)%2);
                // patchUserBlocking(JSON.stringify({userId: user._id}), `users/${user._id}/blocking`, {
                //   isJson: true, onSuccess: (data) => {
                //     setStatus(data.status);
                //   }
                // });
              }}
              sx={{ fontSize: 10 }}
            >

              {status == 0 ? 'unblock': 'block'}
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<Chat />}
              sx={{ fontSize: 10 }}
            >
              Chat
            </Button> */}
          </Box>
          <Box mt={2} />
          <Link href={"http://localhost:3000/profile/" + user?._id} target="_blank">View Profile</Link>
        </Box>
        <Box>
          <img
            src={`http://localhost:3001/assets/${user?.picturePath}`}
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

export default UserCard;
