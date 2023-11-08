import * as Sentry from "@sentry/react";

const scale = 400;

export const getBase64Image = (imageUrl) => {
  // create a new promise that will resolve with the base64 encoded image
  return new Promise((resolve, reject) => {
    // create a new image
    const img = new Image();
    // when the image has loaded, resolve the promise with the base64 encoded image
    img.onload = () => {
      const wi = img.naturalWidth > scale ? scale : img.naturalWidth;
      const he = img.naturalWidth > scale ? img.naturalHeight * scale / img.naturalWidth : img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = wi;
      canvas.height = he;
      canvas.getContext('2d').drawImage(img, 0, 0, wi, he);

      resolve(canvas.toDataURL('image/jpeg'));
    };
    // if there is an error loading the image, reject the promise
    img.onerror = reject;

    img.crossOrigin = "anonymous"
    // set the src of the image to the image url
    img.src = imageUrl;
  }).catch(Sentry.captureException);
}

export const getBase64Canvas = (canvas) => {
  // create a new promise that will resolve with the base64 encoded image
  const wi = canvas.width > scale ? scale : canvas.width;
  const he = canvas.width > scale ? canvas.height * scale / canvas.width : canvas.height;

  canvas.getContext('2d').getImageData(0, 0, wi, he);
}

export const getBase64ImageParams = (imageUrl, x, y, w, h) => {
  // create a new promise that will resolve with the base64 encoded image
  return new Promise((resolve, reject) => {
    // create a new image
    const img = new Image();

    const canvas = document.createElement('canvas');

    // when the image has loaded, resolve the promise with the base64 encoded image
    img.onload = () => {
      const coefW = img.naturalWidth / window.innerWidth;
      const coefH = img.naturalHeight / window.innerHeight;
      canvas.width = w * coefW;
      canvas.height = h * coefH;

      canvas.getContext('2d').drawImage(img, x * coefW, y * coefH, w * coefW, h * coefH, 0, 0, w * coefW, h * coefH);

      resolve(canvas.toDataURL('image/jpeg'));
    };
    // if there is an error loading the image, reject the promise
    img.onerror = reject;
    img.src = imageUrl;
  }).catch(Sentry.captureException);
}

export async function waitForElement(selector, callback) {
  let count = 0;
  while (!document.querySelector(selector)
    && count < 40) {
    await new Promise(resolve => setTimeout(resolve, 500));
    count++;
    console.log('Try ' + count);
  }
  if (count === 40)
    console.log("Element not found!");
  else
    callback(document.querySelector(selector));
}
