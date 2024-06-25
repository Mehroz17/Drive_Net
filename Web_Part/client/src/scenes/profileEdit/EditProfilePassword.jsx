  import { useState, useEffect } from "react";
  import {
    Box,
    Button,
    Alert,
    TextField,
    useMediaQuery,
    useTheme,
    InputAdornment,
    IconButton,
  } from "@mui/material";

  import { Formik } from "formik";
  import * as yup from "yup";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import useAlertBox from "../../components/AlertBox";

  const EditProfilePassword = ({ userId, token }) => {
    const [registerError, setRegisterError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { AlertBox, ShowAlertBox } = useAlertBox();

    const passwordSchema = yup.object().shape({
      currentPassword: yup.string().required("Current password is required"),
      newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[0-9]/, "Password must contain at least one numeric value"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    });

    const initialValues = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    const changePassword = async (values, onSubmitProps) => {
      console.log("Submitting form...");
      console.log("Form values:", values);
    
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/changePass`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });
    
        if (!response.ok) {
          ShowAlertBox("Invalid Current Password!", "error");
          return;
        }
    
        ShowAlertBox("Password changed successfully!", "success");
        onSubmitProps.resetForm();
      } catch (error) {
        console.error("Error changing password:", error);
        setRegisterError("Failed to change password");
      }
    };
    
    
    

    return (
      <Formik
        onSubmit={(values, onSubmitProps) => {
          console.log("Form submitted");
          changePassword(values, onSubmitProps);
        }}
        initialValues={initialValues}
        validationSchema={passwordSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
              <TextField
                label="Current Password *"
                type={showCurrentPassword ? "text" : "password"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currentPassword}
                name="currentPassword"
                error={Boolean(touched.currentPassword) && Boolean(errors.currentPassword)}
                helperText={touched.currentPassword && errors.currentPassword}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle current password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="New Password *"
                type={showNewPassword ? "text" : "password"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.newPassword}
                name="newPassword"
                error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm New Password *"
                type={showConfirmPassword ? "text" : "password"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {registerError && (
              <Box mt={2}>
                <Alert severity="error">{registerError}</Alert>
              </Box>
            )}

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
                Change Password
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  };

  export default EditProfilePassword;
