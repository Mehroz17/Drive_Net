import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Modal,
} from "@mui/material";

import DetailsGrid from "components/DetailsGrid";

import { Link, useNavigate } from 'react-router-dom';
import {
  LocationOnOutlined,
  Close,
  Delete,
  Edit,
  SellOutlined
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
//import Friend from "components/Friend";
//import { setPost } from "state";
//import { useDispatch, useSelector } from "react-redux";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useDelData, useGetData } from "hooks/apiHook";
import VehicleUpdateAdForm from "scenes/sellPage/FormUpdate";
import ViewsEye from "components/ViewsEye";

const UserVehicleAdWidget = ({
  vehicle, isOwner, redirectTo, onDeleteSuccess
}) => {
/*   const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main; */

  const {getData:markAsSold} = useGetData();
  
  const [isMarkedSold, setMarkedSold] = useState(false);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDialogOpen2, setDialogOpen2] = useState(false);

  const getTimeDiff = (vehicleAd) => {
    const timeDiff = new Date() - new Date(vehicleAd.createdAt);
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const { delData } = useDelData()

  const delVehicleAd = (id) => {
    const target = "market/" + id;
    delData(undefined, target, {
      onSuccess: () => {
        onDeleteSuccess(id);
      }, onFail: (err) => { alert(err) }
    })
  }

  return (
    <WidgetWrapper >
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        {
          isOwner && 
          <Box>
          <IconButton onClick={() => { setDialogOpen(true) }}>
            <Delete />
          </IconButton>
          <IconButton onClick={() => { navigate(`/market/edit/${vehicle._id}`) }}>
            <Edit />
          </IconButton>
          {
            ((!isMarkedSold && vehicle.status != 'sold')) ?
            <IconButton onClick={() => { setDialogOpen2(true) }}>
              <SellOutlined />
            </IconButton>
            :
            <></>
          }
        </Box>
        }


        {
          isOwner && <Typography variant="h5" color={'orange'}>
          {isMarkedSold? "sold" : vehicle.status === 'new' ? "Pending approval" : vehicle.status === 'approved' ? "Live" : vehicle.status}
        </Typography>
        }
      </Box>

      {/* <IconButton onClick={()=>{setModalOpen(true)}}>
        <EditOutlined />
      </IconButton> */}

      <Link to={redirectTo} style={{ textDecoration: 'none', color: 'inherit' }}>

        <Box sx={{ position: 'relative' }}>
          <ViewsEye views={vehicle.views} />
          <img
            width="100%"
            height="200rem"
            alt="post"
            style={{ borderRadius: "0.75rem", objectFit: "cover", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${vehicle.images[0]}`}
          />
        </Box>


        <Typography variant="h4" fontWeight={500}
          mt={1}
        >
          PKR {vehicle.price}
        </Typography>
        <Typography variant="h5" fontWeight={500}
          mb={1}
        >
          {vehicle.title}
        </Typography>

        <DetailsGrid vehicle={vehicle} />

        <Box mt="0.5rem" mb="0.5rem" display="flex" flexDirection="row" gap={'0.5rem'} >
          <LocationOnOutlined />
          <Typography>{`${vehicle.location.area ? vehicle.location.area + ',' : ''}${vehicle.location.city}`}</Typography>
          {/* <Typography>{vehicle.location.city}</Typography> */}
          <Typography>|</Typography>
          <Typography>{getTimeDiff(vehicle)} days ago</Typography>
        </Box>
      </Link>

      {
        isOwner &&
        (vehicle.status === 'rejected') &&
        <Box>
          <hr />
          <Typography color={'red'} textAlign={'center'}>
            Rejected: {vehicle.remarks}
          </Typography>
        </Box>
      }
      <ConfirmationDialog data={{ title: "Are you sure to delete?", content: "The selected vehicle ad will be deleted from market", open: isDialogOpen, onConfirm: () => { setDialogOpen(false); delVehicleAd(vehicle._id) }, onClose: () => { setDialogOpen(false) } }} />
      <ConfirmationDialog data={{ title: "Mark this vehicle as sold?", content: "The selected vehicle ad will be marked as sold and removed from market", open: isDialogOpen2, onConfirm: () => { setDialogOpen2(false); markAsSold('/market/sold/'+vehicle._id); setMarkedSold(true) }, onClose: () => { setDialogOpen2(false) } }} />

      <Modal open={isModalOpen} onClose={handleClose}>

        <Box
          width={'80%'}
          height={'80%'}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            overflow: 'scroll'
          }}
        >
          <IconButton onClick={handleClose} style={{ position: 'absolute', top: 5, right: 5 }}>
            <Close />
          </IconButton>
          <VehicleUpdateAdForm vehicleAd={vehicle} />
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserVehicleAdWidget;
