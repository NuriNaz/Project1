// material-ui
// import { useTheme } from '@mui/material/styles';
import WallboardLogo from '../assets/images/PW-Circle-Logo-lockup_Horizontal.webp'

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Berry" width="100" />
     *
     */
    <img src={WallboardLogo} alt="Wallboard" width="300" />
  );
};

export default Logo;
