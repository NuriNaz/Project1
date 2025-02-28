import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import TotalorderLineChartCard2 from './chart-data/TotalorderLineChartCard2';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import MainCard from 'ui-component/cards/MainCard';
import ComingSoon from 'views/pages/comingsoon/comingSoon';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(false);
        dispatch({ type: MENU_OPEN, id: 'default' });
  }, []);

  return (
    // <Grid container spacing={gridSpacing}>
    //   <Grid item xs={12}>
    //     <Grid container spacing={gridSpacing}>
    //       <Grid item lg={4} md={6} sm={6} xs={12}>
    //         {/* <EarningCard isLoading={isLoading} /> */}
    //         <TotalOrderLineChartCard isLoading={isLoading} />

    //       </Grid>
    //       <Grid item lg={4} md={6} sm={6} xs={12}>
    //         <TotalorderLineChartCard2 isLoading={isLoading} />
    //       </Grid>
    //       <Grid item lg={4} md={12} sm={12} xs={12}>
    //         <Grid container spacing={gridSpacing}>
    //           <Grid item sm={6} xs={12} md={6} lg={12}>
    //             <TotalIncomeDarkCard isLoading={isLoading} />
    //           </Grid>
    //           <Grid item sm={6} xs={12} md={6} lg={12}>
    //             <TotalIncomeLightCard isLoading={isLoading} />
    //           </Grid>
    //         </Grid>
    //         {/* <TotalOrderLineChartCard3 isLoading={isLoading} /> */}


    //       </Grid>
    //     </Grid>
    //   </Grid>
    //   <Grid item xs={12}>
    //     <Grid container spacing={gridSpacing}>
    //       <Grid item xs={12} md={12}>
    //         <TotalGrowthBarChart isLoading={isLoading} />
    //       </Grid>
    //       <Grid item xs={12} md={4}>
    //         {/* <PopularCard isLoading={isLoading} /> */}
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Grid>
    <MainCard title="Dashboard">
      <ComingSoon />
    </MainCard>
  );
};

export default Dashboard;
