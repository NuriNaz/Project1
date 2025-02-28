import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";
import MinimalLayout from "layout/MinimalLayout";
import NotFound from "./NotFound";
import ForgotPassword from "views/pages/authentication/forgot-password/ForgotPassword";
import ResetPassword from "views/pages/authentication/reset-password/ResetPassword";

// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);
const AuthRegister3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Register3"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: <AuthLogin3 />,
    },
    {
      path: "/register/",
      element: <AuthRegister3 />,
    },
    {
      path: '/forgot-password/',
      element: <ForgotPassword/>
    },
    {
      path: '/reset-password/',
      element: <ResetPassword/>
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ],
};

export default AuthenticationRoutes;
