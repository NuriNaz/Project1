// Libraries
import { lazy, useEffect } from "react";
import Loadable from "ui-component/Loadable";
import { Navigate} from "react-router";
// Pages
import MainLayout from "layout/MainLayout";
import Template1 from "views/pages/template Management/templates/Template1";
import ViewTempByID from "views/pages/template Management/ViewTempByID";
import GeneratePDF from "views/pages/Pdf-Management/generatePDF/GeneratePDF";
import Merge from "views/pages/Pdf-Management/MergePDF/Merge";
import AddMissingContent from "views/pages/content Management/AddMissingContent";
import EditUser from "views/pages/User Management/Users/EditUser";
import Profile from "layout/MainLayout/Header/ProfileSection/Profile";
import InviteUser from "views/pages/User Management/InviteNewUser/InviteUser";
import Import_Pdf from "views/pages/Pdf-Management/Import_PDF/Import_Pdf";
import All_Manual_PDF from "views/pages/Pdf-Management/AllManualPDF/All_Manual_PDF";
import ViewAIpdf from "views/pages/Pdf-Management/AllManualPDF/ViewAIpdf";
import CreateWallboard from "views/pages/Wallboard Management/CreateWallboard/CreateWallboard";
import Template2 from "views/pages/template Management/templates/Template2";
import ViewTemplate2 from "views/pages/template Management/templates/template2/ViewTemplate2";
import View_wallboard from "views/pages/Wallboard Management/View_Wallboard/View_wallboard";
import ShowVersionsData from "views/pages/Wallboard Management/View_Wallboard/AI_Containers.js/ShowVersionsData";
import View_PDF from "views/pages/Pdf-Management/generatePDF/View_PDF";
import View_PDF_Screen from "views/pages/Wallboard Management/View_Wallboard/View_PDF_Screen";
import Template3 from "views/pages/template Management/templates/Template3";
import Cookies from "js-cookie";
import NotFound from "./NotFound";
import ICYMI_2 from "views/pages/template Management/templates/template2/2-ICYMI_Poll";
import ICYMI_Cartoon from "views/pages/template Management/templates/template2/2-ICYMI_Cartoon";
import I_2AD_ICYMI from "views/pages/template Management/templates/template2/I_2AD_ICYMI";
import ICYMI_1_Cartoon from "views/pages/template Management/templates/template2/1-ICYMI_Cartoon";
import Media from "views/pages/Media/Media";

// Pages with Lazy Loading
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);
const SelectWallboard = Loadable(
  lazy(() => import("views/pages/Wallboard Management/selectWallboard"))
);
const CreateTemplate = Loadable(
  lazy(() => import("views/pages/Requirement Gathering/CreateTemplate"))
);
const ViewTemplate = Loadable(
  lazy(() => import("views/pages/Requirement Gathering/ViewTemplate"))
);
const SelectTemplates = Loadable(
  lazy(() => import("views/pages/template Management/SelectTemplates"))
);
const ValidateEligibleContent = Loadable(
  lazy(() => import("views/pages/content Management/ValidateEligibleContent"))
);
const ViewTemplates = Loadable(
  lazy(() => import("views/pages/template Management/ViewTemplates"))
);

const Users = Loadable(
  lazy(() => import("views/pages/User Management/Users/Users"))
);
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

// ==============================|| MAIN ROUTING ||============================== //

const ProtectedRoute = ({ element }) => {
  // Check if the user is authenticated (you can use your authentication logic here)
  const isAuthenticated = Cookies.get("userToken") !== undefined;
  return isAuthenticated ? (
    element
  ) : (
    // Redirect to the login page if the user is not authenticated
    <Navigate to="/login" replace />
  );
};

const MainRoutes = {
  path: "/",
  // element: <MainLayout />,
  element: <ProtectedRoute element={<MainLayout />} />,
  // element: Token? <MainLayout /> : <AuthLogin3 /> ,
  children: [
    {
      path: "dashboard",
      element: <DashboardDefault />,
    },

    {
      path: "selectwallboard",
      children: [
        {
          path: "/selectwallboard/pending",
          element: <SelectWallboard />,
        },
        {
          path: "/selectwallboard/approved",
          element: <SelectWallboard />,
        },
        {
          path: "/selectwallboard/disapproved",
          element: <SelectWallboard />,
        },
        {
          path: "create-wallboard",
          element: <CreateWallboard />,
        },
        {
          path: "view-ai-wallboard/:id",
          element: <View_wallboard />,
        },
        {
          path: "view-version/:id",
          element: <ShowVersionsData />,
        },
         {
          path: "/selectwallboard/View-pdf/:id",
          element: <View_PDF_Screen />,
        },
      ],
    },

    {
      path: "template-management",
      children: [
        {
          path: "predefined-templates",
          element: <SelectTemplates />,
        },
        {
          path: "view-template",
          element: <ViewTemplates />,
        },
        {
          path: "view-template-data/:id",
          element: <ViewTempByID />,
        },
        {
          path: "template2",
          element: <Template2 />,
        },
        {
          path: "template3",
          element: <Template3 />,
        },
        {
          path: "view-template2/:id",
          element: <ViewTemplate2 />,
        },
        {
          path: "2icymi/:id",
          element: <ICYMI_2 />,
        },
        {
          path: "2icymi_cartoon/:id",
          element: <ICYMI_Cartoon />,
        },
        {
          path: "I2ADICYMI/:id",
          element: <I_2AD_ICYMI />,
        },
        {
          path: "ICYMI-1_Cartoon/:id",
          element: <ICYMI_1_Cartoon />,
        },
      ],
    },
    {
      path: "contentmanagement",
      children: [
        {
          path: "validate-eligible-content",
          element: <ValidateEligibleContent />,
        },
        {
          path: "add-missing-content/:id",
          element: <AddMissingContent />,
        },
      ],
    },

    {
      path: "media",
      element: <Media />,
    },

    {
      path: "createtemplate",
      element: <CreateTemplate />,
    },
    {
      path: "viewtemplate",
      element: <ViewTemplate />,
    },
    {
      path: "template1",
      element: <Template1 />,
    },
    {
      path: "pdf-management",
      children: [
        {
          path: "/pdf-management/pending",
          element: <GeneratePDF />,
        },
        {
          path: "/pdf-management/approved",
          element: <GeneratePDF />,
        },
        {
          path: "/pdf-management/disapproved",
          element: <GeneratePDF />,
        },
        {
          path: "merge-pdf",
          element: <Merge />,
        },
        {
          path: "import-manual-pdf",
          element: <Import_Pdf />,
        },
        {
          path: "all-manual-pdf",
          element: <All_Manual_PDF />,
        },
        {
          path: "view-ai-pdf",
          element: <ViewAIpdf />,
        },
        {
          path: "view-pdf/:id",
          element: <View_PDF />,
        },
      ],
    },
    {
      path: "user-management",
      children: [
        {
          path: "users",
          element: <Users />,
        },  
        {
          path: "edit-user/:id",
          element: <EditUser />,
        },
        {
          path: "invite-new-user",
          element: <InviteUser />,
        },
      ],
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: '/*',
      element: <NotFound />
  }
  ],
};

export default MainRoutes;
