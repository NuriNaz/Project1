// Libraries
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";

// Components
import MainCard from "ui-component/cards/MainCard";
import "../style.css";
import Axios from "api/Axios";
import Message from "components/Snackbar/Snackbar";
import { API } from "api/API";
import Loading from "components/Loading";
import { FaRegFilePdf } from "react-icons/fa";

const View_wallboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust the number of rows per page as needed
  const [getAllWallboards, setAllWallboards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Get All Wallboards API
  const Get_All_Wallboards = async () => {
    const wallboard_id = params.id;
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_AI_Wallboard_Listings, {
        wallboard_id,
      });
      if (response.status === 200) {
        console.log(response.data.data, "response");
        setAllWallboards(response.data.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Get_All_Wallboards();
  }, []);

  const serialNumber = (page, index) => {
    return page * rowsPerPage + index + 1;
  };

  // const monthToString = (dateString) => {
  //   const monthNumber = moment(dateString, "YYYY-MM-DD HH.mm.ss").month();
  //   const monthString = moment().month(monthNumber).format("MMMM");
  //   return monthString;
  // };

  const monthToString = (dateString) => {
    const monthString = moment(dateString).format("MMMM");
    return monthString;
  };
  
  return (
    <MainCard title="View Wallboard">
      {/* <ComingSoon /> */}
      {/* <Button
        size="small"
        variant="contained"
        style={{ background: "#15223F", marginBottom:15 }}
        startIcon={<FaRegFilePdf />}
        // onClick={() =>
        //   navigate(
        //     `/selectwallboard/view-ai-wallboard/${item.wallboard_id}`
        //   )
        // }
      >
        Generate All PDF's
      </Button> */}
      <TableContainer component={Paper} style={{ border: "1px solid black" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center" }} className="headings">
                #
              </TableCell>
              <TableCell className="headings">Wallboard Components</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAllWallboards && getAllWallboards.length > 0 ? (
              getAllWallboards
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ textAlign: "center" }}
                      className="common"
                    >
                      {serialNumber(page, index)}
                    </TableCell>
                    <TableCell className="common">
                      {item?.wallboard_name}
                      <br />
                      <p className="template">
                        {/* Template 1 */}
                        {item?.version}
                        {/* <span className="network-type">
                          {item?.column_name}
                        </span> */}
                        <span className="month">
                          {/* {monthToString(item?.date)} */}
                          {item?.month}
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
                              `/selectwallboard/view-version/${item.documentId}`
                            )
                          }
                        >
                          View {item?.version}
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
        count={getAllWallboards?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
    </MainCard>
  );
};

export default View_wallboard;
