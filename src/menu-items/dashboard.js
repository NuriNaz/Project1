// Icons
import { IconDashboard, IconBrandChrome, IconWindmill } from "@tabler/icons";
import { BiBookContent, BiSolidNotepad, BiGitMerge, BiImport } from "react-icons/bi";
import { SiFlipboard } from "react-icons/si";
import { HiCursorClick, HiTemplate } from "react-icons/hi";
import { GoProjectTemplate } from "react-icons/go";
import { TiTick } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";
import { BsEye } from "react-icons/bs";
import { GrValidate } from "react-icons/gr";
import { PiFilePdfFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { RiAiGenerate } from "react-icons/ri";
import { GiNotebook } from "react-icons/gi";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { TfiWrite } from "react-icons/tfi";
import { MdCreateNewFolder } from "react-icons/md";
import { PiImagesSquareLight } from "react-icons/pi";
import Cookies from "js-cookie";

// constant
const icons = {
  IconDashboard, IconBrandChrome, PiImagesSquareLight, BiBookContent, SiFlipboard, HiCursorClick, TiTick, RxCrossCircled, BiSolidNotepad, GoProjectTemplate, BsEye, GrValidate, PiFilePdfFill, HiTemplate, FaUser, RiAiGenerate,BiGitMerge, GiNotebook, FaUsersBetweenLines, BiImport, TfiWrite, MdCreateNewFolder
};


const GetItem = localStorage.getItem('Profile_Details')
const Details= JSON.parse(GetItem)

// console.log(Details, 'hello this is it')
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/dashboard/",
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
    {
      id: "templatemanagement",
      title: "Template Management",
      type: "collapse",
      icon: icons.HiTemplate,
      children: [
        {
          id: "template-management",
          title: "Predefined Templates",
          type: "item",
          // url: "contentManagement/selecttemplates",
          url: "/template-management/predefined-templates",
          breadcrumbs: false,
          icon: icons.GoProjectTemplate,
        },
        // {
        //   id: "viewTemplate",
        //   title: "View Templates",
        //   type: "item",
        //   url: "/template-management/view-template",
        //   breadcrumbs: false,
        //   icon: icons.BsEye,
        // },
      ],
    },

    {
      id: "contentmanagements",
      title: "Content Management",
      type: "collapse",
      icon: icons.BiSolidNotepad,
      children: [
        {
          id: "validate-content",
          title: "Validate Eligible Content",
          type: "item",
          url: "/contentmanagement/validate-eligible-content",
          breadcrumbs: false,
          icon: icons.GrValidate,
        },
      ],
    },
    {
      id: "media",
      title: "Media",
      type: "item",
      url: "/media",
      breadcrumbs: false,
      icon: icons.PiImagesSquareLight,
    },

    {
      id: "icons",
      title: "Wallboard Management",
      type: "collapse",
      icon: icons.SiFlipboard,
      children: [

        {
          id: "createwallboard",
          title: "Create Wallboard",
          type: "item",
          url: "/selectwallboard/create-wallboard",
          breadcrumbs: false,
          icon: icons.MdCreateNewFolder,
        },
        {
          id: "selectwallboard",
          title: "Wallboard Components",
          type: "item",
          url: "/selectwallboard/pending",
          breadcrumbs: false,
          icon: icons.HiCursorClick,
        },
      ],
    },

    {
      id: "pdfManagement",
      title: "PDF Management",
      type: "collapse",
      icon: icons.PiFilePdfFill,
      children: [
        {
          id: "GeneratePDF",
          title: "Manage PDF",
          type: "item",
          url: "/pdf-management/pending",
          breadcrumbs: false,
          icon: icons.RiAiGenerate,
        },
        // {
        //   id: "importpdf",
        //   title: "Import Manual PDF",
        //   type: "item",
        //   url: "/pdf-management/import-manual-pdf",
        //   breadcrumbs: false,
        //   icon: icons.BiImport,
        // },
        //         {
        //   id: "allmanualpdf",
        //   title: "All Manual PDF",
        //   type: "item",
        //   url: "/pdf-management/all-manual-pdf",
        //   breadcrumbs: false,
        //   icon: icons.TfiWrite,
        // },
        // {
        //   id: "merge-pdf",
        //   title: "Merge PDF",
        //   type: "item",
        //   url: "/pdf-management/merge-pdf",
        //   breadcrumbs: false,
        //   icon: icons.BiGitMerge,
        // },

      ],
    },

    // {
    //   id: "requirement",
    //   title: "Requirement Gathering",
    //   type: "collapse",
    //   icon: icons.GiNotebook,
    //   children: [
    //     {
    //       id: "createtemplate",
    //       title: "Create Template",
    //       type: "item",
    //       url: "/createtemplate",
    //       breadcrumbs: false,
    //       icon: icons.GoProjectTemplate,
    //     },
    //     {
    //       id: "viewtemplates",
    //       title: "View Templates",
    //       type: "item",
    //       url: "/viewtemplate",
    //       breadcrumbs: false,
    //       icon: icons.BsEye,
    //     },
    //   ],
    // },
    
    {
      id: "user-Management",
      title: "User Management",
      type: "collapse",
      icon: icons.FaUser,
      children: [
        {
          id: "users",
          title: "Users",
          type: "item",
          url: "/user-management/users",
          breadcrumbs: false,
          icon: icons.FaUsersBetweenLines,
        },
      ],
    },
  ],
};

if (Details && Details.role !== "1") {
  dashboard.children = dashboard.children.filter(item => item.id !== "user-Management" && dashboard);
}

export default dashboard;
