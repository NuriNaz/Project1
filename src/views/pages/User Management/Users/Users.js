import React, { useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import ComingSoon from "views/pages/comingsoon/comingSoon";
import { useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MENU_OPEN } from "store/actions";
import FirstnameIcon from "./FirstnameIcon";
import Axios from "api/Axios";
import { API } from "api/API";
import { useState } from "react";
import Loading from "components/Loading";
import {
  Checkbox,
  IconButton,
  Pagination,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { MdOutlineDelete } from "react-icons/md";
import Message from "components/Snackbar/Snackbar";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [next, setNext] = useState();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  // Table columns
  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "actions", label: "Actions" },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await GetUsers(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);

    let newarray = [];
    if (selectedIndex === -1) {
      newarray = newarray.concat(selected, id);
    } else if (selectedIndex === 0) {
      newarray = newarray.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newarray = newarray.concat(selected.slice(0, -1));
    } else {
      newarray = newarray.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newarray);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newarray = rows.map((obj) => obj.id);
      setSelected(newarray);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const DeleteUsers = async () => {
    console.log("Deleted Users", selected);
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Delete_Users, { ids: selected });
      if (res.status === 200) {
        console.log("rs", res);
        setIsLoading(false);
        GetUsers();
      }
    } catch (error) {
      console.log("Error in deleting users", error);
      setIsLoading(false);
    }
  };

  const inviteUsers = () => {
    navigate("/user-management/invite-new-user");
  };

  const GetUsers = async (page) => {
    try {
      setIsLoading(true);
      const response = await Axios.get(`${API.Get_Users_List}?page=${page}`);
      if (response.status === 200) {
        // console.log("rs", response.data)
        setRows(response?.data.listings);
        setIsLoading(false);
        setNext(response.data);
      }
    } catch (error) {
      console.log("Error in fetching users", error);
      setIsLoading(false);
    }
  };

  const Profile_Details = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(Profile_Details);
  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "users" });
    if (Details?.role !== "1") {
      navigate("/dashboard");
    }
    GetUsers(1);
  }, []);

  return (
    <MainCard
      title="User Management"
      save={inviteUsers}
      buttontitle="Invite New User"
    >
      {selected.length !== 0 && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          DeleteUsers={DeleteUsers}
        />
      )}
      <TableContainer component={Paper} style={{ border: "1px solid #364152" }}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#364152" }}>
              <TableCell style={{ textAlign: "center" }}>
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all" }}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell style={{ color: "#fff" }} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length > 0 ? (
              rows
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow key={row.id}>
                      <TableCell
                        padding="checkbox"
                        style={{ textAlign: "center" }}
                      >
                        <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="icon_name">
                          <FirstnameIcon firstName={row.firstName} />
                          <span className="names">{row.firstName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {row.role === "1"
                          ? "Admin"
                          : row.role === "2"
                          ? "Editor"
                          : "Viewer"}
                      </TableCell>
                      <TableCell>
                        <Link
                          style={{ textDecoration: "none", color: "#364152" }}
                          to={`/user-management/edit-user/${row.id}`}
                        >
                          <FaEdit style={{ fontSize: 18, cursor: "pointer" }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell style={{ textAlign: "center" }} colSpan={5}>
                  Record Not Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > 0 && next?.totalPageCount > 1 && (
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
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default Users;

function EnhancedTableToolbar({ numSelected, DeleteUsers }) {
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
        <Tooltip title="Delete">
          <IconButton onClick={DeleteUsers}>
            <MdOutlineDelete />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
}
