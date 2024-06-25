import React from 'react';
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImagesListViewer = ({
    images, onDelete, getSrc = (image) => { return `http://localhost:3001/assets/${image}` }
}) => {
    return (
        <Box display="flex" flexWrap={'wrap'} justifyContent={'flex-start'}>
            {images &&
                Array.from(images).map((image, index) => (
                    <Box key={index} mr={1}>
                        <IconButton
                            style={{ position: 'absolute' }}
                            onClick={() => { onDelete(image) }}>
                            <CloseIcon />
                        </IconButton>
                        <img
                            src={getSrc(image)}
                            alt={`Image ${index}`}
                            height={130}
                            width={100}
                            style={{
                                objectFit: 'contain',
                                background: 'white',
                                border: '2px solid orange',
                                padding: '0.1rem',
                                borderRadius: '0.25rem'
                            }}
                        />
                    </Box>
                ))}
        </Box>
    );
};

export default ImagesListViewer;
