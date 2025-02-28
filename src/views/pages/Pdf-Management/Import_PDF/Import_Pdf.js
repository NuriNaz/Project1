import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import { FcFolder } from "react-icons/fc";
import './style.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";

const Import_Pdf = ({ ...others }) => {
    const scriptedRef = useScriptRef();
    const theme = useTheme();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: "template-management" });
      }, []);

  return (
    <MainCard title="Import PDF">
      {/* <ComingSoon /> */}
      <Formik
        initialValues={{
            manualpdf: null,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
            manualpdf: Yup.mixed().required("Manual PDF is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
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
            noValidate
            onSubmit={handleSubmit}
            {...others}
            autoComplete="off"
          >
            {/* Import PDF File Here */}
            <FormControl
              fullWidth
              error={Boolean(touched.manualpdf && errors.manualpdf)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-manualpdf">
                Upload Manual PDF File Here
              </InputLabel>
              <OutlinedInput
              style={{marginTop:"7px"}}
                id="outlined-adornment-manualpdf"
                type="file"
                value={values.manualpdf}
                name="manualpdf"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Manual PDF File"
                // inputProps={{}}
                inputProps={{ accept: "application/pdf" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle" edge="end">
                      <FcFolder />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.manualpdf && errors.manualpdf && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-manualpdf"
                >
                  {errors.manualpdf}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#15223F" }}
                >
                  Upload PDF
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  )
}

export default Import_Pdf
