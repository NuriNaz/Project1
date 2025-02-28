import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MdEmail } from "react-icons/md";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import MainCard from "ui-component/cards/MainCard";
import "../../Wallboard Management/style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";
import Popup from "components/Popup";

const StyledTableCell = styled(TableCell)({
  border: "1px solid black", // Add your border style here
});

const GeneratePDF = () => {
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [error, setError] = useState({ email: "" });
  const [value, setValue] = useState("0");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust the number of rows per page as needed
  const [emailData, setEmailData] = useState({ id: "", link: "" });
  const [tags, setTags] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });
  const [inputValue, setInputValue] = useState("");

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    GetData(newValue);
  };

  const navigate = useNavigate();
  // Sample table data, replace this with your actual data
  const rows = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    // Add more rows as needed
  ];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelected = data.map((n) => n.id);
      const newSelected = data.map((n) => {
        return {
          id: n.id,
          pdfLink: n.pdf_ai,
        };
      }); // Replace 'id' with your unique identifier
      // console.log(newSelected, 'hi data')

      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, data) => {
    const id = data.id;
    // const selectedIndex = selected.indexOf(id);
    const selectedIndex = selected.findIndex((item) =>
      Object.values(item).includes(id)
    );
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, data);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSelected = (id) => {
    const index = selected.findIndex((item) =>
      Object.values(item).includes(id)
    );
    if (index !== -1) return true;
    else return false;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetData = async (id) => {
    try {
      setTimeout(() => {
        setIsLoading(true);
      }, 200);
      const result = await Axios.post(API.Pending_PDF, {
        approval_status: id === undefined ? "0" : id,
      });
      if (result.status === 200) {
        setIsLoading(false);
        setData(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tags.length === 0 && inputValue === "") {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please Enter the Email",
      });
    } else if (tags.length !== 0 && inputValue === "") {
      await SendEmail();
    } else {
      if (isValidEmail(inputValue)) {
        tags.push(inputValue);
        setInputValue("");
        await SendEmail();
      }
    }
  };

  const SendEmail = async () => {
    // console.log("hello", selected)
    const payload = {
      emails: tags,
      atttachments: selected,
    };
    try {
      setIsLoading(true);
      const result = await Axios.post(API.Send_Email, payload);
      if (result.status === 200) {
        setIsLoading(false);
        setPopupOpen(false);
        setSnackbar({
          open: true,
          severity: "success",
          message: result.data.message,
        });
        setSelected([]);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
    }
  };

  const serialNumber = (page, index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleTagsChange = (tags, name) => {
    if (name === "emails") {
      setTags(tags);
    }
  };

  const isValidEmail = (inputValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputValue)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `${inputValue} is not a valid email address`,
      });

      return false;
    }
    return true;
  };

  const MultipleEmail = () => {
    setPopupOpen(true);
  };

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  useEffect(() => {
    GetData();
    const pathToValue = {
      "/pdf-management/pending": "0",
      "/pdf-management/approved": "1",
      "/pdf-management/disapproved": "2",
    };
    const value = pathToValue[location.pathname];
    if (value) {
      setValue(value);
      GetData(value);
    }
  }, []);

  // const pdfUrl = 'https://www.africau.edu/images/default/sample.pdf'; // Replace with your API endpoint

  return (
    <MainCard title="Manage PDF">
      {/* <PDFViewer pdfUrl={pdfUrl} /> */}
      {selected.length !== 0 && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          MultipleEmail={MultipleEmail}
        />
      )}
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor={"#15223F"}
          textColor="#15223F"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#15223F", // Replace with your desired color code
            },
          }}
        >
          <Tab
            label="Pending"
            className="selectedTab"
            value="0"
            component={Link}
            to="/pdf-management/pending"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", // Change the text color when the tab is selected
              },
            }}
            onClick={GetData}
          />
          <Tab
            label="Approved"
            className="selectedTab"
            value="1"
            component={Link}
            to="/pdf-management/approved"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", // Change the text color when the tab is selected
              },
            }}
            onClick={GetData}
          />
          <Tab
            label="Disapproved"
            className="selectedTab"
            value="2"
            component={Link}
            to="/pdf-management/disapproved"
            sx={{
              "&.Mui-selected": {
                color: "#15223F", // Change the text color when the tab is selected
              },
            }}
            onClick={GetData}
          />
        </Tabs>
        <TabPanel value="0">
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
                    {Details.role !== "3" ? (
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
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
                  <TableCell className="headings">Wallboards</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow key={row.id}>
                          <TableCell
                            padding="checkbox"
                            style={{ textAlign: "center" }}
                          >
                            {Details.role !== "3" ? (
                              <Checkbox
                                color="primary"
                                onClick={(event) => {
                                  const Data = {
                                    id: row.id,
                                    pdfLink: row.pdf_ai,
                                  };
                                  handleClick(event, Data);
                                }}
                                checked={isItemSelected}
                              />
                            ) : (
                              <>{serialNumber(page, index)}</>
                            )}
                          </TableCell>

                          {/* <TableCell
                          style={{ textAlign: "center" }}
                          className="common"
                        >
                          {serialNumber(page, index)}
                        </TableCell> */}
                          <TableCell className="common">
                            {row.wallboard_name}
                            <br />
                            <br />
                            {/* <p className="template">
                          Template 1
                          <span className="network-type">Nephrology</span>
                          <span className="month"> August</span>
              
                        </p> */}
                            <div className="allbuttons email">
                              {/* <a
                              href={row.pdf_ai}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-pdf"
                            >
                              View PDF
                            </a> */}
                              <Button
                                size="small"
                                // type="submit"
                                variant="contained"
                                // color="primary"
                                style={{ background: "#15223F" }}
                                startIcon={<VisibilityIcon />}
                                onClick={() =>
                                  navigate(`/pdf-management/view-pdf/${row.id}`)
                                }
                              >
                                View PDF
                              </Button>
                              {/* <Button
                                size="small"
                                // type="submit"
                                variant="contained"
                                // color="primary"
                                style={{ background: "#15223F" }}
                                startIcon={<MdEmail />} 
                                // onClick={()=>{
                                //   SendEmail(row.id, row.pdf_ai)
                                // }}
                                onClick={() => {
                                  setPopupOpen(true);
                                  setEmailData({
                                    id: row.id,
                                    link: row.pdf_ai,
                                  });
                                }}
                              >
                                Send Email
                              </Button> */}
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Customize the options as needed
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
        <TabPanel value="1">
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
                    All Approved Wallboards
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data
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
                          <br />
                          {/* <p className="template">
                          Template 1
                          <span className="network-type">Nephrology</span>
                          <span className="month"> August</span>
              
                        </p> */}
                          <div className="approved">
                            <p>Approved</p>
                          </div>

                          <div className="allbuttons">
                            {/* <a
                              href={row.pdf_ai}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-pdf"
                            >
                              View PDF
                            </a> */}
                            <Button
                              size="small"
                              // type="submit"
                              variant="contained"
                              // color="primary"
                              style={{ background: "#15223F" }}
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(`/pdf-management/view-pdf/${row.id}`)
                              }
                            >
                              View PDF
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
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
        <TabPanel value="2">
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
                    All Disapproved Wallboards
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data
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
                          <br />
                          {/* <p className="template">
                          Template 1
                          <span className="network-type">Nephrology</span>
                          <span className="month"> August</span>
              
                        </p> */}
                          <div className="disapproved">
                            <p>Disapproved</p>
                          </div>

                          <div className="allbuttons">
                            {/* <a
                              href={row.pdf_ai}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-pdf"
                            >
                              View PDF
                            </a> */}
                            <Button
                              size="small"
                              // type="submit"
                              variant="contained"
                              // color="primary"
                              style={{ background: "#15223F" }}
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigate(`/pdf-management/view-pdf/${row.id}`)
                              }
                            >
                              View PDF
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
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
      </TabContext>
      <Popup
        open={popupOpen}
        // onClose={handlePopupClose}
        overflowY="auto"
        height="179px"
        title="Enter Email to Send"
        content={
          <>
            <form onSubmit={handleSubmit}>
              <TagsInput
                name="emails"
                value={tags}
                inputValue={inputValue}
                onChange={(tags) => {
                  handleTagsChange(tags, "emails");
                }}
                onChangeInput={(value) => setInputValue(value)}
                validate={isValidEmail}
                inputProps={{
                  placeholder: "Enter Email",
                  style: { width: "100%", color: "black", fontSize: "16px" },
                }}
                addKeys={["Enter", ","]}
              />
              <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#F44336", marginRight: 10 }}
                  onClick={() => {
                    setPopupOpen(false);
                    setEmailList([]);
                    setTags([]);
                  }}
                >
                  Close
                </Button>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{ background: "#15223F" }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </>
        }
      />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default GeneratePDF;

function EnhancedTableToolbar({ numSelected, MultipleEmail }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {
        numSelected > 0 ? (
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
        )
        // (
        //   <Typography
        //     sx={{ flex: "1 1 100%" }}
        //     variant="h6"
        //     id="tableTitle"
        //     component="div"
        //   >
        //     Templates
        //   </Typography>
        // )
      }

      {numSelected > 0 ? (
        <Tooltip title="Send Email">
          <IconButton onClick={MultipleEmail}>
            <MdEmail />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
}
