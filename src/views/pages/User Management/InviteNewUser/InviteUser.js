import React, { useState } from "react";
// third party
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import useScriptRef from "hooks/useScriptRef";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";


import MainCard from "ui-component/cards/MainCard";
import Axios from "api/Axios";
import { API } from "api/API";
import Message from "components/Snackbar/Snackbar";
import Loading from "components/Loading";

const InviteUser = ({ ...others }) => {
  const scriptedRef = useScriptRef();
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.common.white,
    },
  }));
  const classes = useStyles(); // Don't forget to call useStyles

  return (
    <MainCard title="Invite New User">
      {/* <ComingSoon />  */}
      <div className={classes.root}>
        <Formik
          initialValues={{
            email: "",
            role: "",
            // submit: null,
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Must be a valid email")
              .max(255)
              .required("Email is required"),
            role: Yup.string().required("Role is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
            try {
              setIsLoading(true)
              const result = await Axios.post(API.Invite_New_User, values);
              if (result.status === 200) {
                // console.log(result.data, "hello this is invite user data ");
                setSnackbar({
                  open: true,
                  severity: "success",
                  message: result.data.message,
                });
                resetForm();
              setIsLoading(false)
              }
          
            } catch (err) {
              setIsLoading(false)
              console.log(err);
              if(err.response.status === 400){
                setSnackbar({
                  open: true,
                  severity: "error",
                  message: err.response.data.error,
                });
              }
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
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
            <form
              className={classes.forms}
              noValidate
              onSubmit={handleSubmit}
              {...others}
              autoComplete="off"
            >
              {/* Email */}
              <FormControl
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-email">
                  Email
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Email"
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

              {/* Role Select */}
              <FormControl
                style={{ marginTop: 10 }}
                fullWidth
                error={Boolean(touched.role && errors.role)}
              >
                <InputLabel htmlFor="outlined-role">Role</InputLabel>
                <Select
                  // disabled
                  id="outlined-role"
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  onBlur={handleBlur}
                  style={{ padding: "3px 0" }}
                >
                  <MenuItem value="1">Admin</MenuItem>
                  <MenuItem value="2">Editor</MenuItem>
                  <MenuItem value="3">Viewer</MenuItem>

                  {/* Add more roles as needed */}
                </Select>

                {touched.role && errors.role && (
                  <FormHelperText error>{errors.role}</FormHelperText>
                )}
              </FormControl>

              {/* {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )} */}

              <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                {/* <AnimateButton> */}
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#15223F",  color:isSubmitting? '#fff': '#fff' }}
                >
                  Invite Users
                </Button>
                {/* </AnimateButton> */}
              </Box>
            </form>
          )}
        </Formik>
      </div>
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
    </MainCard>
  );
};

export default InviteUser;
