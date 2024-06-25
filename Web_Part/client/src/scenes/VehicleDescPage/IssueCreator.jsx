import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, Select, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";

const issueSchema = yup.object().shape({
    details: yup.string().required("Details are required"),
    category: yup.string().required("Category is required"),
});

const initialValues = {
    userId: "hello",
    vehicleAdId: "",
    sellerId: "",
    details: "",
    category: "",
    userInfo: {}
};

const categories = ["Wrong Price Prediction", "Fake Vehicle details", "Fraud Seller", "Other"]; // Add your categories here

const IssueCreationComponent = ({user, vehicleAdId,seller, onIssueReported}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const submitIssue = async (values, onSubmitProps) => {
        try {
            values.userId = user._id;
            values.userInfo = {
                username: `${user.firstName} ${user.lastName}`,
                phone: '+92 301 1212123'
            }
            values.vehicleAdId = vehicleAdId;
            values.sellerId = seller._id;
            const response = await fetch(`http://localhost:3001/issues`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });
            if (response.ok){
                onIssueReported("Your issue have been reported to admin Successfully!")
            }else{
                onIssueReported(JSON.stringify(response));
            }
            // Handle success or error response as needed
            handleClose();
        } catch (error) {
            // Handle error
            console.error('Error submitting issue:', error);
        }
    };

    return (
        <Box>
            {/* Plus icon to toggle the form */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" onClick={handleOpen} color="primary">
                    Report an Issue
                </Button>
            </Box>

            {/* Modal for the form */}
            <Modal open={open} onClose={handleClose}>
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
                    <Formik
                        initialValues={initialValues}
                        validationSchema={issueSchema}
                        onSubmit={submitIssue}
                    >
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
                                
                                <Select
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="category"
                                    fullWidth
                                    error={Boolean(touched.category) && Boolean(errors.category)}
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : "Select Category")}
                                    margin="normal"
                                >
                                    <MenuItem value="" disabled>
                                        Select Category
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    label="Details"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.details}
                                    name="details"
                                    error={Boolean(touched.details) && Boolean(errors.details)}
                                    helperText={touched.details && errors.details}
                                    fullWidth
                                    margin="normal"
                                />
                                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </Box>
    );
};

export default IssueCreationComponent;
