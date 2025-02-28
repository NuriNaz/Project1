const setCanvasPreview = (
  image, // HTMLImageElement
  canvas, // HTMLCanvasElement
  pixelCrop // PixelCrop
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set the desired width and height (69x70 pixels)
  const desiredWidth = 69;
  const desiredHeight = 70;

  canvas.width = desiredWidth;
  canvas.height = desiredHeight;

  const scaleX = desiredWidth / pixelCrop.width;
  const scaleY = desiredHeight / pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    desiredWidth,
    desiredHeight
  );

  // Update the pixelCrop values to match the new canvas size
  const newPixelCrop = {
    x: pixelCrop.x * scaleX,
    y: pixelCrop.y * scaleY,
    width: pixelCrop.width * scaleX,
    height: pixelCrop.height * scaleY,
  };

  // Now, you can use the newPixelCrop values as needed

  // The rest of your code...

  // If needed, you can return the canvas or other data as well
};

export default setCanvasPreview;


// ---------------------------------------- Without Size Image Render ----------------------------------
// const setCanvasPreview = (
//   image, // HTMLImageElement
//   canvas, // HTMLCanvasElement
//   pixelCrop // PixelCrop
// ) => {
//   // export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
//   //   const image = await createImage(imageSrc)
//   //   const canvas = document.createElement('canvas')
//   //   const ctx = canvas.getContext('2d')

//   const ctx = canvas.getContext("2d");
//   if (!ctx) {
//     throw new Error("No 2d context");
//   }

//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;



//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );


//   // As Base64 string
//   // return canvas.toDataURL('image/jpeg');

//   // As a blob
//   // return new Promise(resolve => {
//   //   canvas.toBlob(file => {
//   //     resolve(URL.createObjectURL(file))
//   //   }, 'image/jpeg')
//   // })

//   ctx.restore();
// };

// export default setCanvasPreview;









// -------------------------------- Library 'react-image-cropper' --------------------------------------
// const setCanvasPreview = (
//     image, // HTMLImageElement
//     canvas, // HTMLCanvasElement
//     crop // PixelCrop
//   ) => {
//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//       throw new Error("No 2d context");
//     }
//     // devicePixelRatio slightly increases sharpness on retina devices
//     // at the expense of slightly slower render times and needing to
//     // size the image back down if you want to download/upload and be
//     // true to the images natural size.
//     const pixelRatio = window.devicePixelRatio;
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;

//     canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
//     canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

//     ctx.scale(pixelRatio, pixelRatio);
//     ctx.imageSmoothingQuality = "high";
//     ctx.save();

//     const cropX = crop.x * scaleX;
//     const cropY = crop.y * scaleY;

//     // Move the crop origin to the canvas origin (0,0)
//     ctx.translate(-cropX, -cropY);
//     // ctx.drawImage(
//     //   image,
//     //   0,
//     //   0,
//     //   image.naturalWidth,
//     //   image.naturalHeight,
//     //   0,
//     //   0,
//     //   image.naturalWidth,
//     //   image.naturalHeight
//     // );

//     ctx.restore();
//   };
//   export default setCanvasPreview;
