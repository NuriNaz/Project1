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
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tab,
  Tabs,
  Typography,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useScriptRef from "hooks/useScriptRef";
import { BiSearchAlt2 } from "react-icons/bi";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// Components
import "./style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { MENU_OPEN } from "store/actions";
import { SelectWallboardFilterData } from "store/Data";
import Message from "components/Snackbar/Snackbar";

const StyledTableCell = styled(TableCell)({
  border: "1px solid black",
});

const SelectWallboard = ({ ...others }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [years, setYears] = useState([]);
  const [monthss, setMonths] = useState([]);
  const [next, setNext] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const scriptedRef = useScriptRef();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    setPage(1);
    if (FilterData && Object.keys(FilterData).length > 0) {
      await filterData(1, newValue);
    } else {
      await GetData(newValue, page);
    }
    // GetData(newValue);
  };

  const FilterData = useSelector(
    (state) => state.Data.SelectWallboardFilterDatas
  );
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    if (FilterData && Object.keys(FilterData).length > 0) {
      await filterData(newPage, value);
    } else {
      await GetData(value, newPage);
    }
  };

  const filterData = async (page, value) => {
    try {
      setIsLoading(true);
      const result = await Axios.post(
        `${API.Wallboard_Filter_API}?page=${page}`,
        {
          wallboard_id: FilterData.wallboard_id,
          screenType: value,
          month: FilterData.month,
        }
      );
      if (result.status === 200) {
        setIsLoading(false);
        setData(result.data.items);
        setShowData(result.data.items);
        setNext(result.data);
      }
    } catch (error) {
      console.log("Error", error);
      setNext(null);
      setShowData([]);
      setIsLoading(false);
      if (error.response.status === 500) {
        setSnackbar({
          open: true,
          message: error?.response?.data?.error,
          severity: "error",
        });
      }
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const arr = data.filter((item) => {
      if (value.length === 0) {
        return true;
      } else {
        return (
          item.wallboard_name?.toLowerCase().includes(value.toLowerCase()) ||
          item.version?.toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    setPage(1);
    setShowData(arr);
  };

  const GetData = async (data, page) => {
    const id = data;
    try {
      setTimeout(() => {
        setIsLoading(true);
      }, 200);
      const result = await Axios.post(
        `${API.Single_Listing_AI_Walboard}?page=${page}`,
        {
          approval_status: id === undefined || id === null ? 0 : id,
        }
      );
      if (result.status === 200) {
        setIsLoading(false);
        setData(result.data.listings);
        // setPage(0);
        setShowData(result.data.listings);
        setNext(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
    }
  };

  const serialNumber = (page, index) => {
    return (page - 1) * rowsPerPage + index + 1;
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
        setYears(response.data.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  const Get_Wallboard_Months = async (years) => {
    const year = parseInt(years);
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Wallboard_Versions_GetMonth, {
        year,
      });
      if (response.status === 200) {
        setIsLoading(false);
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

  const capitalizeFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };  

  useEffect(() => {
    GetData(0, page);
    dispatch(SelectWallboardFilterData(undefined));
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
      if (FilterData && Object.keys(FilterData).length > 0) {
        filterData(page);
      } else {
        GetData(value, page);
      }
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
              dispatch(SelectWallboardFilterData(data));
              const result = await Axios.post(
                `${API.Wallboard_Filter_API}?page=${page}`,
                data
              );
              if (result.status === 200) {
                setIsLoading(false);
                setData(result.data.items);
                setPage(1);
                setShowData(result.data.items);
                setNext(result.data);
              }
            }
          } catch (err) {
            console.error(err);
            setIsLoading(false);
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
                      getOptionLabel={(option) => capitalizeFirstLetter(option.wallboard_name) || ""}
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
                          {capitalizeFirstLetter(option.wallboard_name)}
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
                          setFieldValue(`month`, "");
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
                      getOptionLabel={(option) => capitalizeFirstLetter(option) || ""}
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
                      setPage(1);
                      GetData(value, 1);
                      dispatch(SelectWallboardFilterData(undefined));
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
                  showData.map((row, index) => (
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
                            variant="contained"
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
          {showData.length > 0 && next?.totalPageCount > 1 && (
            <Pagination
              count={next?.totalPageCount}
              defaultPage={1}
              page={page}
              onChange={handleChangePage}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              className="paging"
              sx={{
                button: { mt: 2 },
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            />
          )}
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
                  showData.map((row, index) => (
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
                            variant="contained"
                            style={{ background: "#15223F" }}
                            startIcon={<VisibilityIcon />}
                            onClick={() =>
                              navigate(`/selectwallboard/View-pdf/${row.id}`)
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

          {showData.length > 0 && next?.totalPageCount > 1 && (
            <Pagination
              count={next?.totalPageCount}
              defaultPage={1}
              page={page}
              onChange={handleChangePage}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              className="paging"
              sx={{
                button: { mt: 2 },
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            />
          )}
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
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                              variant="contained"
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
          {showData.length > 0 && next?.totalPageCount > 1 && (
            <Pagination
              count={next?.totalPageCount}
              defaultPage={1}
              page={page}
              onChange={handleChangePage}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              className="paging"
              sx={{
                button: { mt: 2 },
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            />
          )}
        </TabPanel>
      </TabContext>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default SelectWallboard;
