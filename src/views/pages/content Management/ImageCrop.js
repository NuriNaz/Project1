import React, { useRef, useState } from "react";
import Popup from "components/Popup";
import { Button, Box, Typography, Slider } from "@mui/material";
import Cropper from "react-easy-crop";
import setCanvasPreview from "./setCanvasPreview";

const ImageCrop = ({ openPOP_url, closedPOP, cropedImageSrc }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // Initial zoom level
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();

  const onCropComplete = (croppedArea, croppedAreaPixel) => {
    setCroppedAreaPixels(croppedAreaPixel);
  };

  return (
    <Popup
      open={Boolean(openPOP_url)}
      overflowY="auto"
      height="500px"
      padding="20px"
      content={
        <>
          <Cropper
            image={openPOP_url}
            setImageRef={(ref) => (imgRef.current = ref.current)}
            crop={crop}
            zoom={zoom}
            aspect={69 / 70}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropSize={{ width: 69, height: 70 }}
            showGrid={false}
            maxWidth={69}
            maxHeight={70}
            zoomWithScroll={false}
            restrictPosition={true} 
          />

          {crop && (
            <canvas
              ref={previewCanvasRef}
              style={{
                display: "none",
                border: "1px solid black",
                objectFit: "contain",
                width: 69,
                height: 70,
              }}
            />
          )}

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              background: "#fff",
              zIndex: "9999999",
              position: "relative",
              width: "278px",
              margin: "0 auto",
              borderRadius: "66px",
            }}
            // style={{ position: "absolute", bottom: "-10%", left: "21%" }}
          >
            <Typography style={{ marginTop: "7px" }} variant="caption">
              Zoom:
            </Typography>
            {/* <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.value);
              }}
              className="zoom-range"
            /> */}
            <Slider
              value={zoom}
              min={0.4}
              max={3}
              step={0.1}
              onChange={(e) => {
                setZoom(e.target.value);
              }}
              // onChange={handleZoomChange}
              style={{ width: 200, marginLeft: 10, overflow: "hidden" }}
              className="zoom-range"
            />
          </Box>
        </>
      }
      actions={
        <>
          <Box
            sx={{ mt: 2 }}
            style={{
              textAlign: "center",
              position: "absolute",
              bottom: "2%",
              // left: "29%",
              right: "3%",
            }}
          >
            <Button
              size="large"
              variant="contained"
              color="secondary"
              style={{ background: "#F44336", marginRight: 10 }}
              onClick={() => closedPOP(null)}
            >
              Cancel
            </Button>
            <Button
              style={{ background: "#15223F" }}
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => {
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  croppedAreaPixels
                );
                cropedImageSrc(previewCanvasRef.current.toDataURL());
              }}
            >
              Done
            </Button>
          </Box>
        </>
      }
    />
  );
};

export default ImageCrop;

// --------------------------------- React Image Cropper Without Zoom Feature --------------------------------------

// import React, { useRef, useState } from "react";
// import ReactCrop, {
//   centerCrop,
//   convertToPixelCrop,
//   makeAspectCrop,
// } from "react-image-crop";
// import "./style.css";
// import Popup from "components/Popup";
// import { Button, Box } from "@mui/material";
// import setCanvasPreview from "./setCanvasPreview";

// const ImageCrop = ({ openPOP_url, closedPOP, cropedImageSrc }) => {
//   const imgRef = useRef(null);
//   const previewCanvasRef = useRef(null);
//   const [crop, setCrop] = useState();
//   const [aspect, setAspect] = useState(16 / 9);

//   const ASPECT_RATIO = 69 / 70;
//   // const MIN_DIMENSION = 150;
//   const MIN_DIMENSION = 69;
//   const initial_width = 69;
//   const initial_height = 70;

//   const onImageLoad = (e) => {
//     const { width, height } = e.currentTarget;
//     const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

//     const crop = makeAspectCrop(
//       {
//         unit: "px",
//         // width: cropWidthInPercent,
//         width: MIN_DIMENSION,
//         height: initial_height,
//       },
//       ASPECT_RATIO,
//       width,
//       height
//       //   aspect,
//       //   initial_width,
//       //   initial_height
//     );
//     const centeredCrop = centerCrop(crop, width, height);
//     setCrop(centeredCrop);
//   };

//   return (
//     <Popup
//       open={Boolean(openPOP_url)}
//       overflowY="auto"
//       height="500px"
//       content={
//         <>
//           <ReactCrop
//             crop={crop}
//             onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
//             aspect={ASPECT_RATIO}
//             locked={true} // Set this to true to disable both dragging and resizing
//             style={{ overflow: "hidden", cursor: "grab" }}
//           >
//             <img
//               ref={imgRef}
//               alt="Crop me"
//               src={openPOP_url}
//               style={{
//                 width: "100%",
//                 height: "100%",
//               }}
//               // style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
//               onLoad={onImageLoad}
//             />
//           </ReactCrop>
//           {crop && (
//             <canvas
//               ref={previewCanvasRef}
//               className="mt-4"
//               style={{
//                 display: "none",
//                 border: "1px solid black",
//                 objectFit: "contain",
//                 width: 150,
//                 height: 150,
//               }}
//             />
//           )}
//         </>
//       }
//       actions={
//         <>
//           <Box sx={{ mt: 2 }} style={{ textAlign: "center" }}>
//             <Button
//               size="large"
//               variant="contained"
//               color="secondary"
//               style={{ background: "#F44336", marginRight: 10 }}
//               onClick={() => closedPOP(null)}
//             >
//               Cancel
//             </Button>
//             <Button
//               style={{ background: "#15223F" }}
//               variant="contained"
//               color="secondary"
//               size="large"
//               onClick={() => {
//                 setCanvasPreview(
//                   imgRef.current,
//                   previewCanvasRef.current,
//                   convertToPixelCrop(
//                     crop,
//                     imgRef.current.width,
//                     imgRef.current.height
//                   )
//                 );
//                 cropedImageSrc(previewCanvasRef.current.toDataURL());
//               }}
//             >
//               Done
//             </Button>
//           </Box>
//         </>
//       }
//     />
//   );
// };

// export default ImageCrop;
