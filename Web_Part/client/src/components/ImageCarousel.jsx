// src/ImageCarousel.js
import React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Carousel from 'react-material-ui-carousel';
import { Paper, Box, Typography, useMediaQuery } from '@mui/material';

const items = [
    {
        imageUrl: "http://localhost:3000/assets/slider1.png"
    },
    {
        imageUrl: "http://localhost:3000/assets/slider2.png"
    },
    {
        imageUrl: "http://localhost:3000/assets/slider3.png"

    }
];


function ImageCarousel() {

    return (
        
        <Carousel
            navButtonsAlwaysVisible
            indicators={true}
            indicatorIconButtonProps={{
                style: {
                    padding: '10px',    // Adjust the padding as needed
                    color: 'orange'      // Change to desired color
                }
            }}
            activeIndicatorIconButtonProps={{
                style: {
                    backgroundColor: 'rgba(255, 165, 0, 0.7)' // Change to desired color
                }
            }}
            indicatorContainerProps={{
                style: {
                    position: 'relative',
                    zIndex: 3,
                    marginTop: '50px',  // Adjust the margin to position it correctly
                    textAlign: 'center'  // Center the indicators
                }
            }}
        >
         
            {items.map((item, index) => (
                <Item key={index} item={item} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    return (
        <Box display={'flex'} justifyContent={'center'} mt={5}>
            <Paper sx={{ width: '90%', position: 'relative' }}>
                <Box sx={{ height: isNonMobileScreens? '70vh' : '30vh', position: 'relative' }}>
                    <img
                        src={props.item.imageUrl}
                        alt={props.item.name}
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            position: 'absolute', 
                            objectFit: 'cover' 
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            background: 'black',
                            opacity: 0.20,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                            borderRadius: '0.75rem'
                        }}
                    ></Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            zIndex: 2,
                            color: 'black',
                            padding: '1rem',
                            top: '15%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant={isNonMobileScreens? "h2" :  "h6"}>{props.item.name}</Typography>
                        <Typography variant="body1">{props.item.description}</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default ImageCarousel;
