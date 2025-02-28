// Libraries
import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { FaRegEdit } from "react-icons/fa";
import { BiSolidSave } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import Hypher from "hypher";
import english from "hyphenation.en-us";
import { hyphenateHTML as hyphenate } from "hyphen/en";
import domToImage from "dom-to-image";
import { Editor } from "@tinymce/tinymce-react";

// Components
import "./style.css";
import MainCard from "ui-component/cards/MainCard";
import Popup from "components/Popup";
import { API } from "api/API";
import Axios from "api/Axios";
import Loading from "components/Loading";
import useScriptRef from "hooks/useScriptRef";
import Message from "components/Snackbar/Snackbar";

import {
  PDFDownloadLink,
  pdf,
  Document,
  Page,
  Image,
  StyleSheet,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
// import { toPng } from "html-to-image";
// import * as htmlToImage from "html-to-image";

// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import font from "../../../../../fonts/AGaramond-Regular.ttf";
// import Korolev from "../../../../../fonts/Korolev Condensed W04 Bold.ttf";

// Font.register({
//   family: "AGaramond-Regular",
//   fonts: [
//     {
//       src: font,
//     },
//   ],
// });
// Font.register({
//   family: "Korolev",
//   fonts: [
//     {
//       src: Korolev, // Replace with the source of the Korolev font
//     },
//   ],
// });

const ShowVersionsData = ({ ...others }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ c5: [], c6: [], status: "", color: "" });
  const [popupOpen, setPopupOpen] = useState(false);
  const [prevalue, setPrevalue] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });
  const [edit, setEdit] = useState({
    c5: false,
    showC5: false,
    show: false,
    approveDisabled: false,
  });
  const pdfContainerRef = useRef(null);

  const [isformEditted, setFormEditted] = useState({ id: "", status: false });

  const [value, setValue] = useState({
    body: "",
    title: "",
    author_name: "",
    bodyC6: "",
    titleC6: "",
    author_nameC6: "",
  });
  const [pdfSize, setPdfSize] = useState(false);

  const [body, setBody] = useState({
    imageURL1: "",
    heading1: "",
    body1: "",
    heading2: "",
    body2: "",
    authorC5: "",
    authorC6: "",
  });

  const [approved, setApproved] = useState(false);
  const [dimensions, setDimensions] = useState({
    firstImageWidth: 0,
    firstImageHeight: 0,
    secondImagewidth: 0,
    SecondImageheight: 0,
    thirdImagewidth: 0,
    thirdImagewidth: 0,
    fourthImagewidth: 0,
    fourthImagewidth: 0,
  });

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setDimensions({
      secondImagewidth: naturalWidth,
      SecondImageheight: naturalHeight,
    });
  };

  const handleImageLoad1 = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setDimensions({
      firstImageWidth: naturalWidth,
      firstImageHeight: naturalHeight,
    });
  };

  console.log(dimensions, "dimenssions");

  const params = useParams();

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#e9e9ea",
      padding: 10,
    },
    pdfImage: {
      width: "100%",
      height: "auto",
    },
    consistentSize: {
      width: "100%",
      height: "auto",
    },
    fonts: {
      fontFamily: "AGaramond-Regular",
      lineHeight: 1.2,
      fontSize: "13px",
      textAlign: "justify",
      wordSpacing: "0.4px",
      letterSpacing: "-0.5px",
      wordBreak: "break-all",
      color: "#364152",
    },
    heading: {
      padding: 0,
      fontSize: "20px",
      lineHeight: 1.2,
      textTransform: "capitalize !important",
      margin: 0,
      textAlign: "justify",
      letterSpacing: "-0.5px",
      color: data.color,
      fontFamily: "Korolev",
    },
    subheading: {
      fontSize: "12px",
      marginRight: "7px",
      fontFamily: "Korolev",
      color: "#001b49",
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const theme = useTheme();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      // [{ size: ["10px", "12px", "14px", "16px", "18px", "20px"] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { list: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
      [{ color: [] }], // Add the 'color' format to the toolbar
      ["space"],
    ],
  };

  const useStyles = makeStyles((theme) => ({
    p: {
      fontFamily: "AGaramond-Regular",
      // fontFamily: `'Poppins',sans-serif`,
      lineHeight: 1.2,
      fontSize: "15px",
      textAlign: "justify",
      wordSpacing: "0.4px",
      letterSpacing: "-0.5px",
      // hyphens: "auto",
      wordBreak: "break-all",
    },
    h3: {
      fontFamily: "Korolev",
      fontSize: "20px",
      lineHeight: 1.2,
      textTransform: "capitalize !important",
      margin: 0,
      textAlign: "justify",
      letterSpacing: "-0.5px",
    },
    img: {
      width: "100%",
    },
  }));

  const classes = useStyles();

  const removeHtmlTags = (htmlString) => {
    // Use a browser-based DOM parser to handle HTML parsing
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  // Get All Wallboards API
  const getData = async () => {
    const id = params.id;
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Get_Single_Version, {
        id,
      });
      if (response.status === 200) {
        // console.log(response.data, "test response");
        const hyphenator = new Hypher(english);
        const hyphen = hyphenator.hyphenateText(
          response.data.versiondetail.c5.body
        );
        const hyphen1 = hyphenator.hyphenateText(
          response.data.versiondetail.c6.body
        );

        const datas = response.data.versiondetail;
        setBody({
          imageURL1: datas.c5.author_img,
          body1: hyphenator.hyphenateText(hyphen),
          body2: hyphenator.hyphenateText(hyphen1),
          heading1: datas.c5.title,
          heading2: datas.c6.title,
          authorC5: datas.c5.author_name,
          authorC6: datas.c6.author_name,
        });
        setData({
          c5: response?.data?.versiondetail?.c5,
          c6: response?.data?.versiondetail?.c6,
          status: response.data.approval_status,
          color: response.data.template_theme_name,
        });

        const data = response.data.versiondetail;
        const databody1 = data?.c5?.body.replace(/&nbsp;/g, " ");
        const body1 = removeHtmlTags(data?.c5?.body);
        const body2 = removeHtmlTags(data?.c6?.body);
        const values = {
          author_name: data?.c5.author_name || "",
          author_nameC6: data?.c6.author_name || "",
          // body: data?.c5?.body || "",
          body: body1 || "",
          bodyC6: body2 || "",
          // bodyC6: data?.c6?.body || "",
          title:
            response.data.is_edit === true
              ? data.c5.title
              : `<h3>${data?.c5?.title}</h3>` || "",
          titleC6:
            response.data.is_edit === true
              ? data.c6.title
              : `<h3>${data?.c6?.title}</h3>` || "",
          // title: data?.c5?.title || "",
          // titleC6: data?.c6?.title || "",
        };
        setValue(values);
        setPrevalue(values);
        setIsLoading(false);
        // setTimeout(() => {
        //   Hyphens();
        // }, 1);
      }
    } catch (err) {
      console.log(err, "Error while Getting Data");
      setIsLoading(false);
    }
  };

  function Hyphens() {
    function insertHyphens(text, container) {
      // console.log('text',text,'container', container, )
      const words = text.split(" ");
      const containerWidth = container.offsetWidth;
      const hyphenatedWords = words.map((word) => {
        const wordWidth = calculateWordWidth(word, container);
        // console.log(wordWidth, "Hi its a wordwidth");
        if (wordWidth > 28) {
          // Insert a hyphen after every character
          // return word.split("").join("\u00AD");
          return word.split("").join("&#x00AD;");
        }
        return word;
      });
      // container.innerHTML = hyphenatedWords.join(" ");
      container.innerHTML = hyphenatedWords.join(" ");
    }

    function calculateWordWidth(word, container) {
      const tempElement = document.createElement("span");
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.textContent = word;
      container.appendChild(tempElement);
      const wordWidth = tempElement.offsetWidth;
      container.removeChild(tempElement);
      return wordWidth;
    }

    const chatGPTContainers = document.querySelectorAll(".chat-gpt");
    // console.log(chatGPTContainers, "hello GPT");

    chatGPTContainers.forEach((container) => {
      const text = container.textContent;
      insertHyphens(text, container);
    });
  }

  function Hyphens1() {
    function insertHyphens(chatGPTContainers) {
      const chatContainer = document.getElementById("chat1"); // Get the div element with the ID "chat1"
      const chatGPTParagraphs = chatContainer.querySelectorAll("p");

      chatGPTParagraphs.forEach((container) => {
        // console.log("Contaioner Name 1", container);
        const text = container.textContent;
        // console.log('text',text,'container', container, )
        const words = text.split(" ");
        const containerWidth = container.offsetWidth;
        const hyphenatedWords = words.map((word) => {
          const wordWidth = calculateWordWidth(word, container);
          //console.log(wordWidth, "Hi its a wordwidth ji");
          if (wordWidth > 28) {
            // Insert a hyphen after every character
            // return word.split("").join("\u00AD");
            return word.split("").join("&#x00AD;");
          }
          return word;
        });

        // container.innerText = hyphenatedWords.join(" ");

        container.innerHTML = hyphenatedWords.join(" ");
      });
    }

    function calculateWordWidth(word, container) {
      const tempElement = document.createElement("span");
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.textContent = word;
      container.appendChild(tempElement);
      const wordWidth = tempElement.offsetWidth;
      container.removeChild(tempElement);
      return wordWidth;
    }

    const chatGPTContainers = document.querySelectorAll("#chat1 p");
    // console.log(chatGPTContainers, "bolo jai mata di ");
    insertHyphens(chatGPTContainers);
    /*chatGPTContainers.forEach((container) => {
      console.log("Contaioner MName",container);
      const text = container.textContent;
      insertHyphens(text, container);
    });*/
  }

  function Hyphens2() {
    function insertHyphens(chatGPTContainers) {
      const chatContainer = document.getElementById("chat2"); // Get the div element with the ID "chat1"
      const chatGPTParagraphs = chatContainer.querySelectorAll("p");
      chatGPTParagraphs.forEach((container) => {
        // console.log("Contaioner Name 2", container);
        const text = container.textContent;
        // console.log('text',text,'container', container, )
        const words = text.split(" ");
        const containerWidth = container.offsetWidth;
        const hyphenatedWords = words.map((word) => {
          const wordWidth = calculateWordWidth(word, container);
          //console.log(wordWidth, "Hi its a wordwidth ji");
          if (wordWidth > 28) {
            // Insert a hyphen after every character
            // return word.split("").join("\u00AD");
            return word.split("").join("&#x00AD;");
          }
          return word;
        });

        // container.innerText = hyphenatedWords.join(" ");

        container.innerHTML = hyphenatedWords.join(" ");
      });
    }

    function calculateWordWidth(word, container) {
      const tempElement = document.createElement("span");
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.textContent = word;
      container.appendChild(tempElement);
      const wordWidth = tempElement.offsetWidth;
      container.removeChild(tempElement);
      return wordWidth;
    }

    const chatGPTContainers = document.querySelectorAll("#chat2 p");
    // console.log(chatGPTContainers, "bolo jai mata di ");
    insertHyphens(chatGPTContainers);
    /*chatGPTContainers.forEach((container) => {
      console.log("Contaioner MName",container);
      const text = container.textContent;
      insertHyphens(text, container);
    });*/
  }

  const ApprovalStatus = async (approval_status, message) => {
    try {
      if (edit.approveDisabled === true) {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Please save the wallboard before proceeding.",
        });
      } else {
        setApproved(true);
        const height = pdfContainerRef.current.clientHeight;
        // console.log(height, 'hello')
        const id = isformEditted.id || params.id;
        // PDF Blob Generating here

        const pdfBlob = approval_status === 2 ? null : await generatePDF();
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", id);
        formData.append(
          "approvalStatus",
          approval_status ? approval_status.toString() : ""
        );
        // formData.append("template_theme_name", data.color);
        if (message !== undefined) {
          formData.append("reason", message);
        }
        // formData.append("reason", message=== undefined);
        if (approval_status !== 2) {
          formData.append("pdfFile", pdfBlob, "generated.pdf");
        }
        // formData.append("image", pdfBlob);
        formData.append("height", height);

        const result = await Axios.Filepost(
          API.Approve_and_Disapprove_Wallboard,
          formData
        );
        if (result.status === 200) {
          setIsLoading(false);
          // setApproved(false);
          setSnackbar({
            open: true,
            message: result.data.message,
            severity: "success",
          });
          setPopupOpen(false);
          // setTimeout(() => {
          //   Hyphens();
          // }, 1000);
          setTimeout(() => {
            navigate("/selectwallboard/pending");
            // if (approval_status === 1) {
            //   navigate("/selectwallboard/approved");
            // } else if (approval_status === 2) {
            //   navigate("/selectwallboard/disapproved");
            // }
          }, 3000);
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err, "This is Error");
      setApproved(false);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "An error occurred",
        severity: "error",
      });
    }
  };

  const handleApprove = async () => {
    ApprovalStatus(1);
  };

  const handleDisApprove = () => {
    setPopupOpen(true);
  };

  // Wallboard Update API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEdit({ ...edit, approveDisabled: false });
    const payload = {
      docId: params.id,
      template_theme_name: data.color,
      columnUpdates: [
        {
          columnId: "c5",
          updatedData: {
            author_img: data?.c5?.author_img,
            author_name: value.author_name,
            title: value.title,
            body: value.body,
          },
        },
        {
          columnId: "c6",
          updatedData: {
            author_img: data?.c6?.author_img,
            author_name: value.author_nameC6,
            title: value.titleC6,
            body: value.bodyC6,
          },
        },
      ],
    };
    try {
      setIsLoading(true);
      const response = await Axios.post(API.Wallboard_Update, payload);
      if (response.status === 200) {
        setIsLoading(false);
        console.log(response.data, "hi this is response data ");
        setFormEditted({
          // id: response?.data.newVersionDetails.id,
          id: response?.data.updatedVersionDetails.id,
          status: true,
        });
        // const VersionData = response?.data.newVersionDetails.versiondetail;
        const VersionData = response?.data.updatedVersionDetails;
        setData({
          c5: VersionData?.c5,
          c6: VersionData?.c6,
          // status: response?.data?.newVersionDetails?.approval_status,
          status: response?.data?.updatedVersionDetails.approval_status,

          // color: response.data.newVersionDetails.template_theme_code,
          color: response.data.updatedVersionDetails.template_theme_code,
        });
        // const c5Body = VersionData?.c5.body;
        // const databody= c5Body.replace(/\s/g, '&nbsp;');
        setValue({
          body: VersionData?.c5.body,
          // body: databody,
          bodyC6: VersionData?.c6.body,
          author_name: VersionData?.c5.author_name,
          author_nameC6: VersionData?.c6.author_name,
          title: VersionData?.c5.title,
          titleC6: VersionData?.c6.title,
        });
        setEdit({ c5: false, show: false });
        setSnackbar({
          open: true,
          severity: "success",
          message: response.data.msg,
        });
        navigate(
          `/selectwallboard/view-version/${response?.data.updatedVersionDetails.id}`
        );
        // setTimeout(() => {
        //   Hyphens();
        // }, 1000);
      }
    } catch (err) {
      console.log(err, "Error while Update");
      setIsLoading(false);
      if (err) {
        setSnackbar({
          open: true,
          severity: "error",
          message: err.response.data.error,
        });
      }
    }
  };

  const replaceSoftHyphens = (text) => {
    return text.replace(/\&shy;/g, "-");
  };

  // For PDF Generation
  // const generatePDF = async () => {
  //   // Add the allowTaint and useCORS options
  //   try {
  //     setIsLoading(true);
  //     setPdfSize(true);
  //     pdfContainerRef.current.style.width = "267px";
  //     const containerWidth = pdfContainerRef.current.clientWidth;
  //     const containerHeight = pdfContainerRef.current.clientHeight;
  //     const canvas = await html2canvas(pdfContainerRef.current, {
  //       allowTaint: true,
  //       useCORS: true,
  //       scale: 4,
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const MyDocument = () => (
  //       <Document>
  //         {/* <Page size="A4" style={styles.page}> */}
  //         <Page size={{ width: 267, height: 1062 }} >
  //           {/* Use the stored image URI */}
  //           <Image src={imgData} style={styles.pdfImage} />
  //           <Text style={{ ...styles.heading, marginBottom: "10px" }}>
  //             {removeHtmlTags(body.heading1)}
  //           </Text>
  //           <View
  //             style={{
  //               flexDirection: "row",
  //               alignItems: "center",
  //               // height:'130px'
  //             }}
  //           >
  //             <View style={{ width: "35%" }}>
  //               <Image
  //                 style={{
  //                   marginRight: "10px",
  //                   // width:'60px'
  //                 }}
  //                 src={body.imageURL1}
  //               />
  //               <Text
  //                 className="chat-gpt"
  //                 style={{
  //                   ...styles.subheading,
  //                   borderBottom: "1px solid #001b49",
  //                   paddingBottom: "5px",
  //                 }}
  //               >
  //                 {body.authorC5}
  //                 {/* {removeHtmlTags(body.authorC5)} */}
  //                 {/* {removeHtmlTags(data.c5.author_name)} */}
  //               </Text>
  //             </View>
  //             <View style={{ width: "65%" }}>
  //               <Text style={styles.fonts}>
  //                 {removeHtmlTags(body.body1.slice(0, 298))}
  //                 {/* {removeHtmlTags(body.body1)} */}
  //               </Text>
  //             </View>
  //           </View>
  //           <Text style={styles.fonts}>
  //             {removeHtmlTags(body.body1.substring(298))}
  //           </Text>
  //           <Text style={{ ...styles.heading, margin: "10px 0" }}>
  //             {removeHtmlTags(body.heading2)}
  //           </Text>
  //           <Text style={styles.fonts}>{removeHtmlTags(body.body2)}</Text>
  //           {/* <Image /> */}
  //           {/* Add more Text components or other content here */}
  //         </Page>
  //       </Document>
  //     );
  //     const blob = await pdf(<MyDocument />).toBlob(); // Creating the blob for a pdf file
  //     saveAs(blob, "modified_pdf.pdf"); // Automatically Saving or Downloading the file
  //     return blob;
  //   } catch (error) {
  //     console.log(error, "Hi I am PDF Error");
  //   }
  // };

  // const generatePDF = async () => {
  //   try {
  //     const containerWidth = pdfContainerRef.current.clientWidth;
  //     const containerHeight = pdfContainerRef.current.clientHeight;

  //     const dataUrl = await htmlToImage.toPng(
  //       document.getElementById("pdfContainer"),
  //       { quality: 1.0 }
  //     );

  //     // Create a link element to trigger the download
  //     const link = document.createElement('a');
  //     link.download = 'my-image-name.jpeg'; // Set the desired file name
  //     link.href = dataUrl;

  //     // Trigger a click on the link to start the download
  //     link.click();

  //     const MyDocument = () => (
  //       <Document dpi={300}>
  //         <Page size={{ width: 267, height: containerHeight }}>
  //           {/* Use the stored image URI */}
  //           <View>
  //           <Image src={dataUrl} renderMode="svg" quality={1.0} />
  //           </View>
  //           {/* Add more Text components or other content here */}
  //         </Page>
  //       </Document>
  //     );

  //     const blob = await pdf(<MyDocument />).toBlob(); // Creating the blob for a pdf file
  //     // saveAs(blob, "modified_pdf.pdf"); // Automatically Saving or Downloading the file
  //     return blob;
  //   } catch (error) {
  //     // Handle errors if any
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  // const generatePDF = async () => {
  //   const node = document.getElementById("pdfContainer");
  //   try {
  //     const dataUrl = await domToImage.toPng(node, {
  //       allowTaint: true,
  //       useCORS: true,
  //       scale: 10,
  //     });
  //     // const link = document.createElement("a");
  //     // link.download = "my-image-name.jpeg"; // Set the desired file name
  //     // link.href = dataUrl;
  //     // // Trigger a click on the link to start the download
  //     // link.click();
  //     // const MyDocument = () => (
  //     //   <Document>
  //     //     {/* <Page size="A4" style={styles.page}> */}
  //     //     <Page size={{ width: 267, height: 1062 }}>
  //     //       <Image src={dataUrl} style={styles.pdfImage} />
  //     //     </Page>
  //     //   </Document>
  //     // );
  //     // const blob = await pdf(<MyDocument />).toBlob();
  //     // saveAs(blob, "modified_pdf.pdf");

  //     return dataUrl;
  //   } catch (error) {
  //     console.error("Error generating image:", error);
  //   }
  // };

  // const generatePDF = async () => {
  //   // Add the allowTaint and useCORS options
  //   setIsLoading(true);
  //   setPdfSize(true);
  //       const containerWidth = pdfContainerRef.current.clientWidth;
  //   const containerHeight = pdfContainerRef.current.clientHeight;
  //   pdfContainerRef.current.style.width = "215px";
  //   const canvas = await html2canvas(pdfContainerRef.current, {
  //     allowTaint: true,
  //     useCORS: true,
  //     scale: 4,
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   const MyDocument = () => (
  //     <Document>
  //       {/* <Page size="A4" style={styles.page}> */}
  //       <Page size={{ width: containerWidth, height: containerHeight }}
  //       // style={styles.page}
  //       >
  //         {/* Use the stored image URI */}
  //         <Image src={imgData} style={styles.pdfImage} />
  //         {/* Add more Text components or other content here */}
  //       </Page>
  //     </Document>
  //   );

  //   const blob = await pdf(<MyDocument />).toBlob(); // Creating the blob for a pdf file
  //   saveAs(blob, "modified_pdf.pdf"); // Automatically Saving or Downloading the file
  //   return blob;
  // };
  var scale = 4;
  const generatePDF = async () => {
    const containerWidth = pdfContainerRef.current.clientWidth;
    const containerHeight = pdfContainerRef.current.clientHeight - 12;
    // console.log(containerHeight, 'hello')
    const node = document.getElementById("pdfContainer");

    try {
      const dataUrl = await domToImage.toPng(node, {
        allowTaint: true,
        useCORS: true,
        scale: 10,
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
        },
      });

      // Convert base64 to ArrayBuffer
      const byteCharacters = atob(dataUrl.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link and trigger a click on it to start the download
      // const link = document.createElement("a");
      // link.download = "my-image-name.jpeg";
      // link.href = url;
      // link.click();

      // Clean up by revoking the URL
      URL.revokeObjectURL(url);
      // Return the Blob instead of the data URL
      const MyDocument = () => (
        <Document>
          <Page
            size={{ width: containerWidth, height: containerHeight }}
            // style={styles.page}
          >
            {/* Use the stored image URI */}
            <Image
              src={dataUrl}
              style={{ width: containerWidth, height: containerHeight }}
            />
          </Page>
        </Document>
      );

      const blob1 = await pdf(<MyDocument />).toBlob(); // Creating the blob for a pdf file
      saveAs(blob1, "modified_pdf.pdf"); // Automatically Saving or Downloading the file

      return blob1;
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const GetItem = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(GetItem);

  // useEffect(() => {
  //   getData();
  //   const quillEditor = window.Quill && window.Quill.find('.editor-input.descript.task');
  //   if (quillEditor) {
  //     quillEditor.on('text-change', (delta, oldDelta, source) => {
  //       if (source === 'user') {
  //         const value1 = quillEditor.getText();
  //         const databody = value1.replace(/\s/g, `&nbsp;`);
  //         const hyphen = databody.replace(/-/g, "\u2011");
  //         // Replace question marks only if they are not followed by a space
  //         const updatedValue = hyphen.replace(/\?(?!\s)/g, "\u003F ");
  //         quillEditor.setText(updatedValue);

  //         // Move the cursor to the end of the editor
  //         quillEditor.setSelection(quillEditor.getLength());
  //       }
  //     });
  //   }
  // }, []);

  function hyphenateText1(Ref, id) {
    if (Ref.current) {
      const containersa = Ref.current;
      const container = containersa.querySelector(`${id}`);
      console.log(container, "hello container");

      const text = container.innerHTML;
      const databody = text.replace(/&nbsp;/g, ` `);

      // Define an async function to use await
      const hyphenateText = async () => {
        const hyphenatedText = await hyphenate(databody);
        container.innerHTML = hyphenatedText;
        console.log(hyphenatedText);
      };
    }
  }

  useEffect(() => {
    getData();
    // setTimeout(() => {
    //   if (pdfContainerRef.current) {
    //     const containersa = pdfContainerRef.current;
    //     const container = containersa.querySelector('#chat2 p');
    //     console.log(container, 'hello container');

    //     const text = container.innerHTML;
    //     const databody = text.replace(/&nbsp;/g, ` `);

    //     // Define an async function to use await
    //     const hyphenateText = async () => {
    //         const hyphenatedText = await hyphenate(databody);
    //         container.innerHTML = hyphenatedText;
    //         console.log(hyphenatedText);
    //     };

    // }
    // }, 3000);

    const quillEditor =
      window.Quill && window.Quill.find(".editor-input.descript.task");
    if (quillEditor) {
      quillEditor.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const value1 = quillEditor.getText();
          const databody = value1.replace(/\s/g, `&nbsp;`);
          const hyphen = databody.replace(/-/g, "\u2011");
          // Replace question marks only if they are not followed by a space
          const updatedValue = hyphen.replace(/\?(?!\s)/g, "\u003F ");
          quillEditor.setText(updatedValue);

          // Move the cursor to the end of the editor
          quillEditor.setSelection(quillEditor.getLength());
        }
      });
    }
  }, []);

  const insertHyphens = (text, container) => {
    const words = text.split(/(\s|&nbsp;)/);
    const containerWidth = container.offsetWidth;

    const hyphenatedWords = words.map((word) => {
      const hasNonBreakingSpaces =
        word.startsWith("&nbsp;") || word.endsWith("&nbsp;");
      //const word = word.replace(/&nbsp;/g, " ");

      if (!hasNonBreakingSpaces) {
        const wordWidth = calculateWordWidth(word, container);

        if (wordWidth > 25) {
          return word.split("").join("\u00AD"); // Unicode soft hyphen
        }
      }
      return word;
    });
    return hyphenatedWords.join("");
  };

  const calculateWordWidth = (word, container) => {
    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.style.whiteSpace = "nowrap";
    tempElement.innerHTML = word;
    container.appendChild(tempElement);
    const wordWidth = tempElement.offsetWidth;
    container.removeChild(tempElement);
    return wordWidth;
  };
  const apiKey = "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc";

  return (
    <MainCard
      className="showVersions"
      title="View AI Data"
      {...(Details.role !== "3" &&
        data?.status === 0 && {
          approve: handleApprove,
          buttontitle1: "Approve",
          approveColor: "#00C853",
          disapprove: handleDisApprove,
          buttontitle2: "Disapprove",
          disapprovecolor: "#F44336",
        })}
    >
      <Popup
        style={{ height: "600px" }}
        open={popupOpen}
        // onClose={handlePopupClose}
        title="Please enter the reason for Disapprove"
        content={
          <>
            <Formik
              initialValues={{
                message: "",
              }}
              validationSchema={Yup.object().shape({
                message: Yup.string().required("Message is required"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  if (values.message !== null || undefined) {
                    ApprovalStatus(2, values.message);
                  }
                  if (scriptedRef.current) {
                    setStatus({ success: true });
                    setSubmitting(false);
                  }
                } catch (err) {
                  console.error(err);
                  if (scriptedRef.current) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }) => (
                <form
                  className={classes.forms}
                  noValidate
                  onSubmit={handleSubmit}
                  {...others}
                  autoComplete="off"
                >
                  {/* Email */}
                  <FormControl
                    fullWidth
                    error={Boolean(touched.message && errors.message)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-message">
                      Reason
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email"
                      type="text"
                      value={values.message}
                      name="message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Reason"
                      inputProps={{}}
                    />
                    {touched.message && errors.message && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}

                  <Box sx={{ mt: 1 }} style={{ textAlign: "center" }}>
                    {/* <AnimateButton> */}
                    <Button
                      size="large"
                      variant="contained"
                      color="secondary"
                      style={{ background: "#F44336", marginRight: 10 }}
                      onClick={() => setPopupOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      style={{ background: "#15223F" }}
                    >
                      Disapprove
                    </Button>
                    {/* </AnimateButton> */}
                  </Box>
                </form>
              )}
            </Formik>
          </>
        }
      />
      <>
        <div className="main-header none">
          <div className="main-title">
            <div className="title">
              <h3 className={classes.h3}>PHYSICIAN WEEKLY</h3>
              <h2>
                <span>L</span>IVER <span>C</span>ANCER
              </h2>
            </div>
            <div className="side-bt-content">
              <p
                className={classes.p}
                style={{ margin: 0, fontWeight: 700, fontSize: 17 }}
              >
                June 2023
              </p>
              <p
                className={classes.p}
                style={{ margin: 0, fontWeight: 700, fontSize: 17 }}
              >
                Vol. IV • Issue No. 6
              </p>
            </div>
          </div>
          <div className="side-info">
            <p
              className={classes.p}
              style={{
                backgroundImage: "url(top-back.png)",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: 15,
                color: "#22553f",
                textAlign: "left",
                paddingLeft: "4em",
                paddingTop: 40,
                fontFamily: "Korolev",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 22 }}>
                PHYSICIAN’S WEEKLY EDITORIAL BOARD:
              </span>
              <br />
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                Dr. Linda Girgis (Editor-in-Chief),
                <br />
                Dr. Jasminka Criley, Dr. Umbereen Nehal,
                <br />
                Dr. Alex McDonald
              </span>
            </p>
            <p
              className={classes.p}
              style={{
                textAlign: "left",
                paddingLeft: "1.5em",
                margin: 0,
                paddingBottom: 18,
              }}
            >
              <a
                href="www.physiciansweekly.com"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontFamily: '"Korolev"',
                  fontSize: 22,
                }}
              >
                www.physiciansweekly.com
              </a>
            </p>
          </div>
        </div>
        <div className="main-section">
          <div className="col-1 none">
            <img className={classes.img} src="From-the-Editor.png" alt="" />
            <div className="col_1_content secton_cont">
              <h2>
                How the Concept of Resiliency Training in Medicine Is a Fallacy
              </h2>
              <p className={`${classes.p} auth-img`}>
                <img className={classes.img} src="doc-3.jpg" alt="" />
                By
                <br />
                <strong>Linda Girgis, MD</strong>Physician’s Weekly
                Editor-in-Chief
              </p>
              <p className={`${classes.p} first-letter`}>
                It seems like resiliency training is being offered as a fix for
                burnout. Some institutions even mandate it. However, they fail
                to realize that our whole education necessitated resiliency. If
                you weren’t resilient, you didn’t make it. What other profession
                makes you stay in the hospital for days at a time and miss meals
                because you were taking care of a dying patient in the ED? Then,
                when you graduate, you are responsible for everything, even if
                someone else made a mistake. Resiliency training does not talk
                about the grueling hours or dealing with grief. Furthermore,
                these courses fail to realize that doctors are burnt out because
                the system is dysfunctional, not because we’re weak.
              </p>
              <p className={classes.p}>
                After going through all that, it would make sense that we would
                get paid easily, right? But it is often a series of jumping
                through hoops to get paid, and sometimes we are forced to write
                it off. These are only a few of the ways in which the system is
                failing us.
              </p>
              <h2>How can we address burnout in ourselves?</h2>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>
                  › Recognize it for what it is.
                </strong>
                You’re not drained because you’re weak. You’re drained because
                you went through years of training and the healthcare system
                does not enable you to practice effectively.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>› Learn to say no.</strong>
                Every committee wants doctors on it. Is your presence there
                really going to change anything or is it just a time drain? ›
                Take sick days and vacation time. We need to take better care of
                ourselves. No one else is going to.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>
                  › Find enjoyment outside of our careers.
                </strong>
                I was a doctor for years before I could say what I like to do
                for fun. We all need something that takes our minds off
                medicine.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>
                  › Stop taking work home.
                </strong>
                As a doctor in private practice, I struggle with this, but I do
                know the days I leave it all at the office are much more
                relaxed.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>
                  › Stop taking work home.
                </strong>
                As a doctor in private practice, I struggle with this, but I do
                know the days I leave it all at the office are much more
                relaxed.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>
                  › Consider career options.
                </strong>
                In medicine, there are many practice models and career options.
                It’s worth knowing what’s available.
              </p>
              <p className={classes.p}>
                <strong style={{ color: "#001b49" }}>› Run for office.</strong>
                Politicians make many decisions regarding healthcare. We need
                more doctors in this arena who understand the issues. Until
                someone addresses the systematic dysfunction, we must continue
                to push back, but that is exhausting. We need to start taking
                better care of ourselves. ◗ PW
              </p>
              <p className={classes.p}>
                ›<strong style={{ color: "#001b49" }}> Run for office.</strong>
                Politicians make many decisions regarding healthcare. We need
                more doctors in this arena who understand the issues. Until
                someone addresses the systematic dysfunction, we must continue
                to push back, but that is exhausting. We need to start taking
                better care of ourselves. ◗ PW
              </p>
              <div className="bar-code">
                <div className="bar-content">
                  <p className={`${classes.p} footer-scan`}>
                    Scan the QR code to hear more from Dr. Girgis and all our
                    Doctor’s Voice bloggers!
                  </p>
                </div>
                <div className="barcode_img">
                  <img className={classes.img} src="02.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-2 none">
            <div className="col_2_data">
              <div>
                <div className="individual_section">
                  <div className="ind_mid_content">
                    <h3 className={classes.h3}>
                      Individualize
                      <br />
                      Hepatocellular
                      <br />
                      Carcinoma
                      <br />
                      Treatment
                      <br />
                      With a<br />
                      Multidisciplinary
                      <br />
                      Team
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mid-cols">
                <div className="col_2_1">
                  <div className="col_2_1_content">
                    <p className={`${classes.p} auth-img`}>
                      <img className={classes.img} src="doc-1.jpg" alt="" />
                      <span>
                        Contributor
                        <br />
                        <strong>Nadine AbiJaoudeh, MD, FSIR, CCRP</strong>
                        <span>
                          Professor of Radiology Chief of Interventional
                          Radiology Director of Clinical Research Chair of
                          Diversity Committee Department of Radiological
                          Sciences University of California Irvine
                        </span>
                      </span>
                    </p>
                    <p className={`${classes.p} first-letter`}>
                      The latest guidelines from multiple professional
                      societies—including NCCN, ASCO, the Barcelona Clinic, and
                      the American Association for the Study of Liver Diseases—
                      recommend strongly that patients with hepatocellular
                      carcinoma (HCC) be evaluated by a multidisciplinary team.
                      “When you have a hammer, everything is a nail,” explains
                      Nadine Abi-Jaoudeh, MD, FSIR, CCRP. “The multidisciplinary
                      approach allows patients access to all the specialists who
                      might be involved in the management of HCC, therefore
                      optimizing their chances to get the best treatment. This
                      has been shown in published studies.” Dr. Abi-Jaoudeh
                      notes that tumor board meetings—when treatment plans for
                      new and complex cancer cases are discussed by
                      multidisciplinary teams to decide, as a group, on the best
                      treatment plans for a patient—allow for previously
                      unconsidered solutions to become apparent.
                    </p>
                    <h2>Gathering Input from Every Specialty</h2>
                    <p className={classes.p}>
                      "The interactions of multidisciplinary
                      <br />
                      teams vary,” she adds. “However,
                      <br />
                      the best multidisciplinary interac-
                      <br />
                      -tions consist of input from every
                      <br />
                      potentially involved specialty.
                      <br />
                      Medical knowledge is growing at
                      <br />
                      an exponential level, and it is not
                      <br />
                      possible to stay up to date
                      <br />
                      on new developments in
                      <br />
                      other specialty literature
                      <br />
                      to the extent that the
                      <br />
                      specialists themselves know it.
                      <br />
                      This is why having those
                      <br />
                      interactions and discus
                    </p>
                  </div>
                </div>
                <div className="col_2_2">
                  <div className="col_2__2_content">
                    <p className={classes.p}>
                      sions is so important. It is a teaching and learning
                      experience as we find out about the latest studies from
                      each other’s specialties. It is also a way to narrow down
                      gaps in the literature.” As an interventional radiologist,
                      Dr. AbiJaoudeh notes that “radiology’s review of the
                      imaging can result in changes in management, because they
                      can point to a subtle finding that would change operative
                      risk or disease features that can change risk assessment.
                      For example, an HCC can be well circumscribed or
                      infiltrative, and for the same size lesion, infiltrative
                      —which is not always described in the report —is more
                      aggressive.” The multidisciplinary team of which Dr.
                      Abi-Jaoudeh is a member communicates well, she says. The
                      collegial environment includes a shared knowledge that all
                      members have a role and that both patients and clinicians
                      will be treated with respect. “The main goal is to provide
                      the patient with the best outcome,” she adds. “We are
                      patient-centric, and things fall into place as a result.”
                    </p>
                    <h3 className={classes.h3}>
                      The Importance of Individualized Care
                    </h3>
                    <p className={classes.p}>
                      he role of the multidisciplinary team is of great
                      importance in treating patients with advanced HCC due to
                      the particular importance of individualizing care for this
                      patient population. “There are specific characteristics
                      unique to individuals with advanced HCC that make them
                      better suited for one therapy versus
                      <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; another,” says
                      Dr. Abi-Jaoudeh. “<br />{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HCC staging is very
                      broad.
                      <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Intermediate and
                      advanced stages <br /> &nbsp;&nbsp;&nbsp; can be divided
                      into multiple categories &nbsp;&nbsp;&nbsp;and several
                      clinical factors
                      <br /> &nbsp;&nbsp;&nbsp; come into &nbsp;&nbsp;play. Two
                      patients
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;can
                      be classified as intermediate
                      <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                      &nbsp; &nbsp; stage but have different
                      <br />{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disease
                      burdens. Also, one <br />{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;patient
                      mayhave underlying
                      <br />{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;portal
                    </p>
                  </div>
                </div>
                <div className="col_2_3">
                  <div className="key-takeys">
                    <img className={classes.img} src="key.png" />
                    <h4>KEY TAKEAWAYS</h4>
                    <div className="space-1">
                      <p className={`${classes.p} numbers`}>1</p>
                      <p className={`${classes.p} side-num-cont`}>
                        Subtle changes in hepatocellular carcinoma (HCC) can
                        influence operative risk or disease features, which can
                        change risk assessment.{" "}
                      </p>
                    </div>
                    <div className="space-1">
                      <p className={`${classes.p} numbers`}>2</p>
                      <p className={`${classes.p} side-num-cont`}>
                        The multidisciplinary team enables attention to these
                        subtle changes, which can result in more individualized
                        care for this patient population.{" "}
                      </p>
                    </div>
                    <div className="space-1">
                      <p className={`${classes.p} numbers`}>3</p>
                      <p className={`${classes.p} side-num-cont`}>
                        To further individualize care, clinicians can utilize
                        tools such as the ChildPugh score and alpha-fetoprotein
                        tumor scores.{" "}
                      </p>
                    </div>
                  </div>
                  <p className={classes.p}>
                    hypertension, or varices that are prone to bleeding and not
                    easily banded. This is why assessing each patient
                    individually and discussing cases at tumor boards are
                    essential.” It is these discussions at tumor board meetings
                    that help ensure care is individualized as opposed to being
                    based on more “black and white” rules that may leave some
                    patients without care that they could have benefited from,
                    Dr. Abi-Jaoudeh explains. “This is why patients who are not
                    discussed at tumor boards have lower survival.” To further
                    ensure individualized care, Dr. Abi-Jaoudeh utilizes tools
                    that include the Child-Pugh score. She notes that patients
                    with a very high score (ie, 8 or 9) are sometimes placed on
                    immunotherapy alone, whereas those with better functional
                    status and a good Child-Pugh score are often placed on
                    trials, if eligible, or a combination of locoregional and
                    systemic therapies. “The tumor board and I follow the
                    Barcelona Clinic Liver Cancer guidelines and use Child-Pugh
                    and alpha-fetoprotein tumor scores to guide decisions,” Dr.
                    Abi-Jaoudeh says. ◗ PW
                  </p>
                </div>
                <div className="foter-img">
                  <div className="girl-img">
                    <img className={classes.img} src="1149568_202306-34.PNG" />
                  </div>
                  <img className={classes.img} src="footer-bar-code-img.png" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-3 none">
            <img className={classes.img} src="1149568_202306-3.png" alt="" />
            <div className="col_3_content col-3_section">
              <h2>
                What Physicians Should Do When They Make a Medication Error
              </h2>
              <p className={[classes.p, "first-letter"]}>
                Physicians, like all people, are not immune to error. Medical
                errors can occur at any point during patient care; one such
                error would be prescribing the wrong chemotherapy dose for a
                patient with liver cancer. A StatPearls article noted that
                between 7,000 and 9,000 people in the United States die annually
                due to medication errors, with cumulative costs of more than $40
                billion. These errors impact patient health and impose
                psychological and physical costs. Victims of medical error may
                develop a sense of mistrust with their physicians and the
                healthcare system in general. Given the wide range of
                medications available, prescription errors are common. The
                StatPearls article notes that prescription errors account for
                nearly half of all patient injuries related to medication
                errors, from prescribing the incorrect medication to the
                incorrect dose
              </p>
              <h2>Addressing Error-Prone Areas</h2>
              <p className={classes.p}>
                The medical field is characterized by an unfortunate culture of
                blame in which medical errors often lead to fines, licensure
                risks, and litigation, as well as shaming. Nonetheless,
                physicians have an ethical duty to immediately report medical
                errors. The Association of Managed Care Pharmacy asserts that
                physicians should not have to feel uneasy about either
                committing or reporting an error for fear of subjection to
                punitive action, suggesting that the healthcare community should
                rather concentrate on addressing error-prone areas of medication
                prescription and use. In other words, the healthcare community
                should ask why certain errors seem prone to recur and how the
                system can be changed to prevent future occurrences.
              </p>
              <p className={classes.p}>
                Nonetheless, the Association of American Medical Colleges (AAMC)
                suggests physicians provide complete disclosure after a
                medication error, including a discussion with the patient/
                family, timely reporting, and an evaluation of any consequences.
                The AAMC notes that any clinicians involved in the error receive
                emotional support. According to the AAMC, the aforementioned
                measures can spare hospitals, patients, and families years of
                arduous litigation
              </p>
              <p className={classes.p}>
                Naveed Saleh, MD, MS, says it would behoove physicians to adopt
                strategies that prevent errors entirely. First and foremost,
                physicians should tackle every prescription with the utmost
                care. Other recommendations include avoiding misreads and
                misinterpretations by employing electronic prescriptions and not
                using abbreviations, to sidestep handwriting legibility issues.
                Dr. Saleh also suggests noting precise dosages, specifying
                treatment duration, and supplying clear instructions.◗ PW
              </p>
              <div className="bar-code">
                <div className="bar-content">
                  <p className={[classes.p, "footer-scan"]}>
                    Scan the QR code for additional Business of Medicine
                    articles on medical claim denials, malpractice premiums, and
                    more!
                  </p>
                </div>
                <div className="barcode_img">
                  <img className={classes.img} src="05.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 ">
            <img
              className={[classes.img, "col-4-img"]}
              src="1149568_202306_Page_1_Image_0013.jpg"
              alt=""
            />
            {data?.status === 0 &&
              !edit.show &&
              Details.role !== "3" &&
              !approved && (
                <div style={{ textAlign: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    style={{
                      background: "#15223F",
                      padding: "6px 0px 6.1px 10px",
                      minWidth: "0px",
                      marginBottom: "10px",
                    }}
                    startIcon={<FaRegEdit style={{ fontSize: 15 }} />}
                    onClick={async () => {
                      // setEdit({ c5: true });
                      // setDisableApprove(true);
                      setEdit({ show: true, approveDisabled: true });
                      // setTimeout(() => {
                      //   Hyphens2();
                      // }, 100);
                      // setTimeout(() => {
                      //   Hyphens1();
                      // }, 120);
                    }}
                  />
                </div>
              )}

            {edit.show && !isLoading && (
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    size="large"
                    variant="contained"
                    style={{
                      background: "#C62828",
                      fontSize: "20px",
                      padding: "5px",
                      minWidth: "0px",
                      marginBottom: "7.1px",
                    }}
                    onClick={() => {
                      setValue(prevalue);
                      setEdit({ show: false, approveDisabled: false });
                      // setTimeout(() => {
                      //   Hyphens();
                      // }, 1000);
                    }}
                  >
                    <AiOutlineClose />
                  </Button>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    style={{
                      background: "#1d213e",
                      fontSize: "20px",
                      padding: "5px",
                      minWidth: "0px",
                      marginBottom: "7.1px",
                    }}
                  >
                    <BiSolidSave />
                  </Button>
                </div>

                <div
                  style={{
                    // backgroundColor: "#e9e9ea",
                    backgroundColor:
                      data.color === "#e0a600"
                        ? "#fbf4e8"
                        : data.color === "#a0251c"
                        ? "#f6eae3"
                        : data.color === "#22553f"
                        ? "#e9e9ea"
                        : "",
                    padding: "10px",
                  }}
                  className="ContentEditor"
                >
                  {/* <p className="column_data">
                    Please Enter the Data of{" "}
                    <span style={{ color: "#f44336" }}>C5</span>
                  </p> */}
                  <div className="editor">
                    {/* {data.c5.author_img !== "" && (
                      <TextField
                        id="outlined-required"
                        label="Author Name"
                        fullWidth
                        className="authorName"
                        value={value.author_name}
                        onChange={(e) => {
                          setValue({ ...value, author_name: e.target.value });
                        }}
                        // error={}
                        // helperText={}
                      />
                    )} */}
                    <Editor
                      apiKey={apiKey}
                      id="editorTitle1"
                      value={value.title}
                      init={{
                        menubar: false,
                        inline: true,
                        // content_style: `color: ${data.color}`
                        content_style: `#editorTitle1 { color: ${data.color}; }`, // Add a custom class and its style
                      }}
                      onEditorChange={(content, editor) => {
                        setValue({ ...value, title: content });
                      }}
                      style={{ color: data.color }}
                    />
                    {/* <ReactQuill
                      theme="bubble"
                      name="title"
                      value={value.title}
                      // value={`<h3>${value.title}</h3>`} // Wrap value.title in an "h3" tag
                      onChange={(newValue) => {
                        setValue({ ...value, title: newValue });
                      }}
                      formats={{ header: 3 }}
                      className="editor-input "
                      modules={modules}
                      placeholder="Please Enter Title *"
                      style={{ color: data.color }}
                    /> */}
                    <p
                      className={[
                        // classes.p,
                        "auth-img hello",
                      ]}
                      style={{
                        display:
                          data.c5.author_img === "" ||
                          data.c5.author_img === null ||
                          data.c5.author_img === undefined ||
                          dimensions?.firstImageWidth !== 69 ||
                          dimensions?.firstImageHeight !== 70
                            ? "none"
                            : "block",
                        pointerEvents: "none",
                        borderColor:
                          data.color === "#e0a600"
                            ? "#e0a600"
                            : data.color === "#a0251c"
                            ? "#a0251c"
                            : "",
                      }}
                    >
                      {/* <span style={{ width: "74px", height: "74px", display: "block"}}> */}
                      <span
                        style={{
                          width: "69px",
                          height: "70px",
                          display: "block",
                        }}
                      >
                        <img
                          height="67px"
                          className={classes.img}
                          // src={data?.c5?.author_img}
                          src={`${data?.c5?.author_img}`}
                          alt=""
                        />
                      </span>
                      <span
                        style={{
                          color:
                            data.color === "#e0a600"
                              ? "#e0a600"
                              : data.color === "#a0251c"
                              ? "#a0251c"
                              : "",
                        }}
                      >
                        <strong>{data?.c5?.author_name}</strong>
                      </span>
                    </p>

                    {/* <ReactQuill
                      theme="bubble"
                      name="body"
                      id="chat2"
                      value={value.body}
                      onChange={(newValue) => {
                        const value1 = newValue;
                        const updatedValue = value1
                          .replace(/\s/g, `&nbsp;`)
                          .replace(/-/g, "\u2011");
                        setValue({ ...value, body: updatedValue });
                      }}
                      className="editor-input descript  task"
                      modules={modules}
                      placeholder="Please Enter Description *"
                    /> */}
                    <Editor
                      apiKey={apiKey}
                      id="titles"
                      className="editor-input descript  task"
                      // className="editorss"
                      value={value.body}
                      init={{
                        menubar: false,
                        inline: true,
                        // content_style: `color: ${data.color}`
                        // content_style: `.editorss { color: ${data.color}; }` // Add a custom class and its style
                      }}
                      onEditorChange={(content, editor) => {
                        setValue({ ...value, body: content });
                      }}
                    />
                  </div>

                  {/* <p className="column_data">
                    Please Enter the Data of{" "}
                    <span style={{ color: "#f44336" }}>C6</span>
                  </p> */}
                  <div className="editor">
                    {/* {data.c6.author_img !== "" && (
                      <TextField
                        id="outlined-required"
                        label="Author Name"
                        fullWidth
                        className="authorName"
                        value={value.author_nameC6}
                        onChange={(e) => {
                          setValue({
                            ...value,
                            author_nameC6: e.target.value,
                          });
                        }}
                        // error={}
                        // helperText={}
                      />
                    )} */}
                    {/* <ReactQuill
                      theme="bubble"
                      name="title"
                      value={value.titleC6}
                      onChange={(newValue) => {
                        setValue({ ...value, titleC6: newValue });
                      }}
                      className="editor-input"
                      modules={modules}
                      placeholder="Please Enter Title *"
                      style={{ color: data.color, margin: "5px 0" }}

                      // style={{ color: "#22553f" }}
                    /> */}
                    <Editor
                      apiKey={apiKey}
                      id="editorTitle2"
                      value={value.titleC6}
                      init={{
                        menubar: false,
                        inline: true,
                        // content_style: `color: ${data.color}`
                        content_style: `#editorTitle2 { color: ${data.color}; }`, // Add a custom class and its style
                      }}
                      onEditorChange={(content, editor) => {
                        setValue({ ...value, titleC6: content });
                      }}
                      style={{ color: data.color }}
                    />
                    {/* <ReactQuill
                      id="chat1"
                      theme="bubble"
                      name="body"
                      value={value.bodyC6}
                      onChange={(newValue) => {
                        const value1 = newValue;
                        const updatedValue = value1
                          .replace(/\s/g, `&nbsp;`)
                          .replace(/-/g, "\u2011");
                        setValue({ ...value, bodyC6: updatedValue });
                      }}
                      className="editor-input"
                      modules={modules}
                      placeholder="Please Enter Description *"
                    /> */}
                    <p
                      className={[
                        // classes.p,
                        "auth-img hello",
                      ]}
                      style={{
                        display:
                          data.c6.author_img === "" ||
                          data.c6.author_img === null ||
                          data.c6.author_img === undefined ||
                          dimensions?.secondImagewidth !== 69 ||
                          dimensions?.SecondImageheight !== 70
                            ? "none"
                            : "block",
                        pointerEvents: "none",
                        borderColor:
                          data.color === "#e0a600"
                            ? "#e0a600"
                            : data.color === "#a0251c"
                            ? "#a0251c"
                            : "",
                      }}
                    >
                      {/* <span style={{ width: "74px", height: "74px", display: "block"}}> */}
                      <span
                        style={{
                          width: "69px",
                          height: "70px",
                          display: "block",
                        }}
                      >
                        <img
                          height="67px"
                          className={classes.img}
                          // src={data?.c5?.author_img}
                          src={`${data?.c6?.author_img}`}
                          alt=""
                        />
                      </span>
                      <span
                        style={{
                          color:
                            data.color === "#e0a600"
                              ? "#e0a600"
                              : data.color === "#a0251c"
                              ? "#a0251c"
                              : "",
                        }}
                      >
                        <strong>{data?.c6?.author_name}</strong>
                      </span>
                    </p>
                    <Editor
                      apiKey={apiKey}
                      id="titles1"
                      className="editor-input descript  task"
                      // className="editorss"
                      value={value.bodyC6}
                      init={{
                        menubar: false,
                        inline: true,
                        // content_style: `color: ${data.color}`
                        // content_style: `.editorss { color: ${data.color}; }` // Add a custom class and its style
                      }}
                      onEditorChange={(content, editor) => {
                        setValue({ ...value, bodyC6: content });
                      }}
                    />
                  </div>
                </div>
              </form>
            )}

            {!edit.show && !isLoading && (
              // <div
              //   className="col-data"
              //   ref={pdfContainerRef}
              //   style={styles.consistentSize}
              // >
              //   <h3
              //     className={classes.h3}
              //     style={{ color: data?.color }}
              //     dangerouslySetInnerHTML={{ __html: data?.c5?.title }}
              //   >
              //     {/* Adjuvant Combination Chemotherapy Improves HCC Survival */}
              //     {/* {data?.c5?.title} */}
              //     {/* <span  dangerouslySetInnerHTML={{ __html: data?.c5?.title }}></span> */}
              //   </h3>
              //   <div className="helloContent">

              //   <p
              //     className={[
              //       // classes.p,
              //       "auth-img hello",
              //     ]}
              //     style={{
              //       display: data.c5.author_img === "" ? "none" : "block",
              //     }}
              //   >
              //     <img
              //       className={classes.img}
              //       src={data?.c5?.author_img}
              //       alt=""
              //     />
              //     <span>
              //       <strong>
              //         {data?.c5?.author_name}
              //         {/* Pierce Chow, MBBS, PhD */}
              //       </strong>
              //     </span>
              //   </p>
              //   <p
              //     id="chat-gpt"
              //     className={`${classes.p} chat-gpt`}
              //     dangerouslySetInnerHTML={{ __html: data?.c5?.body }}
              //     // dangerouslySetInnerHTML={{ __html: body }}
              //   >
              //     {/* For patients with high-risk hepatocellular carcinoma (HCC), */}

              //     {/* {data?.c5?.body} */}
              //   </p>
              //   </div>

              //   <h3
              //     className={classes.h3}
              //     style={{ color: data?.color }}
              //     dangerouslySetInnerHTML={{ __html: data?.c6?.title }}
              //   >
              //     {/* ChatGPT Provides Helpful Responses for Liver Cancer */}
              //     {/* {data?.c6?.title} */}
              //   </h3>
              //   <p
              //     id="chat-gpt"
              //     // className={classes.p}
              //     className={`${classes.p} chat-gpt`}
              //     dangerouslySetInnerHTML={{ __html: data?.c6?.body }}
              //   />
              //     {/* ChatGPT provides easy-tounderstand information about basic knowledge, */}
              //     {/* {data?.c6?.body} */}
              //   {/* </p> */}
              // </div>
              <div
                style={{
                  // backgroundColor: "#e9e9ea",
                  backgroundColor:
                    data.color === "#e0a600"
                      ? "#fbf4e8"
                      : data.color === "#a0251c"
                      ? "#f6eae3"
                      : data.color === "#22553f"
                      ? "#e9e9ea"
                      : "",
                  padding: "10px",
                  // ...styles.consistentSize,
                }}
                ref={pdfContainerRef}
                id="pdfContainer"
                // style={styles.consistentSize}
              >
                <div className="editor">
                  {/* <ReactQuill
                    theme="bubble"
                    name="title"
                    readOnly={true}
                    value={value.title}
                    onChange={(newValue) => {
                      setValue({ ...value, title: newValue });
                    }}
                    formats={{ header: 3 }}
                    className="editor-input "
                    modules={modules}
                    placeholder="Please Enter Title *"
                    style={{ color: data.color }}
                  /> */}
                  <Editor
                    apiKey={apiKey}
                    id="editorTitle1"
                    value={value.title}
                    disabled
                    init={{
                      menubar: false,
                      inline: true,
                      readonly: true,
                      // content_style: `color: ${data.color}`
                      content_style: `#editorTitle1 { color: ${data.color}; }`, // Add a custom class and its style
                    }}
                    onEditorChange={(content, editor) => {
                      setValue({ ...value, title: content });
                    }}
                    style={{ color: data.color }}
                  />
                  {data.c5.author_img === "" ||
                  data.c5.author_img === null ||
                  data.c5.author_img === undefined ? null : (
                    <p
                      className={[
                        // classes.p,
                        "auth-img hello",
                      ]}
                      style={{
                        display:
                          data.c5.author_img === "" ||
                          data.c5.author_img === null ||
                          data.c5.author_img === undefined ||
                          dimensions?.firstImageWidth !== 69 ||
                          dimensions?.firstImageHeight !== 70
                            ? "none"
                            : "block",
                        // display: data.c5.author_img === "" && data.c5.author_name === "" && data.c5.author_name === undefined  ? "none" : "block",
                        pointerEvents: "none",
                        borderColor:
                          data.color === "#e0a600"
                            ? "#e0a600"
                            : data.color === "#a0251c"
                            ? "#a0251c"
                            : "",
                      }}
                    >
                      {/* <span style={{ width: "74px", height: "74px", display: "block"}}> */}
                      <span
                        style={{
                          width: "69px",
                          height: "70px",
                          display: "block",
                        }}
                      >
                        <img
                          height="67px"
                          className={classes.img}
                          // src={data?.c5?.author_img}
                          // src={`https://www.physiciansweekly.com/wp-content/uploads/${data?.c5?.author_img}`}
                          src={`${data?.c5?.author_img}`}
                          alt=""
                          onLoad={handleImageLoad1}
                        />
                      </span>
                      <span
                        style={{
                          color:
                            data.color === "#e0a600"
                              ? "#e0a600"
                              : data.color === "#a0251c"
                              ? "#a0251c"
                              : "",
                        }}
                      >
                        <strong>{data?.c5?.author_name}</strong>
                      </span>
                    </p>
                  )}

                  {/* <ReactQuill
                    theme="bubble"
                    name="body"
                    id="chat2"
                    readOnly={true}
                    // value={removeHtmlTags(value.body)}
                    value={value.body}
                    // value={`<pre>${value.body}</pre>`}
                    onChange={(newValue) => {
                      const value1 = newValue;
                      const updatedValue = value1
                        .replace(/\s/g, `&nbsp;`)
                        .replace(/-/g, "\u2011");
                      setValue({ ...value, body: updatedValue });
                    }}
                    className="editor-input descript chat-gpt chat2"
                    modules={modules}
                    placeholder="Please Enter Description *"
                  /> */}
                  <Editor
                    apiKey={apiKey}
                    id="titles"
                    className="editor-input descript  task"
                    // className="editorss"
                    value={value.body}
                    init={{
                      menubar: false,
                      inline: true,
                      // content_style: `color: ${data.color}`
                      // content_style: `.editorss { color: ${data.color}; }` // Add a custom class and its style
                      readonly: true,
                    }}
                    disabled
                    onEditorChange={(content, editor) => {
                      setValue({ ...value, body: content });
                    }}
                  />
                </div>
                <div className="editor">
                  {/* <ReactQuill
                    theme="bubble"
                    name="title"
                    value={value.titleC6}
                    onChange={(newValue) => {
                      setValue({ ...value, titleC6: newValue });
                    }}
                    className="editor-input"
                    modules={modules}
                    readOnly={true}
                    placeholder="Please Enter Title *"
                    style={{ color: data.color, margin: "5px 0" }}
                  /> */}
                  <Editor
                    disabled
                    apiKey={apiKey}
                    id="editorTitle2"
                    value={value.titleC6}
                    init={{
                      menubar: false,
                      inline: true,
                      // content_style: `color: ${data.color}`
                      content_style: `#editorTitle2 { color: ${data.color}; }`, // Add a custom class and its style
                    }}
                    onEditorChange={(content, editor) => {
                      setValue({ ...value, titleC6: content });
                    }}
                    style={{ color: data.color }}
                  />
                  {/* <ReactQuill
                    id="chat1"
                    theme="bubble"
                    name="body"
                    value={value.bodyC6}
                    readOnly={true}
                    onChange={(newValue) => {
                      const value1 = newValue;
                      const updatedValue = value1
                        .replace(/\s/g, `&nbsp;`)
                        .replace(/-/g, "\u2011");
                      setValue({ ...value, bodyC6: updatedValue });
                    }}
                    className="editor-input descript chat-gpt"
                    modules={modules}
                    placeholder="Please Enter Description *"
                  /> */}
                  {data.c6.author_img === "" ||
                  data.c6.author_img === null ||
                  data.c6.author_img === undefined ? null : (
                    <p
                      className={[
                        // classes.p,
                        "auth-img hello",
                      ]}
                      style={{
                        display:
                          data.c6.author_img === "" ||
                          data.c6.author_img === null ||
                          data.c6.author_img === undefined ||
                          dimensions?.secondImagewidth !== 69 ||
                          dimensions?.SecondImageheight !== 70
                            ? "none"
                            : "block",
                        pointerEvents: "none",
                        borderColor:
                          data.color === "#e0a600"
                            ? "#e0a600"
                            : data.color === "#a0251c"
                            ? "#a0251c"
                            : "",
                      }}
                    >
                      {/* <span style={{ width: "74px", height: "74px", display: "block"}}> */}
                      <span
                        style={{
                          width: "69px",
                          height: "70px",
                          display: "block",
                        }}
                      >
                        <img
                          height="67px"
                          className={classes.img}
                          // src={data?.c5?.author_img}
                          // src={`https://www.physiciansweekly.com/wp-content/uploads/${data?.c6?.author_img}`}
                          src={`${data?.c6?.author_img}`}
                          onLoad={handleImageLoad}
                          alt=""
                        />
                      </span>
                      <span
                        style={{
                          color:
                            data.color === "#e0a600"
                              ? "#e0a600"
                              : data.color === "#a0251c"
                              ? "#a0251c"
                              : "",
                        }}
                      >
                        <strong>{data?.c6?.author_name}</strong>
                      </span>
                    </p>
                  )}

                  <Editor
                    apiKey={apiKey}
                    id="titles1"
                    className="editor-input descript  task"
                    value={value.bodyC6}
                    disabled
                    init={{
                      menubar: false,
                      inline: true,
                      readonly: true,
                      // content_style: `color: ${data.color}`
                      // content_style: `.editorss { color: ${data.color}; }` // Add a custom class and its style
                    }}
                    onEditorChange={(content, editor) => {
                      setValue({ ...value, bodyC6: content });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="footer-img none">
          <img className={[classes.img, "footer-bar"]} src="Footer-bar.png" />
        </div>
        {/* <Button onClick={generatePDF}>Generate PDF</Button> */}
      </>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default ShowVersionsData;
