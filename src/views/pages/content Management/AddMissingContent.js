import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import "react-image-crop/dist/ReactCrop.css";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useNavigate, useParams } from "react-router";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import "./style.css";
import { FcFolder } from "react-icons/fc";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import { useEffect } from "react";
import { FaRegEdit, FaRegFilePdf } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ImageCrop from "./ImageCrop";
import Popup from "components/Popup";
import Media from "../Media/Media";
import Gallery_Popup from "./Media/Gallery_popup";

const AddMissingContent = ({ ...others }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });
  const [missingData, setMissingData] = useState([]);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [approved, setApproved] = useState(false);
  const [media, setMedia] = useState(false);
  const [authorImgURL, setAuthorImgURL] = useState('');

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const theme = useTheme();
  const params = useParams();

  // Validate Data
  const getValidateData = async () => {
    const id = params.id;
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_Validate_Content_By_ID, { id });
      if (response.status === 200) {
        setMissingData(response.data);
        // setImagePreview(response?.data.author_img);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response.data.error,
      });
    }
  };

  const hiddenFileInputRef = React.useRef(null);

  const handleClickAvatar = () => {
    setMedia(true);
  //   hiddenFileInputRef.current.value = null;
  //   hiddenFileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please upload image file only",
      });
      return false;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setImagePreview(reader.result);
        console.log(reader.result)
        setSelectedImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to convert data URL to Blob
  const convertBaseUrlToBlob = () => {
    const byteString = atob(imagePreview.split(",")[1]);
    const mimeString = imagePreview.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const removeHtmlTags = (htmlString) => {
    // Use a browser-based DOM parser to handle HTML parsing
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    const html = htmlString;
    return doc.body.textContent || "";
  };

  const handleDeleteImage = async (id, img) => {
    setImagePreview(null);
    const userId = params.id;
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Author_image_Delete, {
        userId,
      });
      if (response.status === 200) {
        setIsLoading(false);
        setSelectedImageSrc(null);
        setSnackbar({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        if (missingData.id === id) {
          setMissingData({ ...missingData, author_img: null });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response.data.error,
      });
    }
  };

  useEffect(() => {
    getValidateData();
  }, []);

  return (
    <MainCard title="Add Missing Elements">
      {missingData.id ? (
        <Formik
          initialValues={{
            author_name: missingData && missingData.author_name,
            author_bio: missingData && missingData.author_bio,
            title: missingData && missingData.title,
            body: missingData && removeHtmlTags(missingData.body),
            author_img: missingData && missingData.author_img,
            id: missingData && missingData.id,
            date_created: missingData && missingData.date_created,
            term_taxonomy_id: missingData && missingData.term_taxonomy_id,
            description: missingData && missingData.description,
            term_id: missingData && missingData.term_id,
            URL: missingData && missingData.URL,
            tags: missingData && missingData.tags,
            pageviews: missingData && missingData.pageviews,
            post_id: missingData && missingData.post_id,
            date_modified: missingData && missingData.date_modified,
            creator_id: missingData && missingData.creator_id,
            creator_name: missingData && missingData.creator_name,
            post_type: missingData && missingData.post_type,
            post_status: missingData && missingData.post_status,
            category: missingData && missingData.category,
            // author_bio: missingData && missingData.author_bio,
            slug: missingData && missingData.slug,
            // submit: null,
          }}
          validationSchema={Yup.object().shape({
            author_name: Yup.string().required("KOL Name is required"),
            // author_bio: Yup.string().required("Author Bio is required"),
            title: Yup.string().required("Title is required"),
            body: Yup.string().required("Content is required"),
            // author_img: Yup.mixed().required("Author Image is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const formData = new FormData();
            // console.log(values, "hi updated Values");
            // console.log(selectedImage, "hi selected image");
            if (imagePreview !== null) {
              for (const key in values) {
                if (values[key] !== undefined && key !== "author_img") {
                  formData.append(key, values[key]);
                }
              }
              if (imagePreview) {
                if (
                  values.author_img !== "" &&
                  values.author_img !== undefined
                ) {
                  // console.log("blob",convertBaseUrlToBlob())
                  formData.append("author_img", convertBaseUrlToBlob());
                } else {
                  if (
                    values.author_img === "" &&
                    values.author_img !== undefined
                  ) {
                    // console.log("blob",convertBaseUrlToBlob())
                    formData.append("author_img", convertBaseUrlToBlob());
                  }
                }
              }
            }
            const response = {
              author_name: values.author_name,
              author_bio: values.author_bio,
              title: values.title,
              body: values.body,
              // author_img: values.author_img,
              id: values.id,
              date_created: values.date_created,
              term_taxonomy_id: values.term_taxonomy_id,
              description: values.description,
              term_id: values.term_id,
              URL: values.URL,
              tags: values.tags,
              pageviews: values.pageviews,
              post_id: values.post_id,
              date_modified: values.date_modified,
              creator_id: values.creator_id,
              creator_name: values.creator_name,
              post_type: values.post_type,
              post_status: values.post_status,
              category: values.category,
              // author_bio: values.author_bio,
              slug: values.slug,
              content_approve: approved ? 1 : undefined,
              // submit: null,
            };
            console.log(response, "response");
            try {
              setIsLoading(true);
              const result = await Axios.Filepost(
                API.Validate_Update_Content,
                imagePreview ? formData : response
              );
              if (result.status === 200) {
                setIsLoading(false);
                setSnackbar({
                  open: true,
                  severity: "success",
                  message: result.data.message,
                });
                setTimeout(() => {
                  navigate("/contentmanagement/validate-eligible-content");
                }, 3000);
              }
            } catch (err) {
              console.error(err);
              setIsLoading(false);
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
              // }
              // }
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
              {/* Author Name */}
              <FormControl
                fullWidth
                error={Boolean(touched.author_name && errors.author_name)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-post_id">
                  KOL Name{" "}
                </InputLabel>
                <OutlinedInput
                  style={{
                    border:
                      values.author_name === "" || values.author_name === null
                        ? "1px solid red"
                        : "unset",
                  }}
                  id="outlined-adornment-post_id"
                  type="text"
                  value={values.author_name}
                  name="author_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Author Name"
                  inputProps={{}}
                />
                {touched.author_name && errors.author_name && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.author_name}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Title */}
              <FormControl
                fullWidth
                error={Boolean(touched.title && errors.title)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-title">
                  Title{" "}
                </InputLabel>
                <OutlinedInput
                  style={{
                    border: values.title === "" ? "1px solid red" : "unset",
                  }}
                  id="outlined-adornment-title"
                  type="text"
                  value={values.title}
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="title"
                  inputProps={{}}
                />
                {touched.title && errors.title && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.title}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Content */}
              <FormControl
                fullWidth
                error={Boolean(touched.body && errors.body)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-body">
                  Content
                </InputLabel>
                <OutlinedInput
                  style={{
                    marginTop: 10,
                    padding: "17px 0",
                    border:
                      values.body === "" || values.body === " "
                        ? "1px solid red"
                        : "unset",
                  }}
                  // style={{border:values.title === ''?"1px solid red":'unset'}}

                  id="outlined-adornment-body"
                  multiline
                  rows={4}
                  type="text"
                  value={values.body}
                  name="body"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Content"
                  inputProps={{}}
                />

                {touched.body && errors.body && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.body}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Image Upload */}
              <Grid
                item
                xs={12}
                style={{ display: "flex", alignItems: "center", marginTop: 15 }}
              >
                <InputLabel
                  style={{ color: "#000", fontSize: 15, marginRight: 20 }}
                  htmlFor="outlined-adornment-author_img"
                >
                  KOL Image
                </InputLabel>
                {/* <p>Author Image</p> */}
                <input
                  accept="image/png, image/gif, image/jpeg"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  ref={hiddenFileInputRef}
                  name="author_img" // Make sure the name attribute is set
                />

                {/* {!!selectedImageSrc && (
                  <ImageCrop
                    openPOP_url={selectedImageSrc}
                    closedPOP={(v) => setSelectedImageSrc(v)}
                    cropedImageSrc={(v) => {
                      setImagePreview(v);
                      setSelectedImageSrc(null);
                    }}
                  />
                )} */}

                {!!authorImgURL && (
                  <ImageCrop
                    openPOP_url={authorImgURL}
                    closedPOP={(v) => setAuthorImgURL(v)}
                    cropedImageSrc={(v) => {
                      setImagePreview(v);
                      setAuthorImgURL(null);
                    }}
                  />
                )}

                <Avatar
                  alt="User Image"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    width: 100,
                    height: 100,
                    cursor: "pointer",
                    position: "relative",
                    textAlign: "center",
                    borderRadius: 10,
                    // border:
                    //   missingData.author_img === "" ? "1px solid red" : "unset",
                  }}
                >
                  {imagePreview !== null ? (
                    <img
                      src={imagePreview}
                      alt="User Image"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : missingData.author_img &&
                    missingData.check_status === false ? (
                    <img
                      src={`https://www.physiciansweekly.com/wp-content/uploads/${missingData.author_img}`}
                      // src={missingData.author_img} // Display author_img from API
                      alt="Author Image"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : missingData.author_img &&
                    missingData.check_status === true ? (
                    <img
                      src={missingData.author_img}
                      // src={missingData.author_img} // Display author_img from API
                      alt="Author Image"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Avatar src="/broken-image.jpg" style={{ fontSize: 80 }} />
                  )}
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        // right: 0,
                        // left: 0,
                        background: "rgba(0, 0, 0, 0.7)",
                        padding: "35px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // width:"100%"
                        }}
                      >
                        <FaRegEdit
                          style={{
                            color: "white",
                            fontSize: "30px",
                            cursor: "pointer",
                          }}
                          onClick={handleClickAvatar}
                        />
                        <MdOutlineDeleteOutline
                          style={{
                            color: "white",
                            fontSize: "30px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleDeleteImage(
                              missingData.id,
                              missingData.author_img
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </Avatar>
                {touched.author_img && errors.author_img && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-author_img"
                  >
                    {errors.author_img}
                  </FormHelperText>
                )}
              </Grid>

              {/* Mark as Approved */}
              <FormControlLabel
                style={{ color: "#000" }}
                control={
                  <Checkbox
                    checked={missingData?.content_approve}
                    onChange={(event) => {
                      if (event.target.checked) {
                        // console.log(event.target.checked, 'hello This one is gonna checked')
                        setApproved(true);
                      } else {
                        setApproved(false);
                      }
                    }}
                  />
                }
                label="Mark as Approved"
              />

              <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#D72626" }}
                  onClick={() => {
                    resetForm();
                    if (missingData.author_img) {
                      setImagePreview(missingData.author_img);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  disableElevation
                  // disabled={isSubmitting}
                  disabled={
                    !dirty &&
                    missingData &&
                    missingData?.author_img === imagePreview
                  }
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    background:
                      !dirty && missingData?.author_img === imagePreview
                        ? "#15223fc9"
                        : "#15223F",
                    color: isSubmitting && "#fff",
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
      <Popup
        title="Media Gallery"
        open={media}
        overflowY="auto"
        height="600px"
        width="1000px !important"
        content={
          <>
            <Gallery_Popup
              authorURL={setAuthorImgURL}
              close={() => setMedia(false)}
              setSnackbar={setSnackbar}
            />
          </>
        }
      />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default AddMissingContent;
