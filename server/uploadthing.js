import { createUploadthing } from "uploadthing/express";
 
const f = createUploadthing();
 
export const uploadRouter = {
  slicerUploader: f({
    blob: {
      maxFileSize: "100MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("file slicer | upload completed", data);
  }),
  adminUploader: f({
    blob: {
      maxFileSize: "100MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("file admin | upload completed", data);
  }),
}

export default uploadRouter;
