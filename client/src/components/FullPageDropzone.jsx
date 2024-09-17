import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { createUpload } from "@/utils/uploadthing";

import { useCart } from "@/context/Cart";

const FullPageDropzone = ({ children }) => {
  const { addBulkFiles } = useCart();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadPromises = acceptedFiles.map(async (file) => {
        console.log(file);
        if (file.name.endsWith('.stl') || file.name.endsWith('.step') || file.name.endsWith('.3mf')) {
          if (file.size >= 100 * 1024 * 1024){
            
            // window.location.href = `/cart`;
            toast.error(`The file: ${file.name} is too large (<100MB), please email orders@mandarin3d.com to get your quote created.`);
            return null;
          }
          const toastId = file.name;
          toast(`Uploading ${file.name}: 0%`, { id: toastId });

          try {
            const { done } = await createUpload(
              "modelUploader",
              {
                files: [file],
                onUploadProgress: ({ progress }) => {
                  toast(`Uploading ${file.name}: ${Math.round(progress)}%`, { id: toastId });
                },
              },
            );
            const result = await done();
            console.log(result);
            const fileid = result[0].serverData.fileid;
            toast.success(`Upload complete: ${file.name}`, { id: toastId });
            return fileid;
          } catch (error) {
            console.error('Upload failed:', error);
            toast.error(`Upload failed: ${file.name}`, { id: toastId });
            return null;
          }
        } else {
          
            toast.error(`Invalid file type: ${file.name}. Please upload a valid STL, STEP, or 3MF file.`);
            return null;
          
          
        }
      });

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
      
      if (uploadedFiles.length > 0) {
        await addBulkFiles(uploadedFiles);
        window.dispatchEvent(new CustomEvent('filesUploaded'));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="">
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="p-4 fixed inset-4 bg-[#0D939B]/90 border-2 rounded-lg border-[#11B3BD] flex items-center justify-center z-50">
          <p className="text-xl font-semibold text-white">Drop STL, STEP, or 3MF files here</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default FullPageDropzone;