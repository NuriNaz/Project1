import React, { useEffect, useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams } from "react-router";

import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import Message from "components/Snackbar/Snackbar";

const View_PDF_Screen = ({ ...others }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(false);
  const [pdf_File, setPdfFile] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const params = useParams();

  const PDF_URL = async () => {
    const id = params.id;
    try {
      setIsLoading(true);
      const result = await Axios.post(API.Get_Pdf_Path, { docId: id });
      if (result.status === 200) {
        setIsLoading(false);
        setPdfFile(result.data.pdfPath);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err, "This is Error");
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response.data.message,
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  useEffect(() => {
    PDF_URL();
  }, []);

  return (
    <MainCard title="View PDF">
      <div className="container">
        <div className="viewer">
          {pdf_File ? (
            <iframe
              title="PDF Viewer"
              src={pdf_File}
              width="100%"
              height="800px"
            ></iframe>
          ) : (
            <p>Loading PDF...</p>
          )}
          {/* <iframe
            title="PDF Viewer"
            src={pdf_File}
            width="100%"
            height="800px"
          ></iframe> */}
          {/* <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
            <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
          </Worker> */}
        </div>
      </div>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </MainCard>
  );
};

export default View_PDF_Screen;
