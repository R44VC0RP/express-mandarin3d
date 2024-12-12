import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundEffects from '@/components/BackgroundEffects';
import PricingPlan from '@/components/ShowcaseProduct';
import Loading from 'react-fullscreen-loading';
import { useCart } from '@/context/Cart';
import { StlViewer } from "react-stl-viewer";
import { FaShoppingCart } from "react-icons/fa";

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
        <Suspense fallback={<div>Loading...</div>}>
          <StlViewer
            style={style}
            orbitControls
            shadows
            showAxes={false}
            url={url}
            modelProps={{
              color: hexColor,
              scale: 1.2,
              positionY: 0,
              rotationX: -0.1, // Use the state variable here
              rotationZ: zRotation,
            }}
            cameraProps={{
              initialPosition: {
                latitude: Math.PI / 6,
                longitude: Math.PI / 4,
                distance: 2,

              }
            }}
            floorProps={{
              gridWidth: 100,
              gridLength: 100,
            }}
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
              // {
              //   type: 'ambient',
              //   intensity: 0.6,
              // }
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
        <div style={style}>Loading...</div>
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
    height: '400px',
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

  if (isLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#0D939B" />;
  }

  if (!fileData) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <p>File not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects />

      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 3D Model Viewer Card */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm border-2 border-[#5E5E5E] border-opacity-20 rounded-lg overflow-hidden shadow-xl">
            {/* Model Viewer */}
            <div className="p-4">
              <LazyModelViewer 
                url={fileData.utfile_url}
                style={style}
                hexColor="#0D939B"
              />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{fileData.filename}</h1>
              
              <div className="flex items-center justify-between mb-6">
                {/* <span className="text-2xl font-bold">${fileData.price_override || 29.99}</span> */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 primary-button transition duration-300"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-8 border-t border-[#5E5E5E] border-opacity-20 pt-6">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <p className="text-gray-300">
                  This is a 3D printable file that can be manufactured using FDM printing technology. 
                  The model has been optimized for printing and includes all necessary geometry and supports.
                  Click the button above to add this file to your cart to get pricing!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}