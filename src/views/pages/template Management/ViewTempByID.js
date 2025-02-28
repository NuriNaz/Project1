import React, { useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Grid, Paper, Typography, styled } from "@mui/material";
import "../template Management/templates/style.css";
import { useState } from "react";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import Message from "components/Snackbar/Snackbar";
import { useNavigate, useParams } from "react-router-dom";

const ViewTempByID = () => {
  const params = useParams();
  const id = params.id;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const ViewTemplateData = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_template_dataBy_ID, {
        id,
      });
      if (response.status === 200) {
        setIsLoading(false);
        console.log(response.data, "response Data");
        setData(response.data);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "selectTemplates" });
    ViewTemplateData();
  }, []);

  return (
    <MainCard
      title={
        data?.template_name === undefined
          ? "Temp Data"
          : data.template_name
      }
    >
      {/* <ComingSoon />  */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
        <Grid item xs={12}>
          {/* Header */}
          <Item className="header"></Item>
        </Grid>
        <Grid item xs={2}>
          <Item className="first">
            <p className="bold">C1</p>
            <p>
              <span className="bold">Content Category:</span>
              <br /> {data?.templateColumns?.c1?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>
              <br /> {data?.templateColumns?.c1?.content_type}
            </p>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item className="banner" style={{ marginBottom: 10 }}>
            <div style={{ textAlign: "center" }}>
              <p className="bold">C2</p>
              <p>
                <span className="bold">Content Category:</span>{" "}
                {data?.templateColumns?.c2?.category_type}
              </p>
              <p>
                <span className="bold">Content Type:</span>{" "}
                {data?.templateColumns?.c2?.content_type}
              </p>
            </div>
          </Item>
          <div style={{ textAlign: "center" }}>
            <p className="bold">C3</p>
            <p>
              <span className="bold">Content Category:</span>{" "}
              {data?.templateColumns?.c3?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>{" "}
              {data?.templateColumns?.c3?.content_type}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Grid item xs={3.8}>
              <Item className="item1 databyid"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item2 databyid"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item3 databyid"></Item>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={2}>
          <Item className="item4">
            <p className="bold">C4</p>
            <p>
              <span className="bold">Content Category:</span>
              <br /> {data?.templateColumns?.c4?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>
              <br /> {data?.templateColumns?.c4?.content_type}
            </p>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item className="item5">
            <p className="bold">C5</p>
            <p>
              <span className="bold">Content Category:</span>
              <br /> {data?.templateColumns?.c5?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>
              <br /> {data?.templateColumns?.c5?.content_type}
            </p>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item className="footer"></Item>
        </Grid>
      </Grid>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default ViewTempByID;
