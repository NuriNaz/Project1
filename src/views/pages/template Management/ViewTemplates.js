import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import MainCard from "ui-component/cards/MainCard";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { API } from "api/API";
import Axios from "api/Axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";

// Get Template API
const fetchDataFromAPI = async () => {
  try {
    const response = await Axios.get(API.Get_Template);
    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.log(err, "Error while getting Categories");
  }
};

export default function ViewTemplates() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tempData, setTempData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rowID, setRowID] = useState({rowID:'', templateName:''});

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tempData.map((n) => n.id); // Replace 'id' with your unique identifier
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const navigate = useNavigate();

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleData = async () => {
    const data = await fetchDataFromAPI();
    if (data) {
      setTempData(data);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    handleData();
    dispatch({ type: MENU_OPEN, id: "viewTemplate" });
  }, []);

  const open = Boolean(anchorEl);
  const handleMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    console.log(id, "hello iDS");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    // 'selected' contains the IDs of the selected rows
    const result = selected.map((item, index) =>
      index === 0 ? item : `&id=${item}`
    );
    const selectedTemplate = result.join("");
    console.log("Delete selected rows:", selectedTemplate);
    // Add your delete API call or logic here to delete the selected rows.
    try {
      setIsLoading(true);
      const response = await Axios.delete(
        `${API.Delete_Template}?id=${selectedTemplate}`
      );
      console.log(response);
      if (response.status === 204) {
        setIsLoading(false);
        console.log(response.data);
        handleData();
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  return (
    <MainCard title="View Templates">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleDelete={handleDelete}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={tempData.length}
              />
              <TableBody>
                {tempData?.length > 0 ? (
                  tempData.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow hover key={row.id} sx={{ cursor: "pointer" }}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onClick={(event) => handleClick(event, row.id)}
                            checked={isItemSelected}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.template_name}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            onClick={(event) => {
                              setAnchorEl(event.currentTarget);
                              setRowID({rowID:row.id, templateName:row.template_ui_name});
                            }}
                          >
                            <MoreVertIcon style={{ color: "#15223F" }} />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: 48 * 4.5,
                                width: "20ch",
                              },
                            }}
                          >
                            {/* Menu items */}
                            <MenuItem
                              key="View"
                              onClick={() => {
                                handleClose();
                                if(rowID.templateName=== '1-ICYMI'){
                                  navigate(`/template-management/view-template2/${rowID.rowID}`)
                                }else{
                                navigate(
                                  `/template-management/view-template-data/${rowID.rowID}`
                                );}
                              }}
                            >
                              View
                            </MenuItem>
                            {/* <MenuItem key="Edit" onClick={handleClose}>
                Edit
              </MenuItem> */}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tempData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Loading
            isLoading={isLoading}
            height={80}
            width={80}
            color="#15223F"
          />
        </Paper>
      </Box>
    </MainCard>
  );
}

function EnhancedTableToolbar({ numSelected, handleDelete }) {
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
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
}

function EnhancedTableHead({ numSelected, onSelectAllClick, rowCount }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all",
            }}
          />
        </TableCell>
        <TableCell style={{ padding: 0 }}>Template name</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}
