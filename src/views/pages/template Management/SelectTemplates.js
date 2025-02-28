// import React from "react";
// import MainCard from "ui-component/cards/MainCard";
// import ComingSoon from "../comingsoon/comingSoon";
// import { styled } from "@mui/material/styles";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { MENU_OPEN } from "store/actions";
// import { Box, Grid, Typography } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import { Link } from "react-router-dom";
// import images from "assets/images/Images";

// const SelectTemplates = () => {
//   const dispatch = useDispatch();

//   const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: "#E0E0E0",
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//     height: "300px",
//     cursor: "pointer",
//   }));

//   useEffect(() => {
//     dispatch({ type: MENU_OPEN, id: "template-management" });
//   }, []);

//   return (
//     <MainCard title="Select Templates">
//       {/* <ComingSoon /> */} 
//       <Box sx={{ width: "100%" }}>
//         <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//           <Grid item xs={4}>
//             {/* <Link to="/template1" style={{ textDecoration: "none" }}> */}
//             <Link to="/template-management/view-template2/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
//               <Item>
//                 {/* <img src={images.Temp1} style={{height:"100%", width:"100%"}} /> */}
//                 <img src={images.ICYMI_1} style={{height:"100%", width:"100%"}} />

//                 </Item>
//               <Typography variant="body2" style={{ textAlign: "center" }}>
//                 {/* Template 1 */}
//                 1-ICYMI
//               </Typography>
//             </Link>
//           </Grid>
//           <Grid item xs={4}>
//             <Link to="/template-management/2icymi/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
//               <Item>
//                 <img src={images.ICYMI_2} style={{height:"100%", width:"100%"}} />
//                 </Item>
//               <Typography variant="body2" style={{ textAlign: "center" }}>
//                 {/* Template 2 */}
//                 {/* 2-ICYMI */}
//                 2-ICYMI POLL
//               </Typography>
//             </Link>
//           </Grid>
//           <Grid item xs={4}>
//             <Link to="/template-management/2icymi_cartoon/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
//               <Item>
//               <img src={images.ICYMI_2Cartoon} style={{height:"100%", width:"100%"}} />
//               </Item>
//               <Typography variant="body2" style={{ textAlign: "center" }}>
//               2-ICYMI Cartoon
//               </Typography>
//             </Link>
//           </Grid>
//           <Grid item xs={4}>
//             <Link to="#" style={{ textDecoration: "none" }}>
//               <Item></Item>
//               <Typography variant="body2" style={{ textAlign: "center" }}>
//                 Template 4
//               </Typography>
//             </Link>
//           </Grid>
//         </Grid>
//       </Box>
//     </MainCard>
//   );
// };

// export default SelectTemplates;


import React from "react";
import MainCard from "ui-component/cards/MainCard";
import ComingSoon from "../comingsoon/comingSoon";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import { Box, Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import images from "assets/images/Images";

const SelectTemplates = () => {
  const dispatch = useDispatch();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#E0E0E0",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "300px",
    cursor: "pointer",
  }));

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "template-management" });
  }, []);

  return (
    <MainCard title="Select Templates">
      {/* <ComingSoon /> */} 
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
            {/* <Link to="/template1" style={{ textDecoration: "none" }}> */}
            <Link to="/template-management/view-template2/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
              <Item>
                {/* <img src={images.Temp1} style={{height:"100%", width:"100%"}} /> */}
                <img src={images.ICYMI_1} style={{height:"100%", width:"100%"}} />

                </Item>
              <Typography variant="body2" style={{ textAlign: "center" }}>
                {/* Template 1 */}
                1-ICYMI
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={4}>
            {/* <Link to="/template1" style={{ textDecoration: "none" }}> */}
            <Link to="/template-management/ICYMI-1_Cartoon/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
              <Item>
                {/* <img src={images.Temp1} style={{height:"100%", width:"100%"}} /> */}
                <img src={images.ICYMI_1} style={{height:"100%", width:"100%"}} />

                </Item>
              <Typography variant="body2" style={{ textAlign: "center" }}>
                {/* Template 1 */}
                1-ICYMI Cartoon
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/template-management/2icymi/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
              <Item>
                <img src={images.ICYMI_2} style={{height:"100%", width:"100%"}} />
                </Item>
              <Typography variant="body2" style={{ textAlign: "center" }}>
                {/* Template 2 */}
                2-ICYMI POLL
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/template-management/2icymi_cartoon/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
              <Item>
              <img src={images.ICYMI_2Cartoon} style={{height:"100%", width:"100%"}} />
              </Item>
              <Typography variant="body2" style={{ textAlign: "center" }}>
              2-ICYMI Cartoon
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/template-management/I2ADICYMI/IOdK9RrEXDnlFmde1qye" style={{ textDecoration: "none" }}>
              <Item>
              <img src={images.I2AD_ICYMIL} style={{height:"100%", width:"100%"}} />
              </Item>
              <Typography variant="body2" style={{ textAlign: "center" }}>
                I-2AD-ICYMI
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default SelectTemplates;