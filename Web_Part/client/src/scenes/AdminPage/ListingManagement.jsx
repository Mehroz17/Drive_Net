import React, { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton, Modal, TextField, useTheme, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import { useSelector } from "react-redux";
import VehicleAdWidgetGallery from "scenes/widgets/VehicleAdGalleryWidget";
import EventWidgetGallery from "scenes/widgets/EventGalleryWidget";



const eventSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    datetime: yup.date().required("Date is required"),
    picture: yup.string().required("Image is required"),
});

const initialValues = {
    title: "",
    description: "",
    datetime: "",
    picture: null,
};

const ListingManagementComponent = () => {
    const [open, setOpen] = useState(false);
    

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const token = useSelector((state) => state.token);

    const { palette } = useTheme();

    const [events, setEvents] = useState([]);
 
    const submitEvent = async (values, onSubmitProps) => {

        const formData = new FormData();
        formData.append('title', values.title)
        formData.append('description', values.description);
        formData.append('datetime', values.datetime);
        formData.append('picture', values.picture);
        formData.append('picturePath', values.picture.name);
        const response = await fetch(`http://localhost:3001/events/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        const newEvent = await response.json();
        setEvents([newEvent, ...events])
        handleClose();
    };

    const getEvents = async () => {
        const response = await fetch("http://localhost:3001/events", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const data = await response.json();
        setEvents(data)
    };


    const [alertObj, setAlertObj] = useState();
    const showAlert = (msg , severity='success')=> {
        setAlertObj({
            msg,
            severity
        })
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling animation
        });
    }

    useEffect(()=>{
        getEvents();
    },[]);
    return (
        <Box>

            <VehicleAdWidgetGallery heading={"Listed Recently for sale!"} isAdmin={true} />	
        </Box>
    );
};

export default ListingManagementComponent;
