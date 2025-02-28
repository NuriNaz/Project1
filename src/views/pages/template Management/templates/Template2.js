import { Button, Grid, Paper, TextField, styled } from "@mui/material";
import React, { useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import "./style.css";
import { useState } from "react";
import Popup from "components/Popup";
import Axios from "api/Axios";
import CommonButton from "components/CommonButtons";
import CommonForm from "components/CommonForm";
import { API } from "api/API";
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import Message from "components/Snackbar/Snackbar";
import { useNavigate } from "react-router-dom";

const Template2 = () => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [error, setError] = useState({
      contentCategory: false,
      postid: false,
      c1: false,
      c2: false,
      c3: false,
      c4: false,
      c5: false,
      c6:false,
      template_name: false,
    });
    const [options, setOptions] = useState([]);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      // severity: "",
    });
    const [selectedCategory, setselectedCategory] = useState({
      category: "",
      categoryID: "",
    });
    const [manualAIcheck, setManualAIcheck] = useState({
      Manual: false,
      AI: false,
    });
  
    const [columns, setColumns] = useState({
      c5: {
        content_type: "",
        category_type: "",
      },
      c6: {
        content_type: "",
        category_type: "",
      },
    });
  
    const [allColumns, setAllColumns] = useState({
      c5: false,
      c6:false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [saveTemplate, setTemplateSave] = useState(false);
    const [field, setField] = useState({ template_name: "" });
    const { template_name } = field;
    const dispatch = useDispatch();
    const navigate = useNavigate()
  
    const Item = styled(Paper)(({ theme }) => ({
      // backgroundColor: "#E0E0E0",
      border: "1px dashed black",
      borderRadius: 0,
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      // height: "300px",
      // cursor: "pointer",
    }));
  
    const handleMClick = () => {
      setPopupOpen(true);
      setManualAIcheck({ Manual: true });
    };
  
    const handleAIClick = () => {
      setPopupOpen(true);
      setManualAIcheck({ AI: true });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const selectedColumn = Object.keys(allColumns).find(
        (key) => allColumns[key]
      );
      if (selectedColumn) {
        const content_type = manualAIcheck.Manual ? "Manual" : "AI";
        setColumns({
          ...columns,
          [selectedColumn]: {
            content_type,
            category_type: selectedCategory.category,
          },
        });
        setPopupOpen(false);
      }
    };
  
    const handleAutocompleteChange = (event, newValue) => {
      if (newValue?.category) {
        setselectedCategory({
          category: newValue?.category,
          categoryID: newValue?.id,
        });
        setError({ contentCategory: false });
      }
    };
  
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await Axios.get(API.Get_All_categories);
        if (response.status === 200) {
          setOptions(response.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err, "Error while getting Categories");
        if (err) {
          setIsLoading(false);
        }
      }
    };
  
    const handleAutocompleteClick = (event, value) => {
      fetchData();
    };
  
  
    const save = async () => {
      try {
        let errorMessage = "";
        for (let i = 5; i <= 6; i++) {
          const column = columns[`c${i}`];
          // console.log(column, "hello")
          if (column.content_type === "" || column.category_type === "") {
            errorMessage = {
              error: `Please Enter the data of Column C${i}`,
              column: `c${i}`,
            };
            setError({ [`c${i}`]: true });
            break;
          }
        }
        if (errorMessage !== "") {
          setSnackbar({
            open: true,
            message: errorMessage.error,
            severity: "error",
          });
        } else if (errorMessage === "") {
          setTemplateSave(true);
        }
      } catch (err) {
        console.error(err, "Error while getting ");
      }
    };
  
    const SaveTemplate = async () => {
      try {
        if (!template_name) {
          setError({ template_name: true });
        } else {
          setIsLoading(true);
          const response = await Axios.post(API.Create_template, {
            template_ui_name:'1-ICYMI',
            template_name: template_name,
            templateColumns: columns,
          });
          if (response.status === 201) {
            console.log(response, "Here is the Response Data");
            setIsLoading(false);
            setSnackbar({
              open: true,
              message: response.data.msg,
              severity: "success",
            });
            setTemplateSave(false);
            setTimeout(() => {
              navigate("/template-management/view-template");
            }, 4000);
          }
        }
      } catch (err) {
        console.log(err, "Response Error ");
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: err.response.data.msg,
          severity: "error",
        });
      }
    };
  
    const handleCloseSnackbar = () => {
      setSnackbar({
        open: false,
        message: "",
        severity: snackbar.severity,
      });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setField({ ...field, [name]: value });
    };
  
    // useEffect(
    //   () => {
    //     // if (options.length === 0) {
    //     //   fetchData();
    //     // }
    //   }
    //   // [options]
    // );
    useEffect(()=>{
      dispatch({ type: MENU_OPEN, id: "selectTemplates" });
    },[])
  return (
    <MainCard title='Liver Cancer' save={save} buttontitle="Save">
      {/* <ComingSoon /> */}
      <Popup
        open={popupOpen}
        title="Please Select"
        content={
          <>
            {/* Form for Submit Autocomplete */}
            <CommonForm
              handleSubmit={handleSubmit}
              options={options}
              handleAutocompleteChange={handleAutocompleteChange}
              handleAutocompleteClick={handleAutocompleteClick}
              error={error}
              handleClose={() => setPopupOpen(false)}
              getOptionLabel={(option) => option.category}
              key={option=>option.id}
            />
            <Loading
              isLoading={isLoading}
              height={80}
              width={80}
              color="#15223F"
            />
          </>
        }
      />

      {/* Popup for Save */}
      <Popup
        open={saveTemplate}
        title="Please Enter the Template Name"
        content={
          <>
            <TextField
              style={{ margin: "7px 0 20px 0" }}
              // required
              fullWidth
              name="template_name"
              autoComplete="off"
              label="Template Name"
              value={template_name}
              onChange={handleChange}
              error={error.template_name}
              helperText={
                error.template_name && "Please enter the Template Name"
              }
            />
            <div style={{ textAlign: "center" }}>
              <Button
                size="large"
                // type="submit"
                variant="contained"
                style={{ background: "#1d213e", marginRight: "15px" }}
                onClick={SaveTemplate}
              >
                Submit
              </Button>
              <Button
                size="large"
                variant="contained"
                style={{ background: "#C62828", marginRight: "10px" }}
                onClick={() => setTemplateSave(false)}
              >
                Close
              </Button>
            </div>
          </>
        }
      />

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
        <Grid item xs={12}>
          {/* Header */}
          <Item className="header"></Item>
        </Grid>
        <Grid item xs={2}>
          <Item
            className="first"
            style={{ border: error.c1 && "1px dashed red" }}
          >
            {/* <CommonButton
              onMClick={() => {
                setAllColumns({ c1: true });
                handleMClick();
              }}
              // onAIClick={handleAIClick}
              ManualBackground="#1d213e"
              AIbackground="#1d213eb8"
              isAIDisabled={true}
            /> */}
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item
            className="banner"
            style={{ marginBottom: 10, border: error.c2 && "1px dashed red" }}
          >
            {/* <CommonButton
              onMClick={() => {
                setAllColumns({ c2: true });
                handleMClick();
              }}
              // onAIClick={handleAIClick}
              ManualBackground="#1d213e"
              AIbackground="#1d213eb8"
              isAIDisabled={true}
            /> */}
          </Item>
          {/* <CommonButton
            // onMClick={handleMClick}
            onMClick={() => {
              setAllColumns({ c3: true });
              handleMClick();
            }}
            // onAIClick={handleAIClick}
            ManualBackground="#1d213e"
            AIbackground="#1d213eb8"
            isAIDisabled={true}
          /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              border: error.c3 && "1px dashed red",
            }}
          >
            <Grid item xs={3.8}>
              <Item className="item7"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item7"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item7"></Item>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={2}>
          <Item
            className="item4"
            style={{ border: error.c4 && "1px dashed red" }}
          >
            {/* <CommonButton
              // onMClick={handleMClick}
              onMClick={() => {
                setAllColumns({ c4: true });
                handleMClick();
              }}
              // onAIClick={handleAIClick}
              ManualBackground="#1d213e"
              AIbackground="#1d213eb8"
              isAIDisabled={true}
            /> */}
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item
            className="item6"
            style={{ border: error.c5 && "1px dashed red" }}
          >
            <CommonButton
              // onMClick={handleMClick}
              onAIClick={() => {
                setManualAIcheck({ AI: true });
                setAllColumns({ c5: true });
                handleAIClick();
                // handleMClick();
              }}
              ManualBackground="#1d213eb8"
              AIbackground="#1d213e"
              isAIDisabled={false}
              isManualDisabled={true}
            />
          </Item>
          <Item
            className="item6"
            style={{ border: error.c6 && "1px dashed red" }}
          >
            <CommonButton
              // onMClick={handleMClick}
              onAIClick={() => {
                setManualAIcheck({ AI: true });
                setAllColumns({ c6: true });
                handleAIClick();
                // handleMClick();
              }}
              ManualBackground="#1d213eb8"
              AIbackground="#1d213e"
              isAIDisabled={false}
              isManualDisabled={true}
            />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item className="footer"></Item>
        </Grid>
      </Grid>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  )
}

export default Template2
