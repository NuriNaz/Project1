import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useTheme } from "@emotion/react";
import { months } from "utils/Fields";

import "./style.css";
import Axios from "api/Axios";
import { API } from "api/API";

const initialValues = {
  wallboards: [
    {
      wallboardname: "",
      template_id: "",
      network_type: "",
      theme_name: "",
      month: ''
    },
  ],
};

const validationSchema = Yup.object().shape({
  wallboards: Yup.array().of(
    Yup.object().shape({
      // wallboardname: Yup.string().required("Wallboard Name is required"),
      wallboardname: Yup.string().trim().required("Wallboard Name is required"),
      template_id: Yup.string().required("Please select Template"),
      network_type: Yup.string().required("Edition Name is required"),
      theme_name: Yup.string().required("Theme is required"),
      month: Yup.string().required("Month is required"),
    })
  ),
});

const AddRemoveForm = ({
  close,
  setSnackbar,
  Get_All_Wallboards,
  setIsLoading,
  page,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [addMore, setAddMore] = useState(false);
  const [network_Options, setNetworkOptions] = useState([]);
  const [template, setTemplate] = useState([]);
  const [themeData, setTheme] = useState([]);

  const theme = useTheme();

  const network_Type = async () => {
    try {
      const result = await Axios.get(API.Get_Network_Type);
      if (result.status === 200) {
        setNetworkOptions(result.data);
      }
    } catch (err) {
      console.log(err, "Hi this is error");
    }
  };

  // Get Template API
  const GetTemplates = async () => {
    try {
      const response = await Axios.get(API.Get_Template);
      if (response.status === 200) {
        setTemplate(response.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
    }
  };

  const Select_Theme = async () => {
    try {
      const response = await Axios.get(API.Themes_Listing);
      if (response.status === 200) {
        // console.log(response.data, "hello this is Data");
        setTheme(response.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
    }
  };

  useEffect(() => {
    network_Type();
    GetTemplates();
    Select_Theme();
  }, []);

  return (
    <Formik
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // Handle form submission here

        // console.log(values, "hi these are");
        const data = values.wallboards.map((item) => {
          return {
            template_id: item.template_id,
            wallboardname: item.wallboardname,
            network_type: item.network_type,
            template_theme: item.theme_name,
            month: item.month
          };
        });
        setSubmitting(false);
        // setopen
        try {
          setIsLoading(true);
          const response = await Axios.post(API.Create_Wallboard, data);
          if (response.status === 201) {
            Get_All_Wallboards(page);
            // console.log(response.data, "submit data");
            setSnackbar({
              open: true,
              message: response.data.message,
              severity: "success",
            });
            close();
            // Get_All_Wallboards();
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err, "Error while getting Categories");
        }
      }}
    >
      {({ values, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <FieldArray name="wallboards">
            {({ push, remove }) => (
              <div>
                {values.wallboards.map((_, index) => (
                  <div className="wallboard_form" key={index}>
                    <div>
                      {/* <FormControl
                        fullWidth
                        sx={{ ...theme.typography.customInput }}
                      >
                        <InputLabel htmlFor={`wallboardname[${index}]`}>
                          Wallboard Name
                        </InputLabel>
                        <Field
                          as={OutlinedInput}
                          type="text"
                          name={`wallboards[${index}].wallboardname`}
                        />
                      </FormControl> */}
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          type="text"
                          name={`wallboards[${index}].wallboardname`}
                          value={values.wallboards[index].wallboardname}
                          onChange={(e) =>
                            setFieldValue(
                              `wallboards[${index}].wallboardname`,
                              e.target.value
                            )
                          }
                          variant="outlined"
                          label="Wallboard Name"
                        />
                      </FormControl>
                      <ErrorMessage
                        name={`wallboards[${index}].wallboardname`}
                        component="div"
                        className="error"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        fullWidth
                        className="Select_template"
                      >
                        {/* <InputLabel htmlFor={`network_type[${index}]`}>
          Network Type
        </InputLabel> */}
                        <Autocomplete
                          autoHighlight
                          options={template}
                          getOptionLabel={(option) =>
                            option.template_name || ""
                          }
                          key={(option) => option.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Template"
                              variant="outlined"
                            />
                          )}
                          name={`wallboards[${index}].template_id`}
                          value={
                            values.wallboards[index].template_id
                              ? template.find(
                                  (option) =>
                                    option.id ===
                                    // option.template_name ===
                                    values.wallboards[index].template_id
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            setFieldValue(
                              `wallboards[${index}].template_id`,
                              newValue ? newValue.id : ""
                            );
                          }}
                          noOptionsText="No Results Found"
                        />
                      </FormControl>
                      <ErrorMessage
                        name={`wallboards[${index}].template_id`}
                        component="div"
                        className="error"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        fullWidth
                        // className="select_template"
                      >
                        {/* <InputLabel htmlFor={`network_type[${index}]`}>
          Network Type
        </InputLabel> */}
                        <Autocomplete
                          autoHighlight
                          options={themeData}
                          getOptionLabel={(option) => option.theme_name || ""}
                          key={(option) => option.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Theme"
                              variant="outlined"
                            />
                          )}
                          name={`wallboards[${index}].theme_name`}
                          value={
                            values.wallboards[index].theme_name
                              ? themeData.find(
                                  (option) =>
                                    option.hash_code ===
                                    // option.template_name ===
                                    values.wallboards[index].theme_name
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            setFieldValue(
                              `wallboards[${index}].theme_name`,
                              newValue ? newValue.hash_code : ""
                            );
                          }}
                          noOptionsText="No Results Found"
                        />
                      </FormControl>
                      <ErrorMessage
                        name={`wallboards[${index}].theme_name`}
                        component="div"
                        className="error"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        fullWidth
                        className="select_template"
                      >
                        {/* <InputLabel htmlFor={`network_type[${index}]`}>
          Network Type
        </InputLabel> */}
                        <Autocomplete
                          autoHighlight
                          options={network_Options}
                          getOptionLabel={(option) => option.network_type || ""}
                          key={(option) => option.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Edition Name"
                              variant="outlined"
                            />
                          )}
                          name={`wallboards[${index}].network_type`}
                          value={
                            values.wallboards[index].network_type
                              ? network_Options.find(
                                  (option) =>
                                    option.network_type ===
                                    values.wallboards[index].network_type
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            setFieldValue(
                              `wallboards[${index}].network_type`,
                              newValue ? newValue.network_type : ""
                            );
                          }}
                          noOptionsText="No Results Found"
                        />
                      </FormControl>
                      <ErrorMessage
                        name={`wallboards[${index}].network_type`}
                        component="div"
                        className="error"
                        style={{ color: "red" }}
                      />
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        fullWidth
                        className="select_template"
                      >
                        {/* <InputLabel htmlFor={`network_type[${index}]`}>
          Network Type
        </InputLabel> */}
                        <Autocomplete
                          autoHighlight
                          options={months}
                          getOptionLabel={(option) => option || ""}
                          key={(option) => option}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Month"
                              variant="outlined"
                            />
                          )}
                          name={`wallboards[${index}].month`}
                          value={
                            values.wallboards[index].month
                              ? months.find(
                                  (option) =>
                                    option ===
                                    values.wallboards[index].month
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            setFieldValue(
                              `wallboards[${index}].month`,
                              newValue ? newValue : ""
                            );
                          }}
                          noOptionsText="No Results Found"
                        />
                      </FormControl>
                      <ErrorMessage
                        name={`wallboards[${index}].month`}
                        component="div"
                        className="error"
                        style={{ color: "red" }}
                      />
                    </div>

                    {index > 0 && ( // Conditionally render the Remove button
                      <div>
                        <Button
                          size="small"
                          variant="contained"
                          style={{ background: "#C62828", marginBottom: 10 }}
                          startIcon={<MdOutlineRemoveCircle />}
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      style={{ background: "#15223F", marginBottom: 10 }}
                      startIcon={<IoMdAdd />}
                      onClick={() => {
                        // Check if all existing fields are filled before adding a new one
                        const allFieldsFilled = values.wallboards.every(
                          (wallboard) =>
                            wallboard.wallboardname &&
                            wallboard.template_id &&
                            wallboard.network_type &&
                            wallboard.theme_name
                        );

                        if (allFieldsFilled) {
                          push({
                            wallboardname: "",
                            template_id: "",
                            network_type: "",
                          });
                          setAddMore(false);
                        } else {
                          setAddMore(true);
                        }
                      }}
                    >
                      Add More
                    </Button>
                    {addMore && (
                      <FormHelperText style={{ marginBottom: "10px" }} error>
                        Please fill in all fields before adding more.
                      </FormHelperText>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FieldArray>
          <div style={{ textAlign: "center" }}>
            <Button
              size="large"
              variant="contained"
              style={{ background: "#C62828", marginRight: "10px" }}
              onClick={close}
            >
              Close
            </Button>
            <Button
              size="large"
              type="submit"
              variant="contained"
              style={{ background: "#1d213e", marginRight: "15px" }}
            >
              Submit
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default AddRemoveForm;
