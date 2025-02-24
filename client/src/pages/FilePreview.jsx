import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import Loading from 'react-fullscreen-loading';
import { useCart } from '@/context/Cart';
import { StlViewer } from "react-stl-viewer";
import { FaShoppingCart, FaDownload, FaInfoCircle, FaRuler, FaWeight, FaCube, FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const LazyModelViewer = ({ url, style, hexColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [zRotation, setZRotation] = useState(-0.1);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Add rotation animation effect
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setZRotation(prev => prev + 0.01);
    }, 100); // Updates every 100ms

    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div ref={containerRef} style={style}>
      {isVisible ? (
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>}>
          <StlViewer
            style={style}
            orbitControls
            shadows
            showAxes={false}
            url={url}
            modelProps={{
              color: hexColor,
              scale: 1.6,
              positionY: 0,
              rotationX: -0.1,
              rotationZ: zRotation,
            }}
            cameraProps={{
              initialPosition: {
                latitude: Math.PI / 6,
                longitude: Math.PI / 4,
                distance: 2,
              }
            }}
            // floorProps={{
            //   gridWidth: 100,
            //   gridLength: 100,
            // }}
            lights={[
              {
                type: 'directional',
                position: [10, 20, 10],
                intensity: .3,
              },
              {
                type: 'directional',
                position: [-10, 20, -10],
                intensity: 3,
              },
              {
                type: 'ambient',
                intensity: 0.4,
              }
            ]}
            backgroundColor="#1f2937"
            controlsOptions={{
              enableZoom: true,
              maxDistance: 400,
              minDistance: 100,
            }}
            onFinishLoading={(dimensions) => {
              console.log('Model dimensions:', dimensions);
            }}
          />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
};

export default function FilePreview() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const { addFile } = useCart();
  const navigate = useNavigate();
  const { fileId } = useParams();

  // Add useEffect to fetch file data
  useEffect(() => {
    console.log("Fetching file data for fileId:", fileId);
    const fetchFileData = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/api/file', {
          action: 'get',
          fileid: fileId
        });
        
        if (response.data.status === 'success') {
          setFileData(response.data.result);
        } else {
          toast.error('Failed to load file data');
          console.log("Response data:", response.data);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        toast.error('Error loading file data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileData();
  }, [fileId]);

  const style = {
    width: '100%',
    height: '500px',
  };

  const handleAddToCart = async () => {
    try {
      const result = await addFile(fileId);
      if (result.status === 'success') {
        toast.success('File added to cart successfully');
        navigate('/cart');
      } else {
        toast.error(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      toast.error('An error occurred while adding the file to cart');
    }
  };

  const handleDownload = () => {
    if (fileData && fileData.utfile_url) {
      window.open(fileData.utfile_url, '_blank');
    } else {
      toast.error('Download URL not available');
    }
  };

  if (isLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#0D939B" />;
  }

  if (!fileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex items-center justify-center">
        <p>File not found</p>
      </div>
    );
  }

  const isFileSliced = fileData.file_status === 'success';
  const isFileError = fileData.file_status === 'error';
  const isFileProcessing = fileData.file_status === 'unsliced';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-grow">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-screen-2xl px-4 py-4 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
          </div>

          <div className="relative">
            <div className="text-center mb-8">
              {/* <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                  3D Model Preview
                </span>
              </div> */}
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                {fileData.filename}
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                {isFileSliced ? 'Your file is ready to be printed!' : 
                 isFileError ? 'There was an error processing your file.' :
                 'Your file is being processed. This may take a few minutes.'}
              </p>
            </div>

            {/* File Status Indicator */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                isFileSliced ? 'bg-green-500/10 border border-green-500/20' : 
                isFileError ? 'bg-red-500/10 border border-red-500/20' :
                'bg-yellow-500/10 border border-yellow-500/20'
              }`}>
                {isFileSliced && <FaCheck className="mr-2 text-green-400" />}
                {isFileError && <FaExclamationTriangle className="mr-2 text-red-400" />}
                {isFileProcessing && <FaSpinner className="mr-2 text-yellow-400 animate-spin" />}
                <span className={`text-sm font-medium ${
                  isFileSliced ? 'text-green-400' : 
                  isFileError ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {isFileSliced ? 'Ready for Printing' : 
                   isFileError ? 'Processing Error' :
                   'Processing...'}
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* 3D Model Viewer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50 overflow-hidden shadow-xl">
                  <LazyModelViewer 
                    url={fileData.utfile_url}
                    style={style}
                    hexColor="#0D939B"
                  />
                </div>
              </motion.div>

              {/* File Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full"
              >
                <div className="bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50 p-6 h-full flex flex-col">
                  {/* File Status Section */}
                  <AnimatePresence mode="wait">
                    {isFileSliced && (
                      <motion.div
                        key="sliced"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-6"
                      >
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                          <FaInfoCircle className="mr-2 text-cyan-400" />
                          File Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {fileData.mass_in_grams && (
                            <div className="flex items-center">
                              <FaWeight className="mr-2 text-neutral-400" />
                              <span className="text-neutral-300">
                                <span className="font-semibold">Mass:</span> {fileData.mass_in_grams}g
                              </span>
                            </div>
                          )}
                          {fileData.dimensions && (
                            <>
                              <div className="flex items-center">
                                <FaRuler className="mr-2 text-neutral-400" />
                                <span className="text-neutral-300">
                                  <span className="font-semibold">X:</span> {fileData.dimensions?.x || 0}mm
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaRuler className="mr-2 text-neutral-400" />
                                <span className="text-neutral-300">
                                  <span className="font-semibold">Y:</span> {fileData.dimensions?.y || 0}mm
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaRuler className="mr-2 text-neutral-400" />
                                <span className="text-neutral-300">
                                  <span className="font-semibold">Z:</span> {fileData.dimensions?.z || 0}mm
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaCube className="mr-2 text-neutral-400" />
                                <span className="text-neutral-300">
                                  <span className="font-semibold">Volume:</span> {(
                                    (fileData.dimensions?.x || 0) * 
                                    (fileData.dimensions?.y || 0) * 
                                    (fileData.dimensions?.z || 0) / 1000
                                  ).toFixed(2)}cm³
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {isFileError && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <h2 className="text-lg font-semibold mb-2 text-red-400 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          Processing Error
                        </h2>
                        <p className="text-neutral-300">
                          There was an error processing your file. Please try uploading it again or contact support for assistance.
                        </p>
                      </motion.div>
                    )}

                    {isFileProcessing && (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                      >
                        <h2 className="text-lg font-semibold mb-2 text-yellow-400 flex items-center">
                          <FaSpinner className="mr-2 animate-spin" />
                          Processing
                        </h2>
                        <p className="text-neutral-300">
                          Your file is currently being processed. This may take a few minutes depending on the complexity of the model.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      onClick={handleAddToCart}
                      className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#0D939B] hover:bg-[#0B7F86] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                      disabled={!isFileSliced}
                    >
                      <FaShoppingCart className="text-lg" />
                      <span className="font-semibold">Add to Cart</span>
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-white border border-neutral-700 hover:border-neutral-500 rounded-lg transition-all duration-300"
                    >
                      <FaDownload className="text-lg" />
                      <span className="font-semibold">Download STL</span>
                    </button>
                  </div>

                  {/* Product Description */}
                  <div className="mt-auto">
                    <h2 className="text-lg font-semibold mb-4">About This File</h2>
                    <p className="text-neutral-400 mb-4">
                      This is a 3D printable file that can be manufactured using FDM printing technology. 
                      The model has been optimized for printing and includes all necessary geometry.
                    </p>
                    {isFileSliced ? (
                      <p className="text-neutral-400">
                        Your file is ready! Click "Add to Cart" to proceed with ordering your 3D print.
                      </p>
                    ) : (
                      <p className="text-neutral-400">
                        Once processing is complete, you'll be able to add this file to your cart for printing.
                      </p>
                    )}
                  </div>

                  {/* File ID */}
                  <div className="mt-6 pt-4 border-t border-neutral-800/50">
                    <p className="text-xs text-neutral-500">File ID: {fileId}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}