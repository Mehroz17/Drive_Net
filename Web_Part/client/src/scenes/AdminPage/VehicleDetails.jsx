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



const eventSchema = yup.object().shape({
    // make: yup.string().required("Vehicle Make is required"),
    // model: yup.string().required("Vehicle model is required"),
    // varient: yup.string().required("Vehicle varient is required"),
    // engineC: yup.string().required("Vehicle engine capacity is required"),
    // category: yup.string().required("Vehicle Category is required"),
    // transType: yup.string().required("Vehicle Category is required"),
    // fuelType: yup.string().required("Vehicle Category is required"),
});

const initialValues = {
    make: "",
    model: "",
    varient: "",
    engineC: "",
    category: "",
    transType: "",
    fuelType: ""
};

const VehicleDetailsComponent = () => {
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const token = useSelector((state) => state.token);

    const { palette } = useTheme();

    const [events, setEvents] = useState([]);

    const { data: vehicleMakes } = useGetData("vehicles");
    const { data: vehicleModels, getData: getVehicleModels } = useGetData();


    const fuelTypes = {
        hybrid: 'Hybrid',
        petrol: 'petrol',
        diesel: 'diesel'
    }

    const vehCategories = {
        hatchback: 'Hatchback',
        sedan: 'Sedan',
        suv: 'SUV',
        croosover: 'CrooseOver'
    }

    const transTypes = {
        automatic: 'Automatic',
        manual: 'Manual'
    }

    const {putData:postVehicleDetails, response:postVehicleDetailsResponse, error: vehicleUpdateError} = usePutData();

    const submitEvent = async (values, onSubmitProps) => {
        const target = `vehicles/${values.make}/${values.model}`;
        postVehicleDetails(JSON.stringify(values), target, {
            onSuccess:()=>{
                //onSubmitProps.resetForm();
                ShowAlertBox('Vehicle Details Added Successfully!');
            }
        });
        
        ShowAlertBox(vehicleUpdateError, 'error');
    };

    const { AlertBox, ShowAlertBox } = useAlertBox();
    return (
        <Box>
            {
                /* show alet box if needed */
                AlertBox
            }
            <Formik
                initialValues={initialValues}
                validationSchema={eventSchema}
                onSubmit={submitEvent}
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
                            select
                            label="Make"
                            name="make"
                            value={values.make}
                            onChange={(event) => {
                                const selectedValue = event.target.value === '' ? undefined : event.target.value;
                                if (selectedValue)
                                    getVehicleModels('vehicles/' + selectedValue);
                                handleChange({ target: { name: 'make', value: selectedValue } });
                            }}
                            onBlur={handleBlur}
                            error={touched.make && Boolean(errors.make)}
                            helperText={touched.make && errors.make}
                            SelectProps={{
                                native: true,
                            }}
                            margin="normal"
                        >
                            <option value=""></option>
                            {
                                vehicleMakes.map(make => (<option value={make}>{make}</option>))
                            }
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            label="Model"
                            name="model"
                            value={values.model}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.model && Boolean(errors.model)}
                            helperText={touched.model && errors.model}
                            SelectProps={{
                                native: true,
                            }}
                            margin="normal"
                        >
                            <option value=""></option>
                            {
                                vehicleModels.sort().map(model => (<option value={model}>{model}</option>))
                            }
                        </TextField>
                        <TextField
                            fullWidth
                            label="Variant (Optional)"
                            name="variant"
                            value={values.variant}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.variant && Boolean(errors.variant)}
                            helperText={touched.variant && errors.variant}
                            margin="normal"
                        />


                        <TextField
                            fullWidth
                            label="Engine Capacity (cc)"
                            name="engineC"
                            type="number"
                            value={values.engineC}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.engineC && Boolean(errors.engineC)}
                            helperText={touched.engineC && errors.engineC}
                            margin="normal"
                        />

                        <Box border={'solid 1px grey'} padding={1} borderRadius={1}>
                            <Typography variant="subtitle1" gutterBottom>
                                Transmission Type
                            </Typography>
                            <RadioGroup
                                row
                                name="transType"
                                value={values.transType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {
                                    Object.keys(transTypes).map(item => <FormControlLabel value={item} control={<Radio />} label={transTypes[item]} />)
                                }

                            </RadioGroup>

                        </Box>


                        <Box border={'solid 1px grey'} padding={1} borderRadius={1} mt={1}>
                            <Typography variant="subtitle1" gutterBottom>
                                Fuel Type
                            </Typography>

                            <RadioGroup
                                row
                                label="Fuel Type"
                                name="fuelType"
                                value={values.fuelType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {
                                    Object.keys(fuelTypes).map(item => <FormControlLabel value={item} control={<Radio />} label={fuelTypes[item]} />)
                                }

                            </RadioGroup>
                        </Box>


                        <Box border={'solid 1px grey'} padding={1} borderRadius={1} mt={1}>
                            <Typography variant="subtitle1" gutterBottom>
                                Category
                            </Typography>
                            <RadioGroup
                                row
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {
                                    Object.keys(vehCategories).map(item => <FormControlLabel value={item} control={<Radio />} label={vehCategories[item]} />)
                                }

                            </RadioGroup>
                        </Box>


                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </Box>
                    </form>
                )}
            </Formik>

        </Box>
    );
};

export default VehicleDetailsComponent;
