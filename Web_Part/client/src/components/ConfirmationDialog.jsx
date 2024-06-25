import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmationDialog = ({ data }) => {
    const backdropStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
      };
  return (
    <Dialog
      open={data?.open}
      onClose={data?.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      overlayStyle={{backgroundColor: 'transparent'}}
      BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}
    >
      <DialogTitle id="alert-dialog-title">{data?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {data?.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={data?.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={data?.onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
