import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import "../../Wallboard Management/style.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { HiCursorClick } from "react-icons/hi";
import Popup from "components/Popup";
import useScriptRef from "hooks/useScriptRef";
import { useTheme } from "@mui/material/styles";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

const All_Manual_PDF = ({...others}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust the number of rows per page as needed
  const [selectTemplate, setSelectTemplate] = useState(false);
  const scriptedRef = useScriptRef();
  const navigate= useNavigate();
  const theme = useTheme();

  // Sample table data, replace this with your actual data
  const rows = [
    { id: 1, name: "Lorem ipsum dolor sit amet" },
    { id: 2, name: "consectetur adipiscing elit" },
    { id: 3, name: "sed do eiusmod tempor incididunt" },
    { id: 4, name: "ut labore et dolore magna aliqua" },
    { id: 5, name: "Ut enim ad minim veniam" },
    { id: 6, name: "quis nostrud exercitation ullamco" },
    // Add more rows as needed
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MainCard title="All Manual PDF">
      {/* Popup for Select Template */}
      <Popup
        open={selectTemplate}
        title="Select Template"
        content={
          <>
            <Formik
              initialValues={{
                select_Template: "",
                submit: null,
              }}
              validationSchema={Yup.object().shape({
                select_Template: Yup.string().required("Template is required"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
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
                    {/* Role Select */}
                    <FormControl
                    style={{ marginTop: 10 }}
                    fullWidth
                    error={Boolean(touched.select_Template && errors.select_Template)}
                  >
                    <InputLabel htmlFor="outlined-select_Template">Select Template</InputLabel>
                    <Select
                      id="outlined-select_Template"
                      label="Select Template"
                      value={values.select_Template} // Replace with your form's value for the role field
                      onChange={handleChange} // Replace with your form's change handler for the role field
                      name="select_Template" // Replace with the name of your role field
                      onBlur={handleBlur} // Handle onBlur event to set the field as touched
                      style={{ padding: "3px 0" }}
                    >
                      <MenuItem value="admin">Template 1</MenuItem>
                      <MenuItem value="user">Template 2</MenuItem>
                      <MenuItem value="viewer">Template 3</MenuItem>

                      {/* Add more roles as needed */}
                    </Select>

                    {touched.select_Template && errors.select_Template && (
                      <FormHelperText error>{errors.select_Template}</FormHelperText>
                    )}
                  </FormControl>

                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}

                  <Box sx={{ mt: 1 }} style={{ textAlign: "center" }}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ background: "#15223F" }}
                      >
                        Submit
                      </Button>
                      <Button
                        size="large"
                        variant="contained"
                        color="error"
                        // style={{ background: "#15223F" }}
                        style={{marginLeft:10}}
                        onClick={()=>setSelectTemplate(false)}
                      >
                        Close
                      </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </>
        }
      />

      <TableContainer component={Paper} style={{ border: "1px solid black" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center" }} className="headings">
                #
              </TableCell>
              <TableCell className="headings">All Manual PDF's</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{ textAlign: "center" }} className="common">
                    {row.id}
                  </TableCell>
                  <TableCell className="common">
                    {row.name}
                    <br />
                    {/* <p className="template">
                          Template 1
                          <span className="network-type">Nephrology</span>
                          <span className="month"> August</span>
              
                        </p> */}
                    <br />
                    <div className="allbuttons">
                      <Button
                        size="small"
                        // type="submit"
                        variant="contained"
                        // color="primary"
                        style={{ background: "#15223F" }}
                        startIcon={<HiCursorClick />}
                        onClick={() => setSelectTemplate(true)}
                      >
                        Select Template
                      </Button>
                      <Button
                        size="small"
                        // type="submit"
                        variant="contained"
                        // color="primary"
                        onClick={()=>navigate('/pdf-management/view-ai-pdf')}
                        style={{ background: "#15223F" }}
                        startIcon={<VisibilityIcon />} // Add Delete icon using startIcon
                      >
                        View AI PDF's
                      </Button>
                      {/* <Button
                                    size="small"
                                    // type="submit"
                                    variant="contained"
                                    // color="primary"
                                    style={{ background: "#15223F" }}
                                    startIcon={<FileCopyIcon />} // Add Copy icon using startIcon
                                >Copy</Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Customize the options as needed
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </MainCard>
  );
};

export default All_Manual_PDF;
