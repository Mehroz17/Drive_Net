import { Button, Typography, useTheme, IconButton, Box, TextField } from "@mui/material";
import { Formik } from "formik";
import {Modal} from "@mui/material";
import Center from "components/Center";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchData } from "hooks/apiHook";

const ApproveRejectAd = ({
  vehicleAdId,
  curStatus
}) => {

  const [status, setStatus] = useState(curStatus);
  const [open, setOpen] = useState(false);
  var remarks = '';
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);

  const { patchData: patchStatus, error } = usePatchData(`market/status/${vehicleAdId}`);

  const approve = () => {
    patchStatus(JSON.stringify({ status: "approved" }), undefined, {
      isJson: true, onSuccess: (data) => {
        setStatus(data.status);
      }
    });
  }

  const reject = () => {
    patchStatus(JSON.stringify({ status: "rejected", remarks }), undefined, {
      isJson: true, onSuccess: (data) => {
        setStatus(data.status);
        setOpen(false);
      }
    });
  }

  return (
    <Box>
      <hr></hr>
      <Box display={'flex'} justifyContent={'space-around'}>
        {
          (status == "new" || status == "approved") &&
          <Button
            disabled={status != 'new'}
            onClick={approve}
            style={{

              color: 'green',
              // Add any additional styles here to convey danger
            }}
          >{status == "approved" ? "Approved" : "Approve"}</Button>
        }
        {error &&
          <Typography>{error}</Typography>}
        {
          (status == "new" || status == "rejected") &&
          <Button
            onClick={()=>{setOpen(true)}}
            disabled={status != 'new'}
            style={{
              color: 'red',
              // Add any additional styles here to convey danger
            }}
          >{status == "rejected" ? "Rejected" : "Reject"}</Button>
        }
      </Box>

      <Modal open={open} onClose={()=>{setOpen(false)}}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        minWidth: 300,
                    }}
                >
                    <Formik>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                
                                <TextField
                                    label="Remarks (Optional)"
                                    onBlur={handleBlur}
                                    onChange={(event)=>{remarks = event.target.value}}
                                    fullWidth
                                    margin="normal"
                                />
                                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                                    <Button variant="contained" onClick={()=>{setOpen(false)}}>Cancel</Button>
                                    <Button  variant="contained" color="primary" onClick={reject} >Submit</Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Modal>

    </Box>
  );
};

export default ApproveRejectAd;
