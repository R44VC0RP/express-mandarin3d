import { generateReactHelpers } from "@uploadthing/react/hooks";
import { generateUploadButton } from "@uploadthing/react";

const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${process.env.REACT_APP_BACKEND_URL}/api/uploadthing`,
});

const UploadButton = generateUploadButton({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/uploadthing`,
  });


export { useUploadThing, uploadFiles, UploadButton };