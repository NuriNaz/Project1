// Libraries
import React, { useState, useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TabContext, TabPanel } from "@mui/lab";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik } from "formik";

// Components
import "./style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import useScriptRef from "hooks/useScriptRef";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import Message from "components/Snackbar/Snackbar";

const StyledTableCell = styled(TableCell)({
  border: "1px solid black", // Add your border style here
});

const SelectWallboard = ({ ...others }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [years, setYears] = useState([]);
  const [monthss, setMonths] = useState([]);

  const [validateData, setValidateData] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const location = useLocation();
  const dispatch = useDispatch();
  const scriptedRef = useScriptRef();
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    GetData(newValue);
  };

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const arr = data.filter((item) => {
      if (value.length === 0) {
        return true;
      } else {
        return (
          // item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.wallboard_name?.toLowerCase().includes(value.toLowerCase()) ||
          item.version?.toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    setPage(0);
    setShowData(arr);
  };

  const GetData = async (data) => {
    const id = data;
    try {
      setTimeout(() => {
        setIsLoading(true);
      }, 200);
      const result = await Axios.post(API.Single_Listing_AI_Walboard, {
        approval_status: id === undefined || id === null ? 0 : id,
      });
      if (result.status === 200) {
        setIsLoading(false);
        setData(result.data);
        setPage(0);
        setShowData(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
    }
  };

  const serialNumber = (page, index) => {
    return page * rowsPerPage + index + 1;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(API.Wallboard_Version_List);
      if (response.status === 200) {
        setIsLoading(false);
        setOptions(response.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "Error while getting Categories");
    }
  };

  const Get_Wallboard_Years = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(API.Wallboard_Versions_GetYear);
      if (response.status === 200) {
        // console.log(response.data, "hello Data");
        setYears(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  const Get_Wallboard_Months = async (years) => {
    const year = parseInt(years);
    // console.log(year, "hello ");
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Wallboard_Versions_GetMonth, {
        year,
      });
      if (response.status === 200) {
        setIsLoading(false);
        // console.log(response.data, "hello Data");
        setMonths(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  // Define an array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const Year = ["2021", "2022", "2023"];

  const monthToString = (dateString) => {
    const monthString = moment(dateString).format("MMMM");
    return monthString;
  };

  useEffect(() => {
    GetData();
    fetchData();
    Get_Wallboard_Years();
    const pathToValue = {
      "/selectwallboard/pending": 0,
      "/selectwallboard/approved": 1,
      "/selectwallboard/disapproved": 2,
    };
    dispatch({ type: MENU_OPEN, id: "selectwallboard" });
    const value = pathToValue[location.pathname];
    if (value) {
      setValue(value);
      GetData(value);
    }
  }, []);

  return (
    <MainCard
      title="Wallboard Components"
      label="Search"
      searchBar="true"
      value={searchText}
      handleSearch={handleSearch}
    >
      {/* <PDFViewer pdfUrl={pdfUrl} /> */}

      <Formik
        style={{ marginBottom: 6 }}
        initialValues={{
          wallboard_id: "",
          month: "",
          year: "",
        }}
        validationSchema={Yup.object().shape({
          // category: Yup.string().required("Category  is required"),
          // year: Yup.mixed().required("Year  is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const data = {
              month:
                values.month === "" || values.month === null
                  ? undefined
                  : values.month,
              wallboard_id:
                values.wallboard_id === "" || values.wallboard_id === null
                  ? undefined
                  : values.wallboard_id,
              year:
                values.year === "" || values.year === null
                  ? undefined
                  : values.year,
              screenType: value,
            };
            if (
              data.month === undefined &&
              data.wallboard_id === undefined &&
              data.year === undefined
            ) {
              setSnackbar({
                open: true,
                severity: "warning",
                message: "Please select at least one Input",
              });
            } else {
              setIsLoading(true);
              const result = await Axios.post(API.Wallboard_Filter_API, data);
              if (result.status === 200) {
                setIsLoading(false);
                setData(result.data.items);
                setPage(0);
                setShowData(result.data.items);
              }
            }
          } catch (err) {
            console.error(err);
            setIsLoading(false);
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
          setFieldValue,
          setYear,
          resetForm,
          values,
        }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            {...others}
            autoComplete="off"
          >
            <div className="xyz">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                sx={{ alignItems: "center", marginBottom: 5 }}
              >
                <Grid item xs={1}>
                  <Typography variant="subtitle1">Filter by:</Typography>
                </Grid>
                {/* Select Wallboard Name */}
                <Grid item xs={3}>
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.category && errors.category)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      name="wallboard_id"
                      options={options}
                      getOptionLabel={(option) => option.wallboard_name || ""}
                      key={(option) => option._id}
                      onChange={(_, newValue) => {
                        setFieldValue(
                          `wallboard_id`,
                          newValue ? newValue._id : ""
                        );
                      }}
                      value={
                        values.wallboard_id
                          ? options.find(
                              (item) => item._id === values.wallboard_id
                            )
                          : null
                      }
                      isOptionEqualToValue={
                        (option, value) => option._id === value.wallboard_id
                        // {console.log(option,value,  "in")}
                      }
                      onInputChange={options.wallboard_name}
                      // getOptionSelected={(option, value) =>
                      //   option.id === value.id
                      // }
                      onFocus={fetchData}
                      renderOption={(prop, option) => (
                        <li key={option._id} {...prop}>
                          {option.wallboard_name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Wallboard Name"
                          variant="outlined"
                        />
                      )}
                      // value={values.category}

                      // limitTags={false}
                      noOptionsText="No Results Found"
                    />
                    {touched.wallboard_id && errors.wallboard_id && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-category"
                      >
                        {errors.wallboard_id}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Select Year */}
                <Grid item xs={2}>
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.year && errors.year)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      // options={years.length === 0 ? Year : years}
                      options={years || []}
                      getOptionLabel={(option) => option || ""}
                      // key={(option) => option.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Year"
                          variant="outlined"
                        />
                      )}
                      name="year"
                      // value={values.year}
                      value={
                        values.year
                          ? years.find((item) => item === values.year)
                          : null
                      }
                      onChange={(_, newValue) => {
                        if (newValue?.length === 0 || newValue === null) {
                          setFieldValue(`month`, []);
                        }
                        setFieldValue(`year`, newValue ? newValue : []);
                        // setFieldValue(`year`, newValue);
                      }}
                      noOptionsText="No Results Found"
                    />
                    {touched.year && errors.year && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-year"
                      >
                        {errors.year}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Select Month */}
                <Grid item xs={2}>
                  {/* Filter */}
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.month && errors.month)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      disabled={
                        values?.year?.length === 0 || values?.year === null
                          ? true
                          : false
                      }
                      options={monthss || ""}
                      // options={monthss.length === 0 ? months : monthss}
                      getOptionLabel={(option) => option || ""}
                      // key={(option) => option.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Month"
                          variant="outlined"
                        />
                      )}
                      name="month"
                      value={values.month}
                      onChange={(_, newValue) => {
                        setFieldValue(`month`, newValue);
                      }}
                      onFocus={() => Get_Wallboard_Months(values.year)}
                      noOptionsText="No Results Found"
                    />
                    {/* {touched.month && errors.month && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-month"
                    >
                      {errors.month}
                    </FormHelperText>
                  )} */}
                  </FormControl>
                </Grid>

                {/* Buttons */}
                <Grid item xs={2} style={{ display: "flex", gap: "10px" }}>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    style={{
                      background: "#15223F",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      color: isSubmitting && "white",
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    style={{
                      background: "#C62828",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      color: isSubmitting && "white",
                    }}
                    onClick={() => {
                      resetForm();
                      setFieldValue("year", "");
                      GetData(value);
                    }}
                  >
                    Clear
                  </Button>
                </Grid>
               
              </Grid>
            </div>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
          </form>
        )}
      </Formik>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor={"#15223F"}
          textColor="#15223F"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#15223F", 
            },
          }}
        >
          <Tab
            label="Pending"
            className="selectedTab"
            value={0}
            component={Link}
            to="/selectwallboard/pending"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", 
              },
            }}
            onClick={GetData}
          />
          <Tab
            label="Approved"
            className="selectedTab"
            value={1}
            component={Link}
            to="/selectwallboard/approved"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", 
              },
            }}
            onClick={GetData}
          />
          <Tab
            label="Disapproved"
            className="selectedTab"
            value={2}
            component={Link}
            to="/selectwallboard/disapproved"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", 
              },
            }}
            onClick={GetData}
          />
        </Tabs>
        <TabPanel value={0}>
          <TableContainer
            component={Paper}
            style={{ border: "1px solid black" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ textAlign: "center" }}
                    className="headings"
                  >
                    #
                  </TableCell>
                  <TableCell className="headings">
                    Pending Wallboard Versions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showData && showData.length > 0 ? (
                  showData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{ textAlign: "center" }}
                          className="common"
                        >
                          {serialNumber(page, index)}
                        </TableCell>
                        <TableCell className="common">
                          {row.wallboard_name}
                          <br />
                          <p className="template">
                            {/* Template 1 */}
                            {row?.parent_template_name}
                            <span className="network-type">
                              {/* Nephrology */}
                              {row?.network_type}
                            </span>
                            <span className="month"> {row.version}</span>
                            <span className="month">
                              {" "}
                              {monthToString(row?.date)}
                            </span>
                          </p>
                          <div className="allbuttons">
                           
                            <Button
                              size="small"
                              // type="submit"
                              variant="contained"
                              // color="primary"
                              style={{ background: "#15223F" }}
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(
                                  `/selectwallboard/view-version/${row.id}`
                                )
                              }
                            >
                              View {row.version}
                            </Button>
                          
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }} colSpan={2}>
                      Record Not Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Customize the options as needed
            component="div"
            count={showData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
        <TabPanel value={1}>
          <TableContainer
            component={Paper}
            style={{ border: "1px solid black" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ textAlign: "center" }}
                    className="headings"
                  >
                    #
                  </TableCell>
                  <TableCell className="headings">
                    Approved Wallboard Versions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                {showData && showData.length > 0 ? (
                  showData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{ textAlign: "center" }}
                          className="common"
                        >
                          {serialNumber(page, index)}
                        </TableCell>
                        <TableCell className="common">
                          {row.wallboard_name}
                          <br />
                          <p className="template">
                            {/* Template 1 */}
                            {row?.parent_template_name}
                            <span className="network-type">
                              {/* Nephrology */}
                              {row?.network_type}
                            </span>
                            <span className="month"> {row.version}</span>
                            <span className="month">
                              {" "}
                              {monthToString(row?.date)}
                            </span>
                          </p>

                          <div className="allbuttons">
                            <Button
                              size="small"
                              // type="submit"
                              variant="contained"
                              // color="primary"
                              style={{ background: "#15223F" }}
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(
                                  `/selectwallboard/View-pdf/${row.id}`

                                  // `/selectwallboard/view-version/${row.id}`
                                )
                              }
                            >
                              View {row.version}
                            </Button>
                          
                            <div className="approved">
                              <p>Approved</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }} colSpan={2}>
                      Record Not Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Customize the options as needed
            component="div"
            count={showData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
        <TabPanel value={2}>
          <TableContainer
            component={Paper}
            style={{ border: "1px solid black" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ textAlign: "center" }}
                    className="headings"
                  >
                    #
                  </TableCell>
                  <TableCell className="headings">
                    Disapproved Wallboard Versions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showData && showData.length > 0 ? (
                  showData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{ textAlign: "center" }}
                          className="common"
                        >
                          {serialNumber(page, index)}
                        </TableCell>
                        <TableCell className="common">
                          {row.wallboard_name}
                          <br />
                          <p className="template">
                            {/* Template 1 */}
                            {row?.parent_template_name}
                            <span className="network-type">
                              {/* Nephrology */}
                              {row?.network_type}
                            </span>
                            <span className="month"> {row?.version}</span>
                            <span className="month">
                              {" "}
                              {monthToString(row?.date)}
                            </span>
                          </p>
                          <div className="allbuttons">
                           
                            <Button
                              size="small"
                              // type="submit"
                              variant="contained"
                              // color="primary"
                              style={{ background: "#15223F" }}
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(
                                  // `/selectwallboard/View-pdf/${row.id}`
                                  `/selectwallboard/view-version/${row.id}`
                                )
                              }
                            >
                              View {row.version}
                            </Button>
                           
                          </div>
                          <div className="disapproved">
                            <p>Disapproved</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }} colSpan={2}>
                      Record Not Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Customize the options as needed
            component="div"
            count={showData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
      </TabContext>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default SelectWallboard;
