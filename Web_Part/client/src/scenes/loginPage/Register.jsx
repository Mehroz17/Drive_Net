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

import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useGetData } from "hooks/apiHook";
import FlexBetween from "components/FlexBetween";

const Form = ({ handleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordC, setShowPasswordC] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { data: cities } = useGetData("location");

  const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
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
    password: yup
      .string()
      .required("required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[0-9]/, "Password must contain at least one numeric value"),
    confirmPassword: yup
      .string()
      .required("required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup
      .mixed()
      .required("Picture is required")
      .test("fileType", "Unsupported file format", (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }),
  });

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    occupation: "",
    picture: "",
  };

  const register = async (values, onSubmitProps) => {
    function formDataToJson(formData) {
      const json = {};
      formData.forEach((value, key) => {
        // Check if the key already exists in the JSON object
        if (json.hasOwnProperty(key)) {
          // If it exists and is not an array, convert it to an array
          if (!Array.isArray(json[key])) {
            json[key] = [json[key]];
          }
          json[key].push(value);
        } else {
          json[key] = value;
        }
      });
      return JSON.stringify(json);
    }
    // This allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    
    formData.append("picturePath", values.picture.name);

    // Make the request to register the user
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );

    // Parse the JSON response
    const savedUser = await savedUserResponse.json();

    // If the response is not successful, handle the error
    if (!savedUserResponse.ok) {
      if (savedUser.error === "Email is already registered.") {
        // Set the registerError state with the error message
        setRegisterError(
          "Email is already registered. Please use a different email."
        );
      } else if(savedUser.error === "Phone Number is already registered.") {
        // Handle other types of errors (optional)
        setRegisterError(
          "Phone Number is already registered. Please use a different Phone Number."
        );
      }
      else {
        // Handle other types of errors (optional)
        setRegisterError(`Registration failed: ${savedUser.error}`);
      }
      onSubmitProps.resetForm();
      return;
    }

    // If registration is successful, reset the form and set the page type to "login"
    onSubmitProps.resetForm();
    handleLogin();
  };

  return (
    <Formik
      onSubmit={register}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
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
      }) => {
        console.log("error in formik signup", Boolean(touched.firstName));
        return (
          <form onSubmit={handleSubmit}>
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
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
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
                    // if (selectedValue) getAreas("location/" + selectedValue);
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
                        {!values.picture ? (
                          <Typography>Add Picture Here (*)</Typography>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
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
                label="Email *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                label="Password *"
                type={showPassword ? "password" : "text"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
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
              />

              <TextField
                label="Confirm Password *"
                type={showPasswordC ? "password" : "text"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={Boolean(
                  touched.confirmPassword && errors.confirmPassword
                )}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPasswordC(!showPasswordC)}
                        edge="end"
                      >
                        {showPasswordC ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Display Register Error Message */}
            {registerError && (
              <Box mt={2}>
                <Alert severity="error">{registerError}</Alert>
              </Box>
            )}

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {"REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  handleLogin();
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {"Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
