import { Box, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system";
import { Close } from "@mui/icons-material";
import React from 'react';

const CustomModal = ({ open, setOpen, children }) => {
  return (
    <Modal open={open} onClose={() => { setOpen(false) }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 600,
          maxHeight: '80vh',
          maxWidth: '800vw',
          overflow: 'auto',
          borderRadius: '0.5rem',
          // Hide scrollbars but keep scrolling
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
          '-ms-overflow-style': 'none',  // IE and Edge
          'scrollbar-width': 'none'  // Firefox
        }}
      >
        <IconButton onClick={() => { setOpen(false) }} style={{ position: 'absolute', top: 5, right: 5 }}>
          <Close />
        </IconButton>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
