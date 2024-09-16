
import { generateUploadButton } from "@uploadthing/react";
import { genUploader } from "uploadthing/client";


const { createUpload } = genUploader(
  {
    url: `${process.env.REACT_APP_BACKEND_URL}/api/uploadthing`,
  }
);

const UploadButton = generateUploadButton({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/uploadthing`,
  });


export { UploadButton, createUpload };