import React, { useEffect, useState } from "react";
import { RadioGroup, Radio, FormControlLabel, Box, Button, IconButton, Modal, TextField, useTheme, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik } from "formik";
import { useGetData, usePostData, usePutData } from "hooks/apiHook";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import { useSelector } from "react-redux";
import EventWidgetGallery from "scenes/widgets/EventGalleryWidget";
import useAlertBox from "components/AlertBox";
import UserCard from "components/UserCard";



const eventSchema = yup.object().shape({
    userQuery: yup.string().required("User ID or email is required"),
});

const initialValues = {
    userQuery : ""
};

const UserManagementComponent = () => {


    const  {getData:getUserData, data:userData} = useGetData('', '', {defValue: null, onSuccess:()=>{console.log('out the test')}} );

    const submitQuery = async (values, onSubmitProps) => {
        getUserData(`users/${values.userQuery}`);
    }

    const { AlertBox, ShowAlertBox } = useAlertBox();
    return (
        <Box>
            {
                /* show alert box if needed */
                AlertBox
            }
            <Formik
                initialValues={initialValues}
                validationSchema={eventSchema}
                onSubmit={submitQuery}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit, // <-- Ensure handleSubmit is included
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>

                        <TextField
                            fullWidth
                            label="User ID or Email"
                            name="userQuery"
                            value={values.userQuery}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.userQuery && Boolean(errors.userQuery)}
                            helperText={touched.userQuery && errors.userQuery}
                            margin="normal"
                        />

                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button type="submit" variant="contained" color="primary">Get Details</Button>
                        </Box>

                    </form>
                )}
            </Formik>

            {
            userData && userData != {} &&
            <UserCard user={userData} />
            }

        </Box>
    );
};

export default UserManagementComponent;
