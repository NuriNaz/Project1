import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useScriptRef from "hooks/useScriptRef";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";

// Components
import MainCard from "ui-component/cards/MainCard";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import { updateUser } from "store/Data";

const Profile = ({ ...others }) => {
  const scriptedRef = useScriptRef();
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
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
  const dispatch = useDispatch();

  const hiddenFileInputRef = React.useRef(null);

  const handleClickAvatar = () => {
    hiddenFileInputRef.current.click();
  };

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  const GetProfile = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Get_Profile, {
        user_id: Details?.id,
      });
      if (res) {
        // console.log("profile", res.data)
        setDetails(res?.data);
        setImagePreview(res?.data?.profile_img);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching profile", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  // const UpdateProfile = async (formData) => {
  //   try {
  //     setIsLoading(true)
  //     const res = await Axios.Filepost(`${API.Update_Profile}/${details.id}`, formData)
  //     if (res) {
  //       setIsLoading(false)
  //       setSnackbar({
  //         open: true,
  //         severity: 'success',
  //         message: 'Profile Updated Successfully'
  //       })
  //     }
  //   } catch (error) {
  //     console.log("Error in Updating profile", error)
  //     setSnackbar({
  //       open: true,
  //       severity: 'error',
  //       message: error.message
  //     })
  //     setIsLoading(false)
  //   }
  // }

  const UpdateProfile = async (formData) => {
    try {
      setIsLoading(true);
      const id = details.id;
      // console.log(id, "hi I am id");
      await dispatch(updateUser({ formData, id }))
        .then((result) => {
          setIsLoading(false);
          console.log(result, "hello its a result");
          setSnackbar({
            open: true,
            severity: "success",
            message: "Profile Updated Successfully",
          });
        })
        .catch((error) => {
          console.log("Error in Updating profile", error);
          setSnackbar({
            open: true,
            severity: "error",
            message: error.message,
          });
          setIsLoading(false);
        });
      // console.log(result, "Hello Result");
    } catch (error) {
      console.log("Error in Updating profile", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetProfile();
  }, []);

  return (
    <MainCard title="User Profile">
      {details?.id ? (
        <Formik
          initialValues={{
            firstName: details.firstName,
            lastName: details.lastName,
            email: details.email,
            role: details.role,
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required("First Name is required").max(20, "First Name must not exceed 20 characters")
            .matches(
              /^[a-zA-Z\s]*$/,
              "No special characters allowed in First Name"),
            // lastName: Yup.string().required("Last Name is required"),
            lastName:Yup.string() .max(20, "Last Name must not exceed 20 characters")
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
              const result = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                role: values.role,
              };
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                const formData = new FormData();
                for (let key in values) {
                  if (values[key] !== undefined) {
                    formData.append(key, values[key]);
                  }
                }
                if (selectedImage !== undefined) {
                  formData.append("profile_img", selectedImage);
                }
                // if (
                //   (selectedImage !== undefined && details.profile_img !== "") ||
                //   details.profile_img !== undefined ||
                //   details.profile_img !== "null"
                // ) {
                //   formData.append("profile_img", details.profile_img);
                // }
                UpdateProfile(!selectedImage ? result : formData);
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
            resetForm,
            dirty,
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
                      // <center>
                      <img
                        src={imagePreview}
                        // alt="User Image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      // </center>
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

                <Grid item xs={6}>
                  {/* First Name */}
                  <FormControl
                    fullWidth
                    // style={{width:"50%"}}
                    error={Boolean(touched.firstName && errors.firstName)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-firstName">
                      First Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-firstName"
                      type="text"
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="First Name"
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

                <Grid item xs={6}>
                  {/* Last Name */}
                  <FormControl
                    fullWidth
                    // style={{width:"50%"}}
                    error={Boolean(touched.lastName && errors.lastName)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-lastName">
                      Last Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-lastName"
                      type="text"
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Last Name"
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

                <Grid item xs={12}>
                  {/* Email */}
                  <FormControl
                    fullWidth
                    // style={{width:"50%"}}
                    error={Boolean(touched.email && errors.email)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-email" disabled>
                      Email
                    </InputLabel>
                    <OutlinedInput
                      disabled
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
                        id="standard-weight-helper-text-firstname"
                      >
                        {errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              {/* Role Select */}
              <FormControl
                style={{ marginTop: 10 }}
                fullWidth
                error={Boolean(touched.role && errors.role)}
              >
                <InputLabel htmlFor="outlined-role">Role</InputLabel>
                <Select
                  disabled
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

              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}

              <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#D72626" }}
                  onClick={() => {
                    resetForm();
                    if (details.profile_img) {
                      setImagePreview(details.profile_img);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  // disableElevation
                  disabled={!dirty && details?.profile_img === imagePreview}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    background:
                      !dirty && details?.profile_img === imagePreview
                        ? "#15223fc9"
                        : "#15223F",
                    marginLeft: "20px",
                  }}
                >
                  Submit
                </Button>
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

export default Profile;
