import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  // useMediaQuery
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// assets
import { useNavigate } from "react-router-dom";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
import { render } from "react-dom";
import { ProfileUser } from "store/Data";
import axios from "axios";

// import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
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
  const dispatch = useDispatch();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setIsLoading(true);
      const result = await axios.post(API.Login, values);
      if (result.status === 200) {
        setIsLoading(false);
        Cookies.set("userToken", result.data.token, { expires: 1 });
        const data = JSON.stringify(result.data.userdetails);
        localStorage.setItem("Profile_Details", data);
        dispatch(ProfileUser(result.data.userdetails));
        window.location.href = "/dashboard";
        // navigate("/dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if (err.response.status === 401 || err.response.status === 500) {
        setSnackbar({
          open: true,
          severity: "error",
          message: err.response.data.error,
        });
      }
    }
  };

  useEffect(() => {
    const Token = Cookies.get("userToken");
    if (Token) {
      navigate("/dashboard/");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          // submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string()
            .matches(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              "Password must be at least 8 characters, and contain at least 1 uppercase letter, 1 digit, and 1 special character"
            )
            .max(255)
            .required("Password is required"),
        })}
        // onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        //   try {
        //     setIsLoading(true);
        //     const result = await Axios.post(API.Login, values);
        //     if (result.status === 200) {
        //       setIsLoading(false);
        //       Cookies.set("userToken", result.data.token, { expires: 1 });
        //       const data = JSON.stringify(result.data.userdetails);
        //       localStorage.setItem("Profile_Details", data);
        //       navigate("/dashboard");
        //       window.location.reload();
        //       if (scriptedRef.current) {
        //         setStatus({ success: true });
        //         setSubmitting(false);
        //       }
        //     }
        //   } catch (err) {
        //     console.log(err, 'I am an erorr');
        //     setIsLoading(false);
        //     setSnackbar({
        //       open: true,
        //       severity: "error",
        //       message: err.response.data.error,
        //     });
        //     if (err.response.status === 401 || err.response.status === 500) {
        //       console.log(err.response.data.error, "hello");
        //       setSnackbar({
        //         open: true,
        //         severity: "error",
        //         message: err.response.data.error,
        //       });
        //     }
        //     if (scriptedRef.current) {
        //       setStatus({ success: false });
        //       setErrors({ submit: err.message });
        //       setSubmitting(false);
        //     }
        //   }
        // }}
        onSubmit={handleSubmit}
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
              <InputLabel htmlFor="outlined-adornment-email-login" shrink>
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

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login" shrink>
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                // **autoFocus**
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              spacing={1}
              style={{ display: "flex" }}
            >
              {/* <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              /> */}
              <Typography
                variant="subtitle1"
                color="#15223F"
                sx={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => {
                  navigate("/forgot-password/");
                }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            {/* {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )} */}

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
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
  );
};

export default FirebaseLogin;
