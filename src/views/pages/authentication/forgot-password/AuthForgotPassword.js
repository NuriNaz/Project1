import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  // Checkbox,
  // Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,

  // useMediaQuery
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";

import { Link, useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setIsLoading(true);
            const result = await Axios.post(API.Forgot_Pass, values);
            if (result.status === 200) {
              setIsLoading(false);
              setSnackbar({
                open: true,
                severity: "success",
                message: result.data.message,
              });
              setTimeout(() => {
                navigate("/login");
              }, 3000);
            }
          } catch (err) {
            console.log(err);
            setIsLoading(false);
            if (err.response.status === 401 || err.response.status === 500) {
              console.log(err.response.data.error, "hello");
              setSnackbar({
                open: true,
                severity: "error",
                message: err.response.data.error,
              });
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    background: "#15223F",
                    color: isSubmitting && "#fff",
                  }}
                >
                  Submit
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Divider sx={{ my: 1.5 }} />
      <Box
        style={{
          textAlign: "center",
          color: "#15223f",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        <Link
          style={{
            textAlign: "center",
            color: "#15223F",
            textDecoration: "none",
          }}
          to="/login"
        >
          Login
        </Link>
      </Box>
      {/* <Divider /> */}

      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
  );
};

export default AuthForgotPassword;
