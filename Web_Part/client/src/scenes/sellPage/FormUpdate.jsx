import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, useTheme, useMediaQuery, LinearProgress, IconButton, Divider } from '@mui/material';
import { Formik } from 'formik';
import { useGetData, usePatchData, usePostData } from 'hooks/apiHook';
import * as yup from 'yup';


import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

import { useDispatch, useSelector } from "react-redux";
import useAlertBox from 'components/AlertBox';
import VehicleAdWidget from 'scenes/widgets/VehicleAdWidget';
import AdvertWidgetShow from 'scenes/widgets/AdvertWidgetShow';
import IconBtn from "components/IconBtn";

import CloseIcon from "@mui/icons-material/Close";
import { json } from 'react-router-dom';
import ImagesListViewer from 'components/ImagesListViewer';
import Predictor from 'components/Predictor';
import CarFeaturesSelector from './FeatureSelector';

import { ToNumberPrice, ToLacOrCrore } from 'utils/extra';


const colors = [
  "White",
  "Black",
  "Red",
  "Rallye Red",
  "Blue Metallic",
  "Black Pearl",
  "Silver Metallic",
  "Gray Metallic",
  "White Pearl",
]



// Define Yup validation schema
const vehicleAdSchema = yup.object().shape({
  // title: yup.string().required('Title is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  price: yup.number().required('Price is required').positive('Price must be a positive number').min(50000, 'Price must be at least 50,000'),
  mileage: yup.number().required('Mileage is required').positive('Mileage must be a positive number'),
  year: yup.number().required('Year is required').positive('Year must be a positive number').integer('Year must be an integer'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  city: yup.string().required('Location is required'),
  area: yup.string().required('Location is required'),
  cityReg: yup.string().required('Registration city is required'),
  color: yup
    .string()
    .matches(/^[a-zA-Z]+$/, 'Color must contain only alphabets')
    .required('Color is required'),
  //images: yup.array().of(yup.string()).min(3, 'At least three images are required'),
});


const VehicleAdUpdateForm = ({vehicleAdId}) => {
  const [estPrice, setEstPrice] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);

  /** Price prediciton */
  const [isPredicting, setIsPredicting] = useState(false);

  const [prediction, setPrediction] = useState({
    upper_limit: 0,
    lower_limit: 0,
    predicted_price: 0
  });


  //array to store the previous images of the vehicle
  const [prevImages, setPrevImages] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  useGetData("market/"+vehicleAdId, undefined, { onSuccess: (data) => {
    //alert(JSON.stringify(data));
    setVehicle(data);
    setPrevImages(data.images);
    getAreas("location/"+data.location.city);
    getVehicleModels("vehicles/" + data.make);
    //alert("test"+vehicle.make);
  }})

  const initialValues = {
    title: '',
    description: vehicle? vehicle.description: '',
    price: vehicle? vehicle.price : ''  ,
    estPrice: vehicle? vehicle.estPrice: '',
    mileage: vehicle? vehicle.mileage : '',
    year:vehicle? vehicle.year :'',
    make: vehicle? vehicle.make :'',
    model: vehicle? vehicle.model :'',
    variant: vehicle? vehicle.variant :'',
    cityReg: vehicle? vehicle.cityReg :'',
    color: vehicle? vehicle.color :'',
    city: vehicle? vehicle.location.city :'',
    area: vehicle? vehicle.location.area :'',
    location: vehicle? vehicle.location :{},
    images: [],
    features: vehicle? vehicle.features: []
  };  


  async function fetchImageAsBlob(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    const extension = contentType.split('/')[1];

    const blob = await response.blob();
    return { blob, extension };
  }

  function formDataToJson(formData) {
    const json = {};

    formData.forEach((value, key) => {
      // Check if key already exists
      if (json[key]) {
        if (!Array.isArray(json[key])) {
          // Convert existing value to an array
          json[key] = [json[key]];
        }
        // Append the new value to the array
        json[key].push(value);
      } else {
        // Just set the value
        json[key] = value;
      }
    });

    return json;
  }


  /*End of price prediction */
  const { data: vehicleMakes } = useGetData("vehicles", '', { defValue: [] });
  const { data: vehicleModels, getData: getVehicleModels } = useGetData(undefined, '', { defValue: [] });

  const { data: areas, getData: getAreas } = useGetData(undefined, '', { defValue: [] });
  const cities = useSelector(state => state.cities);
  const [location, setLocation] = useState({});

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { patchData: postVehicleAd, 
    response: postedVehicle, error: vehiclePostingError } = 
    usePatchData("vehiclead/update", token);

  const { AlertBox, ShowAlertBox } = useAlertBox();

  
  const submitVehicleAd = async (values, onSubmitProps) => {

    // this allows us to send form info with image
    const formData = new FormData();

    //formData.append("image", image);
    //formData.append("picturePath", image.name);
    //Append non-image fields
    for (let key in values) {
      if (key !== "images" && key !== "location" && key !== "title" && key !== 'features') {
        formData.append(key, values[key]);
      }
    }

    formData.append("title", `${values.make} ${values.model} ${values.variant} ${values.year}`)
    formData.append("estPrice", estPrice);

    formData.append("location", location);
    values.features.forEach((value, index)=>{
      formData.append("features", value);
    });

    prevImages.forEach((image, index)=>{
      formData.append("prevImages", image);
    });
    
    formData.append("vehicleAdId", vehicle._id);

    values.images.forEach((image, index) => {
      formData.append(`images`, image, image.name);
    });

    formData.append("userId", _id);

    postVehicleAd(formData, undefined, {
      isJson: false,
      onSuccess: (data) => {

        if (data) {
          setVehicle(data);
          ShowAlertBox("Vehicle Ad Updated Successfully! Click to view it!");
        }
      }, onFail: (err) => {
        ShowAlertBox(err, 'error')
      }
    });

    //onSubmitProps.resetForm();

  };

  const { palette } = useTheme();

  return (
    <Box display={'flex'}
      gap="2rem"
      justifyContent="space-between"
      flexDirection={isNonMobileScreens ? "row" : "column-reverse"}>
        
      <Box flexBasis={"60%"}>
        <Typography>Test</Typography>
        { vehicle &&
        <Formik
          initialValues={initialValues}
          validationSchema={vehicleAdSchema}
          onSubmit={submitVehicleAd}
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
            <form onSubmit={handleSubmit}> {/* Use handleSubmit here */}
              <Typography>{values.model}</Typography>
              <TextField
                fullWidth
                select
                label="Make *"
                name="make"
                value={values.make}
                onChange={(event) => {
                  const selectedValue = event.target.value === '' ? undefined : event.target.value;
                  if (selectedValue)
                    getVehicleModels("vehicles/" + selectedValue);
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
                label="Model *"
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
                  [...vehicleModels].sort().map(model => (<option value={model}>{model}</option>))
                }
              </TextField>


              <TextField
                fullWidth
                select
                label="Year *"
                name="year"
                value={values.year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.year && Boolean(errors.year)}
                helperText={touched.year && errors.year}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  [...Array(2025 - 1900).keys()].reverse().map(x => <option value={x + 1900}>{x + 1900}</option>)
                }
              </TextField>
              {/* 
              <TextField
                fullWidth
                label="Year *"
                name="year"
                type="number"
                value={values.year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.year && Boolean(errors.year)}
                helperText={touched.year && errors.year}
                margin="normal"
              /> */}


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
                label="Mileage *"
                name="mileage"
                type="number"
                value={values.mileage}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.mileage && Boolean(errors.mileage)}
                helperText={touched.mileage && errors.mileage}
                margin="normal"
              />

              {/* <TextField
                fullWidth
                label="Color *"
                name="color"
                type="text"
                value={values.color}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.color && Boolean(errors.color)}
                helperText={touched.color && errors.color}
                margin="normal"
              /> */}

<TextField
                fullWidth
                select
                label="Color *"
                name="color"
                value={values.color}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.color && Boolean(errors.color)}
                helperText={touched.color && errors.color}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  colors.map(make => (<option value={make}>{make}</option>))
                }
              </TextField>

              <TextField
                fullWidth
                select
                label="City *"
                name="city"
                value={values.city}
                onChange={(event) => {
                  const selectedValue = event.target.value === '' ? undefined : event.target.value;
                  initialValues.city = selectedValue;
                  if (selectedValue)
                    getAreas("location/" + selectedValue);
                  handleChange({ target: { name: 'city', value: selectedValue } });
                }}
                onBlur={handleBlur}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  cities.map(city => (<option value={city}>{city}</option>))
                }
              </TextField>


              <TextField
                fullWidth
                select
                label="Area *"
                name="area"
                value={values.area}
                onChange={(event) => {
                  const selectedValue = event.target.value === '' ? undefined : event.target.value;
                  if (selectedValue) {
                    setLocation({ city: initialValues.city, area: selectedValue });
                  }

                  handleChange({ target: { name: 'area', value: selectedValue } });
                }}
                onBlur={handleBlur}
                error={touched.area && Boolean(errors.area)}
                helperText={touched.area && errors.area}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  [...areas, "main"].map(area => (<option value={area}>{area}</option>))
                }
              </TextField>


              <TextField
                fullWidth
                select
                label="City Registered *"
                name="cityReg"
                value={values.cityReg}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cityReg && Boolean(errors.cityReg)}
                helperText={touched.cityReg && errors.cityReg}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {
                  ["NOT REGISTERED", ...cities].map(cityReg => (<option value={cityReg}>{cityReg}</option>))
                }
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description *"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                margin="normal"
              />


              {/* Display selected images */}
              

              <Box mt={2}>
                <Typography variant="h6">Selected Images:</Typography>
                <Box display="flex" flexWrap={'wrap'} justifyContent={'flex-start'}>
                  {values.images &&
                    Array.from(values.images).map((image, index) => (
                      <Box key={index} mr={1}>
                        <IconButton 
                        style={{position: 'absolute'}}
                         onClick={()=>{
                          setFieldValue("images", values.images.filter(item=>item != image));
                        }}>
                          <CloseIcon />
                        </IconButton>
                        <img
                          src={URL.createObjectURL(image)}
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

                  {prevImages &&
                    Array.from(prevImages).map((image, index) => (
                      <Box key={index} mr={1}>
                        <IconButton 
                        style={{position: 'absolute'}}
                         onClick={()=>{
                          setPrevImages(prevImages.filter(item=>item != image));
                        }}>
                          <CloseIcon />
                        </IconButton>
                        <img
                          src={`http://localhost:3001/assets/${image}`}
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
              </Box>

              {/* Input for images */}

              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple
                  onDrop={(acceptedFiles) =>
                    setFieldValue("images", [...values.images, ...acceptedFiles])
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p="1rem"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!values.images.length ? (
                        <p>Add Pictures Here *</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.images.length+prevImages.length} images selected</Typography>
                          {/* You can display the selected images here if needed */}
                        </FlexBetween>
                      )}
                      <Typography color="error">
                        {touched.images && errors.images}
                      </Typography>
                    </Box>
                  )}
                </Dropzone>
              </Box>
              <CarFeaturesSelector prevFeatures={vehicle.features} onChange={(features)=>{values.features = features;}}/>

              <Divider sx={{margin: 2}}/>
              
              <TextField
                fullWidth
                label="Price *"
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.price && Boolean(errors.price)}
                helperText={touched.price && errors.price}
                margin="normal"
              />

              <Typography ml={2}>PKR {values.price != ''? ToLacOrCrore(values.price): 0}</Typography>
              <Divider sx={{margin: 2}}/>
              <Predictor vehicle={values} onPrediction={(data)=>{setEstPrice(ToNumberPrice(data.predicted_price));}} isRaw={true}/>

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ marginTop: 1 }}
              >
                Submit
              </Button>

              {/* Submission confirmation */}
              {formSubmitted && (
                <Typography variant="body1" color="textSecondary">
                  Form submitted successfully!
                </Typography>
              )}
            </form>
          )}
        </Formik>
}


      </Box>

      <Box flexBasis={"30%"}>


        {
          AlertBox
        }

        {
          postedVehicle &&
          // <Typography>
          //   {JSON.stringify(postedVehicle)}
          // </Typography>
          <Box mt={2} mb={2}>
            <VehicleAdWidget
              key={postedVehicle.title} // Add a unique key for each item in the map function
              vehicle={postedVehicle}
              redirectTo={'/market/' + postedVehicle._id}
            />

          </Box>
        }

        <AdvertWidgetShow
          heading={'Selling your vehicle with drivenet is easy'}
          title={"Just fill up the form"}
          description={"We'll show your vehicle to the millions of buyers around the country"}
          image={"http://localhost:3000/assets/sellcar.jpg"}
        />

        <Box mt={2} />
        <AdvertWidgetShow
          heading={'Make informed decisions with our ML module'}
          title={"Get Price Prediction"}
          description={"Get predicted price and increase the chances of selling your vehicle earlier"}
          image={"http://localhost:3000/assets/aitell.jpeg"}
        />

      </Box>

    </Box>
  );
};

export default VehicleAdUpdateForm;
