import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Alert,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useGetData } from "hooks/apiHook";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import useAlertBox from "../../components/AlertBox";

const EditProfileForm = ({ userId, token }) => {
  const [registerError, setRegisterError] = useState("");
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { data: cities } = useGetData("location");
  const [showPassword, setShowPassword] = useState(true);
  const { AlertBox, ShowAlertBox } = useAlertBox();

  const editProfileSchema = yup.object().shape({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, "First name must contain only alphabets")
      .required("First name is required"),
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]+$/, "Last name must contain only alphabets")
      .required("Last name is required"),
    phone: yup
      .number()
      .typeError("Phone number must be a number")
      .required("Phone number is required*")
      .test(
        "length",
        "Phone number must be exactly 11 digits long*",
        (value) => value && value.toString().length === 10
      )
      .test(
        "startsWith03",
        "Phone number must start with '03'",
        (value) => value && value.toString().startsWith("3")
      ),
    email: yup.string().email("invalid email").required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.mixed(),
    /*     password: yup
    .string()
    .required("required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one numeric value"), */
  });

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId, token]);

  const initialValuesEditProfile = {
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    email: user ? user.email : "",
    phone: user ? user.phone : "",
    location: user ? user.location : "",
    occupation: user ? user.occupation : "",
    picture: user ? user.picturePath : "",
    //password: user ? user.password : "",
  };

  const editProfile = async (values, onSubmitProps) => {
    console.log("Submitting form...");
    console.log("Form values:", values);

    try {
      // Extract only the necessary fields for the user profile update
      const {
        firstName,
        lastName,
        email,
        phone,
        location,
        occupation,
        picture,
        //password,
      } = values;

      // Create a new FormData object to handle the file upload
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("location", location);
      formData.append("occupation", occupation);
      //formData.append("password", password);
      if (picture) {
        formData.append("picture", picture[0]); // Append the file correctly

        // Append the picturePath if it exists
        if (values.picture && values.picture.name) {
          formData.append("picturePath", values.picture.name);
        }
      }

      // Make the request to update the user profile
      const updatedUserResponse = await fetch(
        `http://localhost:3001/users/${userId}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is not successful
      if (!updatedUserResponse.ok) {
        // Handle errors here
        const errorMessage = await updatedUserResponse.text(); // Get the error message from the response
        setRegisterError(`Profile update failed: ${errorMessage}`);
        return;
      }
      getUser();
      ShowAlertBox("Profile updated successfully!", 'success');

      // If update is successful, reset the form
    } catch (error) {
      console.error("Error updating profile:", error);
      setRegisterError("Failed to update profile");
    }

    onSubmitProps.resetForm();
  };

  return (
    <Formik
      onSubmit={(values, onSubmitProps) => {
        console.log("Form submitted");
        editProfile(values, onSubmitProps);
      }}
      initialValues={initialValuesEditProfile}
      validationSchema={editProfileSchema}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          {AlertBox}
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <>
              <TextField
                label="First Name *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Last Name *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                select
                label="City *"
                name="location"
                value={values.location}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  handleChange({
                    target: { name: "location", value: selectedValue },
                  });
                }}
                onBlur={handleBlur}
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value=""></option>
                {cities.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </TextField>

              <TextField
                label="Occupation *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
                sx={{ gridColumn: "span 4" }}
              />

              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    setFieldValue("picture", acceptedFiles[0])
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
                      {!values.picture && user && user.picture ? (
                        <FlexBetween>
                          <Typography>{user.picture.name}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture.name}</Typography>
                          {values.picture.name ? (
                            <UserImage image={values.picture.name} />
                          ) : (
                            <UserImage image={values.picture} />
                          )}
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                      <Typography color="error">
                        {touched.picture && errors.picture}
                      </Typography>
                    </Box>
                  )}
                </Dropzone>
              </Box>

              <TextField
                label="Phone *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={Boolean(touched.phone) && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
            </>

            <TextField
              label="Email (Not Editable)"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
              disabled
            />

            {/*<TextField
              label="Password *"
              type={showPassword ? "password" : "text"}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}
          </Box>

          {/* Display Profile Update Error Message */}
          {registerError && (
            <Box mt={2}>
              <Alert severity="error">{registerError}</Alert>
            </Box>
          )}

          {/* BUTTON */}
          <Box>
            <Button
              fullWidth
              type="submit" // Ensure this is set to "submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {"SAVE CHANGES"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
