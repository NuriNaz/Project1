import React, { useState, useEffect } from "react";
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
  Grid,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router";
import { FaRegEdit } from "react-icons/fa";

// Components
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import useScriptRef from "hooks/useScriptRef";
import MainCard from "ui-component/cards/MainCard";

const EditUser = ({ ...others }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const scriptedRef = useScriptRef();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      setSelectedImage(file);
    }
  };

  const hiddenFileInputRef = React.useRef(null);

  const handleClickAvatar = () => {
    hiddenFileInputRef.current.click();
  };

  const GetUserDetail = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_User_Detail, { id });
      if (response.status === 200) {
        // console.log("rs", response?.data);
        setImagePreview(response?.data?.profile_img);
        setSelectedImage(response?.data?.profile_img);
        setDetails(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching user details", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const UpdateUserDetail = async (payload) => {
    try {
      const formData = new FormData();
      // formData.append("id", id);
      for (const key in payload) {
        // payload is an object contins key-value pairs
        if (payload[key] !== undefined) {
          // For find value of specific key from payload object
          formData.append(key, payload[key]);
        }
      }

      // if (selectedImage !== undefined) {
      //   formData.append("profile_img", selectedImage);
      // }
      if (
        !imagePreview.startsWith("https://storage.googleapis.com") &&
        selectedImage !== undefined
      ) {
        formData.append("profile_img", selectedImage);
      }

      // console.log("formData", formData)

      setIsLoading(true);
      const response = await Axios.Filepost(
        `${API.Update_User_Detail}/${id}`,
        formData
      );
      if (response.status === 200) {
        console.log("rs", response.data);
        setSnackbar({
          open: true,
          severity: "success",
          message: "User Data Edited Successfully",
        });
        setIsLoading(false);
        setTimeout(() => {
          navigate("/user-management/users");
        }, 3000);
      }
    } catch (error) {
      console.log("Error in Updating user details", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetUserDetail();
  }, []);

  return (
    <MainCard title="Edit User">
      {details.firstName ? (
        <Formik
          initialValues={{
            firstName: details.firstName,
            lastName: details.lastName,
            email: details.email,
            role: details.role,
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string()
              .required("First Name is required")
              .max(20, "First Name must not exceed 20 characters")
              .matches(
                /^[a-zA-Z\s]*$/,
                "No special characters allowed in First Name"
              ),
            lastName: Yup.string()
              .max(20, "Last Name must not exceed 20 characters")
              .matches(
                /^[a-zA-Z\s]*$/,
                "No special characters allowed in Last Name"
              ),
            email: Yup.string()
              .email("Must be a valid email")
              .max(255)
              .required("Email is required"),
            role: Yup.string().required("Role is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                UpdateUserDetail(values);
              }
            } catch (err) {
              console.error(err);
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
            dirty,
            resetForm,
          }) => (
            <form
              noValidate
              onSubmit={handleSubmit}
              {...others}
              autoComplete="off"
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
              >
                {/* Image Upload */}
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    ref={hiddenFileInputRef}
                  />
                  <Avatar
                    alt="User Image"
                    onClick={handleClickAvatar}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      width: 100,
                      height: 100,
                      cursor: "pointer",
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    {imagePreview && imagePreview !== "null" ? (
                      <img
                        src={imagePreview}
                        alt="User Image"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <Avatar
                        src="/broken-image.jpg"
                        style={{ fontSize: 80 }}
                      />
                    )}
                    {isHovered && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          left: 0,
                          background: "rgba(0, 0, 0, 0.7)",
                          padding: "32px",
                        }}
                      >
                        <FaRegEdit
                          style={{
                            color: "white",
                            fontSize: "40px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    )}
                  </Avatar>
                </Grid>
              </Grid>

              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-firstName">
                      First Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-firstName"
                      type="firstName"
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.firstName && errors.firstName && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-firstName"
                      >
                        {errors.firstName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-lastName">
                      Last Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-lastName"
                      type="lastName"
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.lastName && errors.lastName && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-lastName"
                      >
                        {errors.lastName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              {/* <FormControl
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-email">
                  Email
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email"
                  type="text"
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
              </FormControl> */}
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
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Email"
                  inputProps={{}}
                  disabled // Add the disabled attribute here
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
                style={{ marginTop: 10 }}
                fullWidth
                error={Boolean(touched.role && errors.role)}
              >
                <InputLabel htmlFor="outlined-role">Role</InputLabel>
                <Select
                  id="outlined-role"
                  label="Role"
                  value={values.role} // Replace with your form's value for the role field
                  onChange={handleChange} // Replace with your form's change handler for the role field
                  name="role" // Replace with the name of your role field
                  onBlur={handleBlur} // Handle onBlur event to set the field as touched
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

              <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                {/* <AnimateButton> */}
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#D72626", marginRight: "10px" }}
                  onClick={() => {
                    resetForm();
                    if (selectedImage) {
                      setImagePreview(details.profile_img);
                      setSelectedImage(details.profile_img);
                    } else {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  disabled={!dirty && selectedImage === imagePreview}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    background:
                      !dirty && selectedImage === imagePreview
                        ? "#15223fc9"
                        : "#15223F",
                    color: "#fff",
                  }}
                >
                  Submit
                </Button>
                {/* </AnimateButton> */}
              </Box>
            </form>
          )}
        </Formik>
      ) : null}
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default EditUser;
