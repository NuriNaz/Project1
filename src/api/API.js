const STAGING = true;
export const BASE_URL = STAGING
  ? // Please use Staging BASE_URL Here
    "http://192.168.75.202:3000/"
  : // Please Use Production BASE_URL Here
    "https://api-wau.primotech.us/";
    // "https://ai-api.physiciansweekly.com/";

export const PW_URL = STAGING
  ? // Please use Staging BASE_URL Here
    "https://staging.physiciansweekly.com/"
  : // Please Use Production BASE_URL Here
    "https://www.physiciansweekly.com/";

export const API = {
  Login: `${BASE_URL}api/user_login`,
  Register: `${BASE_URL}api/user_register`,
  Profile_Details: `${BASE_URL}api/getProfile`,
  Get_All_categories: `${BASE_URL}api/getAllCategories`,
  Create_template: `${BASE_URL}api/createtemplate`,
  Get_Template: `${BASE_URL}api/gettemplate`,
  TemplateCount: `${BASE_URL}api/getCountTemplates`,
  Delete_Template: `${BASE_URL}api/deleteTemplate/`,
  Get_template_dataBy_ID: `${BASE_URL}api/get-Template/`,
  Get_Network_Type: `${BASE_URL}api/get_network_type`,
  Create_Wallboard: `${BASE_URL}api/create_wallboard_pdfmerge`,
  Get_All_Wallboards: `${BASE_URL}api/get_all_wallboards_mergepdf_ai`,
  Copy_Wallboard: `${BASE_URL}api/copy_wallboard_pdfmerge`,
  CreateAI_Wallboard: `${BASE_URL}api/CreateaAIWallboard`,
  Delete_Wallboard: `${BASE_URL}api/Delete_Wallboard`,
  Get_AI_Wallboard_Listings: `${BASE_URL}api/GetAIWallboardListing`,
  Get_Validate_Content: `${BASE_URL}api/listing_all_content_management_data`,
  Get_Validate_Content_By_ID: `${BASE_URL}api/get_single_data`,
  Validate_Update_Content: `${BASE_URL}api/update_all_data`,
  // Pending_PDF: `${BASE_URL}api/getAllWallboardAIPDF`,
  Pending_PDF: `${BASE_URL}api/get_printer_created_WallboardAIPDF`,
  // Get_Single_PDF: `${BASE_URL}api/getSinglePdfAi`,
  Get_Single_PDF: `${BASE_URL}api/get_printer_pdf_path`,
  // Approval_disapprovalAIWallboard: `${BASE_URL}api/SampleApprovalDissapprovalAIWallboard`,
  Approval_disapprovalAIWallboard: `${BASE_URL}api/web_approved_disapproved_status`,
  Validate_Filter: `${BASE_URL}api/category_month_filter`,
  Get_Single_Version: `${BASE_URL}api/getSingleVersionAI`,
  Single_Listing_AI_Walboard: `${BASE_URL}api/getStatusListingAIWallboard`,
  // Approve_and_Disapprove_Wallboard: `${BASE_URL}api/ApprovalDissapprovalAIWallboard`,
  Approve_and_Disapprove_Wallboard: `${BASE_URL}api/approveAndUploadPDF`,
  Wallboard_Version_List: `${BASE_URL}api/wallboardVersionList`,
  Wallboard_Update: `${BASE_URL}api/Wallboardversionsedit`,
  Wallboard_Filter_API: `${BASE_URL}api/versionFilterWallboard`,
  Get_Pdf_Path: `${BASE_URL}api/getPdfPath`,
  Invite_New_User: `${BASE_URL}api/invite_user`,
  Get_All_Filter_Category: `${BASE_URL}api/getAllCategories`,
  Get_All_Filter_Category_Subcategory: `${BASE_URL}api/getAllSubCategories`,
  Get_SubCategory: `${BASE_URL}api/get_subcategory`,
  Send_Email: `${BASE_URL}api/sendemail`,
  Themes_Listing: `${BASE_URL}api/get_all_template_themes`,
  Copy_Multiple_Wallboard: `${BASE_URL}api/CopysWallboards`,
  Delete_Multiple_Wallboard: `${BASE_URL}api/DeletesmultipleWallboards`,
  Filter_Create_Wallboard: `${BASE_URL}api/filter_by_month_year`,
  Get_Users_List: `${BASE_URL}api/get_user_listing`,
  Delete_Users: `${BASE_URL}api/delete_user`,
  Get_User_Detail: `${BASE_URL}api/getUserByID`,
  Update_User_Detail: `${BASE_URL}api/update_user`,
  Get_Profile: `${BASE_URL}api/getProfile`,
  Update_Profile: `${BASE_URL}api/updateProfile`,
  Forgot_Pass: `${BASE_URL}api/reset_link`,
  Generate_Password: `${BASE_URL}api/validate_save_resetpassword`,
  Wallboard_Existing_years: `${BASE_URL}api/getexistingyears`,
  Wallboard_YearsTo_Months: `${BASE_URL}api/getexistingyeartomonth`,
  Wallboard_Versions_GetYear: `${BASE_URL}api/wallboard_versions_getyear`,
  Wallboard_Versions_GetMonth: `${BASE_URL}api/wallboard_versions_getyeartomonth`,
  Author_image_Delete: `${BASE_URL}api/delete_author_image`,
  PW_Media_Images: `${PW_URL}author-images-api`,
  PW_Media_Images1: `${PW_URL}api/wp/v2/author-images-api/`,

};
