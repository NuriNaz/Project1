import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Button} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import "../../Wallboard Management/style.css";
import VisibilityIcon from '@mui/icons-material/Visibility';


const ViewAIpdf = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust the number of rows per page as needed
  
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
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  

  return (
    <MainCard title="View AI PDF's">
        {/* <ComingSoon /> */}
          <TableContainer
            component={Paper}
            style={{ border: "1px solid black" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{textAlign:"center"}} className="headings">#</TableCell>
                  <TableCell className="headings">
                    AI PDF'S
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={{textAlign:"center"}} className="common">{row.id}</TableCell>
                      <TableCell className="common">
                        {row.name}
                        <br />
                        <br />

                        {/* <p className="template">
                          Template 1
                          <span className="network-type">Nephrology</span>
                          <span className="month"> August</span>
              
                        </p> */}
                        <div className="allbuttons"> 
                        <Button
                                    size="small"
                                    // type="submit"
                                    variant="contained"
                                    // color="primary"
                                    style={{ background: "#15223F" }}
                                    startIcon={<VisibilityIcon />}
                                >View PDcccF</Button>
                                 {/* <Button
                                    size="small"
                                    // type="submit"
                                    variant="contained"
                                    // color="primary"
                                    style={{ background: "#15223F" }}
                                    startIcon={<DeleteIcon />} // Add Delete icon using startIcon
                                >Delete</Button>
                                 <Button
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
  )
}

export default ViewAIpdf
