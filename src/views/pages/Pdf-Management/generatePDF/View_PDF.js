import React, { useEffect, useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import useScriptRef from "hooks/useScriptRef";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import Popup from "components/Popup";

const View_PDF = ({ ...others }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(false);
  const [pdf_File, setPdfFile] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.common.white,
    },
    forms: {},
  }));
  const classes = useStyles();

  const params = useParams();

  const PDF_URL = async () => {
    const id = params.id;
    try {
      setIsLoading(true);
      const result = await Axios.post(API.Get_Single_PDF, { id });
      if (result.status === 200) {
        setIsLoading(false);
        console.log(result.data, "hi I am Data");
        setPdfFile(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
    }
  };

  const ApprovalStatus = async (approval_status, message) => {
    const docId = params.id;
    try {
      setIsLoading(true);
      const result = await Axios.post(API.Approval_disapprovalAIWallboard, {
        docId,
        status: approval_status,
        // reason: message === undefined || message === null || message === ""?"":message,
        reason: message,
      });
      if (result.status === 200) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: result.data.message,
          severity: "success",
        });
        setPopupOpen(false);
        setTimeout(() => {
          navigate("/pdf-management/pending");
          //     navigate("/pdf-management/approved");
          //   if (approval_status === "1") {
          //   } else if (approval_status === "2") {
          //     navigate("/pdf-management/disapproved");
          //   }
        }, 3000);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
      setSnackbar({
        open: true,
        message: err.response.data.error,
        severity: "error",
      });
    }
  };

  const handleApprove = async () => {
    ApprovalStatus("1");
  };

  const handleDisApprove = () => {
    setPopupOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  useEffect(() => {
    PDF_URL();
  }, []);

  return (
    // <MainCard
    //   title="View PDF"
    //   {...(pdf_File?.status === "0" && {
    //     approve: handleApprove,
    //     buttontitle1: "Approve",
    //     approveColor: "#00C853",
    //     disapprove: handleDisApprove,
    //     buttontitle2: "Disapprove",
    //     disapprovecolor: "#F44336",
    //   })}
    // >

    <MainCard
      title="View PDF"
      {...(Details.role !== "3" &&
        pdf_File?.status === "0" && {
          approve: handleApprove,
          buttontitle1: "Approve",
          approveColor: "#00C853",
          disapprove: handleDisApprove,
          buttontitle2: "Disapprove",
          disapprovecolor: "#F44336",
        })}
    >
      <Popup
        style={{ height: "600px" }}
        open={popupOpen}
        // onClose={handlePopupClose}
        title="Please Enter the Message"
        content={
          <>
            <Formik
              initialValues={{
                message: "",
              }}
              validationSchema={Yup.object().shape({
                message: Yup.string().required("Message is required"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  if (values.message !== null || values.message !== undefined) {
                    ApprovalStatus("2", values.message);
                  }
                  console.log(values, "hi");
                  if (scriptedRef.current) {
                    setStatus({ success: true });
                    setSubmitting(false);
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
                    error={Boolean(touched.message && errors.message)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-message">
                      Message
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email"
                      type="text"
                      value={values.message}
                      name="message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Message"
                      inputProps={{}}
                    />
                    {touched.message && errors.message && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}

                  <Box sx={{ mt: 1 }} style={{ textAlign: "center" }}>
                    {/* <AnimateButton> */}
                    <Button
                      size="large"
                      variant="contained"
                      color="secondary"
                      style={{ background: "#F44336", marginRight: 10 }}
                      onClick={() => setPopupOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      style={{ background: "#15223F" }}
                    >
                      Disapprove
                    </Button>
                    {/* </AnimateButton> */}
                  </Box>
                </form>
              )}
            </Formik>
          </>
        }
      />
      <div className="container">
        <div className="viewer">
          {pdf_File ? (
            <iframe
              title="PDF Viewer"
              src={pdf_File?.pdf_ai}
              width="100%"
              height="800px"
            ></iframe>
          ) : (
            <p>Loading PDF...</p>
          )}
          {/* <iframe
            title="PDF Viewer"
            src={pdf_File}
            width="100%"
            height="800px"
          ></iframe> */}
          {/* <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
            <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
          </Worker> */}
        </div>
      </div>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default View_PDF;
