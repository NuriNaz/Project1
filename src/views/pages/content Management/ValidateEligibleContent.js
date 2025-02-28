// Libraries
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { CiImageOff } from "react-icons/ci";
import { Formik } from "formik";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  Pagination,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useScriptRef from "hooks/useScriptRef";
import { ImCross } from "react-icons/im";
import moment from "moment";

// Components
import MainCard from "ui-component/cards/MainCard";
import Axios from "api/Axios";
import { MENU_OPEN } from "store/actions";
import { API } from "api/API";
import Loading from "components/Loading";
import { useRef } from "react";
import "./style.css";
import { contentData } from "store/Data";
import Message from "components/Snackbar/Snackbar";

const ValidateEligibleContent = ({ ...others }) => {
  const [validateData, setValidateData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState(false);

  // Pagination settings
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const scriptedRef = useScriptRef();
  // const [category, setCategory]=useState('')
  const [subCategories, setSubCategories] = useState([]);
  const [next, setNext] = useState([]);
  const tagsContainerRef = useRef(null);
  const CategoryContainerRef = useRef(null);
  const searchFormRef = useRef(null);
  const [equalImageSize, setEqualImageSize] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const theme = useTheme();

  const dispatch = useDispatch();

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  // Table columns
  const columns = [
    { id: "s_no", label: "#" },
    { id: "title", label: "Title" },
    { id: "author_name", label: "KOL Name" },
    // { id: "author_bio", label: "Author Bio" },
    { id: "content", label: "Content" },
    { id: "category", label: "Category" },
    { id: "author_image", label: "KOL Image" },
    { id: "createdDate", label: "Created Date" },
    // { id: "actions", label: "Actions" },
  ];

  if (Details.role !== "3") {
    columns.push({ id: "actions", label: "Actions" });
  } else {
    // Set "actions" to null when Details.role is "3"
    const actionsIndex = columns.findIndex((column) => column.id === "actions");
    if (actionsIndex !== -1) {
      columns[actionsIndex] = { id: "actions", label: "Actions" };
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const LoadFirst = async () => {
    try {
      setSearchText(true);
      const data = {
        category_name: ["ICYMI"],
      };
      dispatch(contentData(data));
      setIsLoading(true);
      const result = await Axios.post(
        `${API.Validate_Filter}?page=${page}`,
        data
      );
      if (result.status === 200) {
        // const updateData = result.data.items.map((item) => {
        //   return {
        //     ...item,
        //     isShowItem: true,
        //   };
        // });
        setIsLoading(false);
        setValidateData(result?.data?.items);
        setShowData(result?.data?.items);
        // setShowData(updateData);
        setNext(result?.data);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const data = useSelector((state) => state.Data.contentData);
  const handleChangePage = async (event, newPage) => {
    try {
      setPage(newPage);
      if (data) {
        await handleData(newPage);
      } else {
        await validateContent(newPage);
      }
    } catch (error) {
      console.error("Error while changing page:", error);
    }
  };

  const handleData = async (page) => {
    setIsLoading(true);
    const result = await Axios.post(
      `${API.Validate_Filter}?page=${page}`,
      data
    );
    if (result.status === 200) {
      setIsLoading(false);
      setValidateData(result?.data?.items);
      setShowData(result?.data?.items);
      setNext(result?.data);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(true);
    const arr = validateData.filter((item) => {
      if (value.length === 0) {
        return true;
      } else {
        return (
          // item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title?.toLowerCase().includes(value.toLowerCase()) ||
          item.author_name?.toLowerCase().includes(value.toLowerCase()) ||
          // item.author_bio?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.body?.toLowerCase().includes(value.toLowerCase()) ||
          item.category?.toLowerCase().includes(value.toLowerCase())
          // item.author_img?.toLowerCase().includes(searchText.toLowerCase())
        );
      }
    });
    setPage(1);
    setShowData(arr);
  };

  const validateContent = async (page) => {
    try {
      setIsLoading(true);
      const result = await Axios.get(
        `${API.Get_Validate_Content}?page=${page}`
      );
      if (result.status === 200) {
        // setPage(page);
        setIsLoading(false);
        // console.log(result.data.data, "helo");
        setValidateData(result.data.data);
        setShowData(result.data.data);
        setNext(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
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

  const Year = ["2021", "2022", "2023", "2024"];
  const Filter = ["Approved", "Pending for Approval"];

  const serialNumber = (page, index) => {
    return (page - 1) * rowsPerPage + index + 1;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(API.Get_All_Filter_Category_Subcategory);
      if (response.status === 200) {
        setIsLoading(false);
        const removeDuplicates = response.data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.cc_name === item.cc_name)
        );
        setOptions(removeDuplicates);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "Error while getting Categories");
    }
  };

  const subCategory = async (category) => {
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_SubCategory, { category });
      if (response.status === 200) {
        setIsLoading(false);
        const removeDuplicates = response.data.subcategories.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.cc_name === item.cc_name)
        );
        // console.log(removeDuplicates, "helo");
        setSubCategories(response.data.subcategories);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "Error while getting Categories");
    }
  };

  const monthToString = (dateString) => {
    const monthNumber = moment(dateString, "YYYY-MM-DD HH:mm:ss").month();
    const monthString = moment(dateString)
      .month(monthNumber)
      .format("MM-DD-YYYY");
    return monthString;
  };

  const clear = async () => {
    await validateContent(1);
    await fetchData();
  };

  const fetchAllData = async () => {
    await LoadFirst();
    // await validateContent(1);
    await fetchData();
  };

  const removeHtmlTags = (htmlString) => {
    // Use a browser-based DOM parser to handle HTML parsing
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    const html = htmlString;
    return doc.body.textContent.slice(0, 30) || "";
  };

  const capitalizeFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };

  useEffect(() => {
    fetchAllData();
    // subCategory();
    // dispatch(contentData(undefined));
    dispatch({ type: MENU_OPEN, id: "validate-content" });
  }, []);

  return (
    <MainCard
      title="Validate Eligible Content"
      label="Search"
      handleSearch={handleSearch}
      searchBar="true"
      value={searchText}
    >
      {/* <ComingSoon /> */}
      <Formik
        style={{ marginBottom: 6 }}
        initialValues={{
          category: ["ICYMI"],
          year: "",
          month: "",
          subcategory: [],
          filter: "",
        }}
        validationSchema={Yup.object().shape({
          // category: Yup.string().required("Category  is required"),
          // year: Yup.mixed().required("Year  is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setSearchText(true);
            const data = {
              category_name:
                values.category.length === 0 ? undefined : values.category,
              month:
                values.month === "" || values.month === null
                  ? undefined
                  : values.month,
              year:
                values.year === "" || values.year === null
                  ? undefined
                  : values.year,
              subcategory_name:
                values.subcategory.length === 0
                  ? undefined
                  : values.subcategory.filter((item) => item.sc_name),
              content_approve: values.filter === "Approved" ? 1 : undefined,
            };
            if (
              data.month === undefined &&
              data.year === undefined &&
              data.category_name === undefined &&
              data.subcategory_name === undefined
            ) {
              setSnackbar({
                open: true,
                severity: "warning",
                message: "Please select at least one Input",
              });
            } else {
              dispatch(contentData(data));
              setIsLoading(true);
              const result = await Axios.post(
                `${API.Validate_Filter}?page=${page}`,
                data
              );
              if (result.status === 200) {
                setIsLoading(false);
                setValidateData(result?.data?.items);
                setShowData(result?.data?.items);
                setNext(result?.data);
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
            ref={searchFormRef}
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
                <Grid item xs={6} style={{ marginBottom: 3 }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      multiple
                      name="category"
                      options={options}
                      getOptionLabel={(option) =>
                        capitalizeFirstLetter(option.cc_name) || ""
                      }
                      key={(option) => option.sc_term_id}
                      value={values.category.map(
                        (cc_name) =>
                          options.find((item) => item.cc_name === cc_name) || ""
                      )}
                      // isOptionEqualToValue={(option, value) =>
                      //   option.cc_name === (value ? value.cc_name : "")
                      // }
                      isOptionEqualToValue={(option, value) =>
                        option.cc_name === value?.cc_name
                      }
                      renderOption={(prop, option) => (
                        <li {...prop}>
                          {capitalizeFirstLetter(option.cc_name)}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          variant="outlined"
                        />
                      )}
                      sx={{
                        maxHeight: "50px",
                      }}
                      renderTags={(value, getTagProps) => (
                        <div
                          ref={CategoryContainerRef}
                          className="chips"
                          style={{
                            display: "flex",
                            overflowX: "auto",
                            width: values.category.length >= 3 && "80%",
                          }}
                        >
                          {value.map((option, index) => (
                            <Chip
                              key={index}
                              style={{ marginTop: "0", fontSize: "12px" }}
                              label={
                                capitalizeFirstLetter(option?.cc_name) ||
                                "ICYMI"
                              }
                              {...getTagProps({ index })}
                            />
                          ))}
                        </div>
                      )}
                      onChange={(_, newValue) => {
                        if (newValue.length === 0) {
                          setFieldValue("subcategory", []);
                        }
                        setFieldValue(
                          "category",
                          newValue ? newValue.map((item) => item.cc_name) : []
                        );
                        // console.log(newValue, 'hello')
                        const category = newValue.map((item) => item.cc_name);
                        setFieldValue(
                          `subcategory`,
                          values.subcategory &&
                            values.subcategory.filter((item) =>
                              category.includes(item.ParentCategory)
                            )
                          // newValue ? newValue.map((item) => item.sc_name) : []
                        );

                        if (CategoryContainerRef.current) {
                          const scrollDistance =
                            CategoryContainerRef.current.scrollWidth;

                          setTimeout(() => {
                            CategoryContainerRef.current.scrollLeft =
                              scrollDistance;
                          }, 0);
                        }
                      }}
                      limitTags={2}
                      noOptionsText="No Results Found"
                    />

                    {touched.category && errors.category && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-category"
                      >
                        {errors.category}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Sub Category */}
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      multiple
                      disabled={values.category.length === 0 ? true : false}
                      name="subcategory"
                      options={subCategories}
                      getOptionLabel={(option) =>
                        capitalizeFirstLetter(option.sc_name) || ""
                      }
                      key={(option) => option.sc_term_id}
                      value={values.subcategory
                        .filter((item) => item !== undefined)
                        .map((scName) =>
                          subCategories.find(
                            (item) => item.sc_name === scName.sc_name
                          )
                        )}
                      isOptionEqualToValue={(option, value) => {
                        if (value && value.sc_name) {
                          return option.sc_name === value.sc_name;
                        }
                        return false;
                      }}
                      onFocus={() => subCategory(values.category)}
                      renderOption={(prop, option) => (
                        <li {...prop}>
                          {capitalizeFirstLetter(option.sc_name)}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sub Category"
                          variant="outlined"
                        />
                      )}
                      sx={{
                        maxHeight: "50px",
                        // zIndex: '20'
                      }}
                      // style={{display:'flex', flexDirection:'row-reverse'}}
                      renderTags={(value, getTagProps) => (
                        <div
                          ref={tagsContainerRef}
                          className="chips"
                          style={{
                            display: "flex",
                            overflowX: "auto",
                            width: values.subcategory.length >= 3 && "80%",
                          }}
                        >
                          {value
                            .filter((item) => item !== undefined)
                            .map((option, index) => (
                              <Chip
                                key={index}
                                style={{ marginTop: "0", fontSize: "12px" }}
                                label={capitalizeFirstLetter(option?.sc_name)}
                                {...getTagProps({ index })}
                              />
                            ))}
                        </div>
                      )}
                      onChange={(_, newValue) => {
                        console.log(newValue, "All SubCategories");
                        setFieldValue(
                          `subcategory`,
                          // newValue ? newValue.map((item) => item.sc_name) : []
                          newValue ? newValue.map((item) => item) : []
                          // newValue ? newValue.map((item) => item.sc_name) : []
                        );
                        if (tagsContainerRef.current) {
                          const scrollDistance =
                            tagsContainerRef.current.scrollWidth;

                          // Use setTimeout to ensure that the scroll happens after the DOM updates
                          setTimeout(() => {
                            tagsContainerRef.current.scrollLeft =
                              scrollDistance;
                          }, 0);
                        }
                      }}
                      // limitTags={true}
                      limitTags={2}
                      noOptionsText="No Results Found"
                    />
                    {touched.category && errors.category && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-category"
                      >
                        {errors.category}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Approved or Pending for Approval */}
                <Grid item style={{ marginTop: 9 }} xs={2}>
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.month && errors.month)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      options={Filter}
                      getOptionLabel={(option) => option || ""}
                      // key={(option) => option.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Content Type"
                          variant="outlined"
                        />
                      )}
                      name="filter"
                      value={values.filter}
                      onChange={(_, newValue) => {
                        setFieldValue(`filter`, newValue);
                      }}
                      noOptionsText="No Results Found"
                    />
                  </FormControl>
                </Grid>

                {/* Month */}
                <Grid item style={{ marginTop: 9 }} xs={2}>
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.month && errors.month)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      options={months}
                      getOptionLabel={(option) => option || ""}
                      // key={(option) => option.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Month"
                          variant="outlined"
                        />
                      )}
                      name="month"
                      value={values.month}
                      onChange={(_, newValue) => {
                        setFieldValue(`month`, newValue);
                      }}
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

                {/* Year */}
                <Grid item style={{ marginTop: 9 }} xs={2}>
                  <FormControl
                    fullWidth
                    // error={Boolean(touched.year && errors.year)}
                    // sx={{ ...theme.typography.customInput }}
                  >
                    <Autocomplete
                      autoHighlight
                      options={Year}
                      getOptionLabel={(option) => option || ""}
                      // key={(option) => option.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Year"
                          variant="outlined"
                        />
                      )}
                      name="year"
                      value={values.year}
                      onChange={(_, newValue) => {
                        setFieldValue(`year`, newValue);
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

                {/* Button */}
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginTop: 9,
                  }}
                >
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
                      setPage(1);
                      dispatch(contentData(undefined));
                      resetForm();
                      setFieldValue(`category`, []);
                      clear();
                      // fetchAllData();
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

      <TableContainer component={Paper} style={{ border: "1px solid #364152" }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#364152" }}>
              {columns.map((column) => (
                <TableCell style={{ color: "#fff" }} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {showData && !isLoading && showData.length > 0 ? (
              showData
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={item.id}
                    style={{
                      background:
                        item.title === "" ||
                        item.title === undefined ||
                        item.title === null ||
                        // item.author_name === "" ||
                        // item.author_bio === "" ||
                        item.body === "" ||
                        item.body === undefined ||
                        item.body === null ||
                        removeHtmlTags(item?.body) === " " ||
                        removeHtmlTags(item?.body) === "" ||
                        item.category === "" ||
                        item.category === undefined ||
                        item.category === null
                          ? // ||item.author_img === ""
                            "#FFAB91"
                          : "unset",
                    }}
                  >
                    <TableCell>{serialNumber(page, index)}</TableCell>
                    <TableCell>
                      {item.title === "" ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        item.title
                      )}
                    </TableCell>
                    <TableCell>
                      {item.author_name === "" ||
                      item.author_name === null ||
                      item.author_name === undefined ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        item.author_name
                      )}
                      {/* {item?.author_name} */}
                    </TableCell>
                    {/* <TableCell>
                      {item.author_bio === "" ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        item.author_bio
                      )}
                    </TableCell> */}
                    <TableCell>
                      {removeHtmlTags(item?.body) === " " ||
                      removeHtmlTags(item?.body) === "" ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        removeHtmlTags(item?.body)
                      )}
                    </TableCell>
                    <TableCell>
                      {item.category === "" ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        item.category
                      )}
                    </TableCell>
                    <TableCell id="AllImages">
                      {/* <img src={item.author_img} alt='author' style={{width:'30px', height:'30px'}} /> */}
                      {item.check_status === false && (
                        <>
                          <img
                            src={`https://www.physiciansweekly.com/wp-content/uploads/${item.author_img}`}
                            alt="author"
                            id="uniquepw"
                            style={{
                              width: "30px",
                              height: "30px",
                              display:
                                item?.dimensions?.width !== 69 &&
                                item?.dimensions?.height !== 70
                                  ? "none"
                                  : "block",
                            }}
                            // onLoad={(event) =>
                            //   handleImageLoad1(event, item?.id)
                            // }
                          />
                          {item?.dimensions?.width !== 69 &&
                            item?.dimensions?.height !== 70 && (
                              <CiImageOff
                                fontSize="30px"
                                style={{ color: "#364152" }}
                              />
                            )}
                        </>
                      )}
                      {item.check_status === true && (
                        <>
                          <img
                            // src={item.author_img}
                            src={item.author_img}
                            alt="author"
                            id="author"
                            style={{
                              width: "30px",
                              height: "30px",
                              display:
                                item?.dimensions?.width !== 69 &&
                                item?.dimensions?.height !== 70
                                  ? "none"
                                  : "block",
                            }}
                            // onLoad={handleImageLoad}
                            // onLoad={(event) =>
                            //   handleImageLoad(event, item?.id)
                            // }
                          />
                          {item?.dimensions?.width !== 69 &&
                            item?.dimensions?.height !== 70 && (
                              <CiImageOff
                                fontSize="30px"
                                style={{ color: "#364152" }}
                              />
                            )}
                        </>
                      )}

                      {item.check_status === "undefined" && (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      )}
                    </TableCell>
                    <TableCell style={{ padding: 0 }}>
                      {item?.date_created === "" ? (
                        <ImCross style={{ fontSize: 10, color: "#C62828" }} />
                      ) : (
                        monthToString(item?.date_created)
                      )}
                    </TableCell>
                    {Details.role !== "3" ? (
                      <TableCell>
                        <Link
                          style={{ textDecoration: "none", color: "#364152" }}
                          to={`/contentmanagement/add-missing-content/${item.id}`}
                        >
                          <FaEdit style={{ fontSize: 18, cursor: "pointer" }} />
                        </Link>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell style={{ textAlign: "center" }} colSpan={9}>
                  Record Not Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={showData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}

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
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
    </MainCard>
  );
};

export default ValidateEligibleContent;
