// Libraries
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  InputAdornment,
  Grid,
  Checkbox,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  Pagination,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { TbTablePlus } from "react-icons/tb";
import {
  MdCreateNewFolder,
  MdContentCopy,
  MdOutlineDelete,
} from "react-icons/md";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

// Components
import MainCard from "ui-component/cards/MainCard";
import "../style.css";
import Popup from "components/Popup";
import AddRemoveForm from "./DynamicFieldsForm";
import Message from "components/Snackbar/Snackbar";
import { API } from "api/API";
import Axios from "api/Axios";
import Loading from "components/Loading";
import { MENU_OPEN } from "store/actions";
import useScriptRef from "hooks/useScriptRef";
import { BiSearchAlt2 } from "react-icons/bi";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { CreateWallboardFilterData } from "store/Data";

const CreateWallboard = ({ ...others }) => {
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [getAllWallboards, setAllWallboards] = useState([]);
  const [showData, setShowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [years, setYears] = useState([]);
  const [monthss, setMonths] = useState([]);
  const [next, setNext] = useState();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = getAllWallboards.map((n) => n.parent_wallboard_id);
      const DelteSelected = getAllWallboards.map((n) => n.wallboard_id);
      setSelected(newSelected);
      setDeleteSelected(DelteSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id, deleteId) => {
    const selectedIndex = selected.indexOf(id);
    const deleteIndex = deleteSelected.indexOf(deleteId);
    let newSelected = [];
    let newDeleted = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newDeleted = newDeleted.concat(deleteSelected, deleteId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newDeleted = newDeleted.concat(deleteSelected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newDeleted = newDeleted.concat(deleteSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newDeleted = newDeleted.concat(
        deleteSelected.slice(0, selectedIndex),
        deleteSelected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setDeleteSelected(newDeleted);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const FilterData = useSelector((state) => state.Data.WallboardFilterData);
  const handleChangePage = async (event, newPage) => {
    try {
      setPage(newPage);
      // console.log(FilterData, "filterDat")
      if (FilterData && Object.keys(FilterData).length > 0) {
        await filterData(newPage);
      } else {
        await Get_All_Wallboards(newPage);
      }
    } catch (error) {
      console.log("Error in Pagination", error);
    }
  };

  const filterData = async (page) => {
    try {
      setIsLoading(true);
      const result = await Axios.post(
        `${API.Filter_Create_Wallboard}?page=${page}`,
        FilterData
      );
      if (result.status === 200) {
        setIsLoading(false);
        setAllWallboards(result.data.items);
        setShowData(result.data.items);
        setNext(result.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const arr = getAllWallboards.filter((item) => {
      if (value.length === 0) {
        return true;
      } else {
        return (
          // item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.wallboardname?.toLowerCase().includes(value.toLowerCase()) ||
          item?.template_name?.template_name
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.network_type?.toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    setPage(1);
    setShowData(arr);
  };

  const wallboardCreation = () => {
    setOpen(true);
  };

  // Get All Wallboards API
  const Get_All_Wallboards = async (page) => {
    try {
      setIsLoading(true);
      const response = await Axios.get(
        `${API.Get_All_Wallboards}?page=${page}`
      );
      if (response.status === 200) {
        // console.log(response.data, "response");
        setAllWallboards(response.data.wallboards);
        // setPage(0);
        // setPage(page)
        setShowData(response.data.wallboards);
        setNext(response?.data);
        const createStatus = response.data.wallboards;
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      if (err.response.status === 404) {
        setShowData([]);
      }
      setIsLoading(false);
    }
  };

  const Get_Wallboard_Years = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(API.Wallboard_Existing_years);
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
      const response = await Axios.post(API.Wallboard_YearsTo_Months, { year });
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

  const serialNumber = (page, index) => {
    return (page - 1) * rowsPerPage + index + 1;
  };

  const monthToString = (dateString) => {
    const monthNumber = moment(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ").month();
    const monthString = moment().month(monthNumber).format("MMMM");
    return monthString;
  };

  // Copy Wallboard API
  const copyWallboard = async (wallboard_id) => {
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Copy_Wallboard, {
        wallboard_id,
      });
      if (response.status === 201) {
        setIsLoading(false);
        Get_All_Wallboards(page);
        setSnackbar({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  // Multiple Copy and Delete Wallboard API
  const Multiple_CopyOrDelete = async (type) => {
    try {
      setIsLoading(true);
      const url =
        type === "copy"
          ? API.Copy_Multiple_Wallboard
          : API.Delete_Multiple_Wallboard;
      const payload = type === "copy" ? selected : deleteSelected;
      // console.log("palod",payload)
      const response = await Axios.post(url, { wallboardIds: payload });
      if (response.status === 200) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          severity: "success",
          message: type === "copy" ? response.data.message : response.data.msg,
        });
        setSelected([]);
        Get_All_Wallboards(page);
      }
    } catch (error) {
      setIsLoading(false);
      // console.log(
      //   error,
      //   type === "copy"
      //     ? `Error while copying ${selected} wallboards`
      //     : `Error while deleting ${selected} wallboards`
      // );
      if (error.response.status === 400) {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.resposne.data,
        });
      }
    }
  };

  // Create AI Wallboard
  const createAIWallboard = async (wallboard_id, template_id) => {
    try {
      setIsLoading(true);
      const response = await Axios.post(API.CreateAI_Wallboard, {
        wallboard_id,
        template_id,
      });
      if (response.status === 200) {
        Get_All_Wallboards(page);
        setIsLoading(false);
        setSnackbar({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response.data.error,
      });
    }
  };

  // Delete Wallboard API
  const delete_Wallboard = async (wallboard_id) => {
    // console.log(wallboard_id, "id");
    try {
      setIsLoading(true);
      const response = await Axios.delete(
        `${API.Delete_Wallboard}/${wallboard_id}`
      );
      if (response.status === 200) {
        // console.log(response, "hi response");
        setIsLoading(false);
        setSnackbar({
          open: true,
          severity: "success",
          message: response.data.msg,
        });
        Get_All_Wallboards(page);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      if (err.response.status === 404) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          severity: "error",
          message: err.response.data.msg,
        });
      }
    }
  };

  const Year = ["2021", "2022", "2023"];

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

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  useEffect(() => {
    Get_All_Wallboards(page);
    Get_Wallboard_Years();
    dispatch({ type: MENU_OPEN, id: "createwallboard" });
  }, []);

  return (
    <MainCard
      title="Create Wallboard"
      label="Search"
      // handleSearch
      searchBar="true"
      value={searchText}
      handleSearch={handleSearch}
    >
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
              year:
                values.year === "" || values.year === null
                  ? undefined
                  : values.year,
            };
            if (data.month === undefined && data.year === undefined) {
              setSnackbar({
                open: true,
                severity: "warning",
                message: "Please select Year and Month",
              });
            } else {
              dispatch(CreateWallboardFilterData(data));
              setIsLoading(true);
              const result = await Axios.post(
                API.Filter_Create_Wallboard,
                data
              );
              if (result.status === 200) {
                setIsLoading(false);
                setAllWallboards(result.data.items);
                setPage(1);
                setNext(result.data);
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
                      options={monthss || []}
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
                      value={
                        values.month
                          ? monthss.find((item) => item === values.month)
                          : null
                      }
                      // value={values.month}
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
                      Get_All_Wallboards(1);
                      dispatch(CreateWallboardFilterData(undefined));
                    }}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </div>

            {/* {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )} */}
          </form>
        )}
      </Formik>

      {selected.length !== 0 && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          Multiple_CopyOrDelete={Multiple_CopyOrDelete}
        />
      )}
      {Details.role !== "3" ? (
        <Button
          size="medium"
          variant="contained"
          style={{ background: "#15223F", marginBottom: 10 }}
          startIcon={<TbTablePlus />}
          onClick={wallboardCreation}
        >
          Create Wallboard
        </Button>
      ) : null}

      <Popup
        title="Create Wallboard"
        open={open}
        overflowY="auto"
        height="515px"
        content={
          <>
            <AddRemoveForm
              close={() => setOpen(false)}
              setSnackbar={setSnackbar}
              Get_All_Wallboards={Get_All_Wallboards}
              setIsLoading={setIsLoading}
              page={page}
            />
            {/* <DynamicFieldsForm /> */}
          </>
        }
      />

      <TableContainer component={Paper} style={{ border: "1px solid black" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center" }} className="headings">
                {Details.role !== "3" ? (
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < getAllWallboards.length
                    }
                    checked={
                      getAllWallboards.length > 0 &&
                      selected.length === getAllWallboards.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all",
                    }}
                  />
                ) : (
                  "#"
                )}
              </TableCell>
              <TableCell className="headings">Wallboard Components</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showData && showData.length > 0 ? (
              showData
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  const isItemSelected = isSelected(item.parent_wallboard_id);
                  return (
                    <TableRow key={index}>
                      <TableCell
                        style={{ textAlign: "center" }}
                        // className="common"
                        padding="checkbox"
                      >
                        {/* {serialNumber(page, index)} */}
                        {Details.role !== "3" ? (
                          <Checkbox
                            color="primary"
                            onClick={(event) =>
                              handleClick(
                                event,
                                item.parent_wallboard_id,
                                item.wallboard_id
                              )
                            }
                            checked={isItemSelected}
                          />
                        ) : (
                          <>{serialNumber(page, index)}</>
                        )}
                      </TableCell>
                      <TableCell className="common">
                        {item?.wallboardname}
                        <br />
                        <p className="template">
                          {/* Template 1 */}
                          {item?.template_name?.template_name}
                          <span className="network-type">
                            {item?.network_type}
                          </span>
                          <span className="month">
                            {item?.month}
                            {/* {item?.created_at === undefined
                              ? null
                              : monthToString(item?.created_at)} */}
                          </span>
                        </p>
                        <div className="allbuttons components">
                          {Details.role !== "3" ? (
                            <>
                              {item?.create_Status === "1" ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  style={{
                                    background: "#15223F",
                                    padding: Details?.role
                                      ? "4px 20px"
                                      : "0px 15px",
                                  }}
                                  startIcon={<VisibilityIcon />}
                                  onClick={() =>
                                    // navigate(`/selectwallboard/view-ai-wallboard/${item.wallboard_id}`)
                                    navigate("/selectwallboard/pending")
                                  }
                                >
                                  View Versions
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  variant="contained"
                                  style={{
                                    background: "#15223F",
                                    padding: Details?.role
                                      ? "4px 15px"
                                      : "0px 15px",
                                  }}
                                  startIcon={<MdCreateNewFolder />}
                                  onClick={async () => {
                                    await createAIWallboard(
                                      item.wallboard_id,
                                      item.template_id
                                    );
                                  }}
                                >
                                  Create Versions
                                </Button>
                              )}
                            </>
                          ) : (
                            <>
                              {/* {item?.create_Status === "1" && ( */}
                              <Button
                                size="small"
                                variant="contained"
                                style={{
                                  background: "#15223F",
                                  padding: Details?.role
                                    ? "4px 15px"
                                    : "0px 15px",
                                }}
                                startIcon={<VisibilityIcon />}
                                onClick={() =>
                                  // navigate(`/selectwallboard/view-ai-wallboard/${item.wallboard_id}`)
                                  navigate("/selectwallboard/pending")
                                }
                              >
                                View Versions
                              </Button>
                              {/* )} */}
                            </>
                          )}

                          {Details.role !== "3" && (
                            <>
                              <Button
                                size="small"
                                // type="submit"
                                variant="contained"
                                // color="primary"
                                style={{ background: "#15223F" }}
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                  delete_Wallboard(item.wallboard_id);
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                size="small"
                                // type="submit"
                                variant="contained"
                                // color="primary"
                                onClick={() =>
                                  copyWallboard(item.parent_wallboard_id)
                                }
                                style={{ background: "#15223F" }}
                                startIcon={<FileCopyIcon />} // Add Copy icon using startIcon
                              >
                                Copy
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
    </MainCard>
  );
};

export default CreateWallboard;

function EnhancedTableToolbar({ numSelected, Multiple_CopyOrDelete }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        mb: 2,
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        ""
      )}

      {numSelected > 0 ? (
        <Tooltip title="Copy">
          <IconButton onClick={() => Multiple_CopyOrDelete("copy")}>
            <MdContentCopy />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => Multiple_CopyOrDelete("delete")}>
            <MdOutlineDelete />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
}
