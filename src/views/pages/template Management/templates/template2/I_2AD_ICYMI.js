import React, { useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Grid, Paper, Typography, styled } from "@mui/material";
// import ".../template Management/templates/style.css";
import "../../templates/style.css";
import { useState } from "react";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import Message from "components/Snackbar/Snackbar";
import { useNavigate, useParams } from "react-router-dom";

const I_2AD_ICYMI = () => {
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
        console.log(
          response.data.templateColumns.c5.category_type,
          "response Data"
        );
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
    //   title={
    //     data?.template_name === undefined ? "Temp Data" : data.template_name
    //   }
    title="I-2AD-ICYMI"
    >
      {/* <div className="am_1">
      </div>
      <div className="am_left"></div> */}
      {/* <ComingSoon />  */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
        <Grid item xs={12}>
          {/* Header */}
          <Item className="header ">
            <div className="Masterhead">
              <p style={{ textTransform: "uppercase" }}>Masterhead</p>
              <p>1782x183</p>
            </div>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item className="first  qr">
            <div className="COLUMN_1">
              <p>COLUMN 1</p>
              <p>291x1530</p>
            </div>
            <br />
            <div title="51x51" className="scanner first_col">
              QR1
            </div>
            <p className="qr_size">51x51</p>
            {/* <p className="bold">C1</p>
            <p>
              <span className="bold">Content Category:</span>
              <br /> {data?.data?.templateColumns?.c1?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>
              <br /> {data?.data?.templateColumns?.c1?.content_type}
            </p> */}
          </Item>
        </Grid>

        <Grid item xs={6} className="hiquill mid_column">
          <Item className="banner dimmenssions" style={{ marginBottom: 10 }}>
            <div className="COLUMN_1">
              <p>MAIN ARTICLE</p>
              <p> 846x1446</p>
            </div>

            {/* <div style={{ textAlign: "center" }}>
              <p className="bold">C2</p>
              <p>
                <span className="bold">Content Category:</span>{" "}
                {data?.data?.templateColumns?.c2?.category_type}
              </p>
              <p>
                <span className="bold">Content Type:</span>{" "}
                {data?.data?.templateColumns?.c2?.content_type}
              </p>
            </div> */}
          </Item>
          {/* <div style={{ textAlign: "center" }}>
            <p className="bold">C3</p>
            <p>
              <span className="bold">Content Category:</span>{" "}
              {data?.data?.templateColumns?.c3?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>{" "}
              {data?.data?.templateColumns?.c3?.content_type}
            </p>
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              borderColor: "red",
            }}
          >
            <Grid item xs={3.8}>
              <Item className="item7 databyid editted"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item7 databyid editted"></Item>
            </Grid>
            <Grid item xs={3.8}>
              <Item className="item7 databyid editted"></Item>
            </Grid>
          </div>
          <Grid item xs={12}>
            <Item className="indesign qr bottom_foot">
              <p className="QR2 qr6">51x51</p>
              <div className="scanner scan1 bottom_col">QR2- ENL</div>
              <p className="QR2 qr5">51x51</p>
              <div className="scanner scan DSS">QR3- POD</div>
            </Item>
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Item className="item4  qr new">
            <p className="QR5">51x51</p>
            <div className="COLUMN_1">
              <p>MAIN ARTICLE</p>
              <p> 291x1614</p>
            </div>
            <div className="scanner scans hh">QR5- 3COL</div>
            {/* <p className="bold">C4</p>
            <p>
              <span className="bold">Content Category:</span>
              <br /> {data?.data?.templateColumns?.c4?.category_type}
            </p>
            <p>
              <span className="bold">Content Type:</span>
              <br /> {data?.data?.templateColumns?.c4?.content_type}
            </p> */}
          </Item>
        </Grid>
        {/* <p className="left_column"> */}
        {/* <Grid className="left_column mid_column" item xs={2}> */}
        <Grid className="left_column" item xs={2}>
        <p className="sapce_dd" style={{ textAlign: "center" }}>
            In Case You Missed It
          </p>
          <Item className="item6 qr over update">

            {/* <div className="COLUMN_1X">
              <p>I COL.POL</p>
              <p> 291x477</p>
            </div>
            <p className="QR4">60x60</p> */}

            {/* <p className="bold boldc5">C5</p> */}
            {/* <div className="scanner scan5 right_col ami">QR4- POLL </div>
            <br />
            <br /> */}

            {/* </p> */}
            {/* <p>CARTOON</p> */}

          </Item>
          <p className="sapce_dd" style={{ textAlign: "center" }}>
            {/* In Case You Missed It */}
          </p>
          <Item className="item6 columnnC5">
            {/* <p className="bold">C5</p> */}
            {/* <div className="COLUMN_1Xx">
              <p>ICYMI COL 1</p>
              <p> 267x1062</p>
            </div> */}
            {/* <p>
              <span className="bold boldc5">Content Category:</span>
              <br /> {data?.templateColumns?.c6?.category_type}
            </p> */}
            {/* <p>
              <span className="bold boldc5">Content Type:</span>
              <br /> {data?.templateColumns?.c6?.content_type}
            </p> */}
            <div className="COLUMN_1Xx poll secondad">
              <p>SECONDARY AD</p>
              {/* <p> 267x1062</p> */}
            </div>
          </Item>
          <Item className="item7 columnC6 updatec6">
            {/* <p className="bold">C6</p>
            <p>
              <span className="bold boldc5">Content Category:</span>
              <br /> {data?.templateColumns?.c6?.category_type}
            </p>
            <p>
              <span className="bold boldc5">Content Type:</span>
              <br /> {data?.templateColumns?.c6?.content_type}
            </p> */}
            {/* <div className="COLUMN_1Xx">
              <p>ICYMI COL 1</p>
              <p> 267x1062</p>
            </div> */}
          </Item>
        </Grid>
        {/* </p> */}
        <Grid item xs={2}>
          <Item className="foot">
            <p className="QR6">66x63</p>
            <div className=" scanner foot_col ami">QR6- Perks</div>
            <p>FOOTER</p>
            <p>1161x63</p>  
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item className="footer dimmenssions ad">
            <div>
              <p>ADVERTISEMENT</p>
              <p>7082x780</p>
            </div>
          </Item>
        </Grid>
      </Grid>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default I_2AD_ICYMI;