import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { createUpload } from "@/utils/uploadthing";
import { FaCloudUploadAlt, FaSpinner, FaCheck, FaTimes, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "@/context/Cart";
import Header from '../components/Header';
import Footer from '../components/Footer';

const ACCEPTED_FILE_TYPES = {
  'application/octet-stream': ['.stl'],
  'model/stl': ['.stl'],
  'model/step': ['.step', '.stp'],
  'model/obj': ['.obj'],
  'application/x-tgif': ['.stl', '.obj', '.step', '.stp'],
  'text/plain': ['.obj']
};

function Upload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [hasFiles, setHasFiles] = useState(false);
  const [allUploadsComplete, setAllUploadsComplete] = useState(false);
  const { addBulkFiles } = useCart();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setHasFiles(true);
    setAllUploadsComplete(false);
    const uploadPromises = acceptedFiles.map(async (file) => {
      // Add file to UI list immediately
      const newFile = {
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      if (file.size >= 100 * 1024 * 1024) {
        setUploadedFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name);
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              status: 'error',
              error: 'File is too large (>100MB). Please email orders@mandarin3d.com for large files.'
            };
          }
          return newFiles;
        });
        return null;
      }

      try {
        const { done } = await createUpload(
          "modelUploader",
          {
            files: [file],
            onUploadProgress: ({ progress }) => {
              setUploadedFiles(prev => {
                const newFiles = [...prev];
                const fileIndex = newFiles.findIndex(f => f.name === file.name);
                if (fileIndex !== -1) {
                  newFiles[fileIndex] = {
                    ...newFiles[fileIndex],
                    progress: Math.round(progress)
                  };
                }
                return [...newFiles];
              });
            },
          },
        );

        const result = await done();
        const fileid = result[0].serverData.fileid;

        setUploadedFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name);
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              status: 'completed',
              progress: 100
            };
          }
          return newFiles;
        });

        return fileid;
      } catch (error) {
        setUploadedFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name);
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              status: 'error',
              error: 'Upload failed. Please try again.'
            };
          }
          return newFiles;
        });
        return null;
      }
    });

    const uploadedFileIds = (await Promise.all(uploadPromises)).filter(Boolean);

    if (uploadedFileIds.length > 0) {
      await addBulkFiles(uploadedFileIds);
      window.dispatchEvent(new CustomEvent('filesUploaded'));

      // Check if all files are completed
      const allCompleted = uploadedFiles.every(file => file.status === 'completed');
      setAllUploadsComplete(allCompleted);
    }
  }, [addBulkFiles, uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-grow">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-screen-2xl px-4 py-24 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
          </div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                  Custom 3D Print
                </span>
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                Upload Your 3D Models
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Transform your 3D designs into reality with our professional printing service
              </p>
            </div>

            {/* Go to Cart CTA */}
            <AnimatePresence>
              {allUploadsComplete && uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="col-span-full mb-8 flex justify-center"
                >
                  <button
                    onClick={() => window.location.href = '/cart'}
                    className="group flex items-center gap-2 px-8 py-4 bg-[#0D939B] hover:bg-[#0B7F86] text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                  >
                    <FaShoppingCart className="text-xl" />
                    <span className="font-semibold">Go to Cart</span>
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Area */}
            <div className="w-full max-w-7xl mx-auto">
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Dropzone */}
                <motion.div
                  initial={{ width: '100%', x: '50%', marginLeft: '-50%' }}
                  animate={{
                    width: hasFiles ? '100%' : '100%',
                    x: hasFiles ? '0%' : '50%',
                    marginLeft: hasFiles ? '0' : '-50%'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={!hasFiles ? 'md:col-span-2' : ''}
                >
                  <div
                    {...getRootProps()}
                    className={`w-full rounded-lg border-2 border-dashed transition-colors duration-200 
                      ${isDragActive
                        ? 'border-cyan-500/50 bg-cyan-500/5'
                        : 'border-neutral-700 bg-[#1a1b1e]/80'
                      } backdrop-blur-sm p-8 cursor-pointer hover:border-cyan-500/50`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4 text-center">
                      <FaCloudUploadAlt className={`h-16 w-16 transition-colors duration-200 ${isDragActive ? 'text-cyan-400' : 'text-neutral-400'
                        }`} />
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {isDragActive
                            ? 'Drop your files here'
                            : 'Drop your files here or click to select'}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-400">
                          You can upload multiple files at once
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                          Supported formats: STL, STEP, OBJ (Max size: 100MB per file)
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Upload Progress List */}
                <AnimatePresence mode="popLayout">
                  {uploadedFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="w-full space-y-4"
                    >
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={file.name + index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-lg border border-neutral-800/50 bg-[#1a1b1e]/80 p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {file.status === 'uploading' && (
                                <FaSpinner className="h-4 w-4 text-cyan-400 animate-spin" />
                              )}
                              {file.status === 'completed' && (
                                <FaCheck className="h-4 w-4 text-green-400" />
                              )}
                              {file.status === 'error' && (
                                <FaTimes className="h-4 w-4 text-red-400" />
                              )}
                              <span className="text-sm font-medium text-white">{file.name}</span>
                            </div>
                            <span className="text-xs text-neutral-500">{formatFileSize(file.size)}</span>
                          </div>

                          <div className="relative h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              className={`absolute h-full rounded-full ${file.status === 'error'
                                  ? 'bg-red-500'
                                  : file.status === 'completed'
                                    ? 'bg-green-500'
                                    : 'bg-cyan-500'
                                }`}
                            />
                          </div>

                          {file.error && (
                            <p className="mt-2 text-xs text-red-400">{file.error}</p>
                          )}
                          {file.status === 'completed' && (
                            <p className="mt-2 text-xs text-green-400">Upload complete!</p>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>


              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Upload; 