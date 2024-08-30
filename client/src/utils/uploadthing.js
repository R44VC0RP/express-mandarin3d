import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${process.env.REACT_APP_BACKEND_URL}/api/uploadthing`,
});