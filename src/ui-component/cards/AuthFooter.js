// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => { 
  const date = new Date();
  let year = date.getFullYear();
  return(
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://www.physiciansweekly.com/" target="_blank" underline="hover">
    https://www.physiciansweekly.com/
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://www.physiciansweekly.com/" target="_blank" underline="hover">
    © {year} Physician’s Weekly
    </Typography>
  </Stack>
  )
};

export default AuthFooter;
