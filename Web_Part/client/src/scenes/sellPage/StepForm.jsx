import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';

// Define Yup validation schema for step 1
const stepOneSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  mileage: yup.number().required('Mileage is required').positive('Mileage must be a positive number'),
  year: yup.number().required('Year is required').positive('Year must be a positive number').integer('Year must be an integer'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  variant: yup.string().required('Variant is required'),
  condition: yup.string().required('Condition is required').oneOf(['New', 'Used'], 'Invalid condition'),
  location: yup.string().required('Location is required'),
});

// Define initial values for the form
const initialValues = {
  title: '',
  description: '',
  price: '',
  mileage: '',
  year: '',
  make: '',
  model: '',
  variant: '',
  condition: 'New',
  location: '',
  images: [],
};

const VehicleAdForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState(initialValues);

  const handleNextStep = (values, { setTouched }) => {
    setFormValues({ ...formValues, ...values });
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      price: true,
      mileage: true,
      year: true,
      make: true,
      model: true,
      variant: true,
      condition: true,
      location: true,
    });
    // Check if there are any validation errors
    stepOneSchema.validate(values, { abortEarly: false })
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch(() => {
        // If there are errors, do nothing, as they will be displayed by Formik
      });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Formik
      initialValues={formValues}
      validationSchema={stepOneSchema}
      onSubmit={(values) => {
        // Combine formValues with values from the final step
        const finalValues = { ...formValues, ...values };
        // Handle form submission here
        console.log(finalValues);
      }}
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
        setTouched,
      }) => (
        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}

                margin="normal"
              />
              {/* Add other input fields for step 1 */}
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNextStep(values, { setTouched })}
                >
                  Next Step
                </Button>
              </Box>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <>
              {/* Display selected images */}
              <Box mt={2}>
                <Typography variant="h6">Selected Images:</Typography>
                <Box display="flex" alignItems="center">
                  {values.images &&
                    Array.from(values.images).map((image, index) => (
                      <Box key={index} mr={1}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Image ${index}`}
                          width={100}
                        />
                      </Box>
                    ))}
                </Box>
              </Box>

              {/* Input for images */}
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    setFieldValue("images", [
                      ...values.images,
                      ...Array.from(event.currentTarget.files),
                    ]);
                  }}
                  multiple
                />
              </Button>

              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handlePrevStep}
                >
                  Previous Step
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Box>
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default VehicleAdForm;
