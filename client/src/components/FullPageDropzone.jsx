import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { createUpload } from "@/utils/uploadthing";
import { FaUpload } from 'react-icons/fa';

import { useCart } from "@/context/Cart";

const FullPageDropzone = ({ children }) => {
  const { addBulkFiles } = useCart();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadPromises = acceptedFiles.map(async (file) => {
        console.log(file);
        if (file.name.toUpperCase().endsWith('.STL') || file.name.toUpperCase().endsWith('.STEP') || file.name.toUpperCase().endsWith('.3MF')) {
          if (file.size >= 100 * 1024 * 1024){
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'model/stl': ['.stl'],
      'model/3mf': ['.3mf'],
      'application/step': ['.step', '.stp']
    }
  });

  return (
    <div {...getRootProps()} className="relative">
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="p-4 fixed inset-4 bg-[#0D939B]/90 border-2 rounded-lg border-[#11B3BD] flex items-center justify-center z-50">
          <p className="text-lg md:text-xl font-semibold text-white text-center">Drop STL, STEP, or 3MF files here</p>
        </div>
      ) : (
        <>
          <div className="hidden md:flex fixed top-1/2 left-0 transform -translate-y-1/2 bg-[#0D939B] text-white p-2 rounded-r-lg items-center z-50 group overflow-hidden transition-all duration-300 ease-in-out hover:w-auto w-10 cursor-pointer" onClick={open}>
            <FaUpload className="ml-1 flex-shrink-0" />
            <p className="ml-4 text-xs md:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">You can upload STL, STEP, or 3MF files<br/>by dragging and dropping anywhere<br/>or click here to upload.</p>
          </div>
          <div className="md:hidden fixed top-1/2 left-0 transform -translate-y-1/2 bg-[#0D939B] text-white p-2 rounded-r-lg flex items-center z-50 group overflow-hidden transition-all duration-300 ease-in-out hover:w-auto w-10 cursor-pointer" onClick={open}>
            <FaUpload className="ml-1 flex-shrink-0" />
            <p className="ml-4 text-xs md:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">You can upload STL, STEP, or 3MF files<br/>by dragging and dropping anywhere<br/>or click here to upload.</p>
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export default FullPageDropzone;