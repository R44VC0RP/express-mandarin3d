import React, { useState, useRef, useEffect } from 'react';
import { Suspense } from 'react';
import { FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import STLViewer from './STLViewer';
import { StlViewer } from "react-stl-viewer";
import PopupSTLViewer from './PopupSTLViewer';
import { Button } from './ui/button';

const LazyModelViewer = ({ url, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const modelRef = useRef(null);

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

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (modelRef.current && modelRef.current.rotation) {
        modelRef.current.rotation.z += 0.005; // Adjust the rotation speed as needed
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isVisible) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} style={style}>
      {isVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <StlViewer
            style={style}
            orbitControls
            shadows
            url={url}
            showAxes={true}
            modelProps={{ scale: 1.3, color: '#F9FAFB' }}
            ref={modelRef}
          />
        </Suspense>
      ) : (
        <div style={style}>Loading...</div>
      )}
    </div>
  );
};

function Carousel({ stlUrl, imageUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[15px] mb-4 border-[#5E5E5E] border-2">
        {currentIndex === 0 ? (
          <LazyModelViewer url={stlUrl} />
        ) : (
          <img
            src={imageUrl}
            alt="Product"
            className="w-full h-48 object-cover rounded-[15px]"
          />
        )}
      </div>
      <div className="flex justify-center space-x-2 mb-2">
        <button
          onClick={handlePrev}
          className='bg-[#5E5E5E] text-white p-2 rounded-full'
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className='bg-[#5E5E5E] text-white p-2 rounded-full'
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

function ShowcaseProduct({
  product_title,
  product_description,
  product_image_url,
  product_price,
  product_features,
  product_fileid,
  product_author,
  product_author_url,
  product_license,
  onAddToCart,
  file_obj,
}) {
  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden flex flex-col h-full">
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold mb-2">{product_title}</h3>
        <Carousel stlUrl={file_obj.utfile_url} imageUrl={product_image_url} />        
        <p className="text-xs mb-2 text-gray-400">
          Made by:{' '}
          <a href={product_author_url} className="text-[#0D939B]">
            {product_author}
          </a>{' '}
          | <span className="text-gray-400">{product_license}</span>
        </p>
        <p className="text-xs mb-4 text-gray-400">{product_description}</p>
        <div className="flex justify-between mb-4">
          <ul className="flex-1">
            {product_features.map((feature, index) => (
              <li key={index} className="flex items-center mb-1">
                <FaCheck className="text-[#0D939B] mr-2 text-xs" />
                <span className="text-xs">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold ml-4">${product_price}</p>
        </div>
      </div>
      <div className="p-4 flex justify-center items-center">
        <Button
          className="mr-2"
          onClick={() => onAddToCart(product_fileid)}
        >
          Add to Cart
        </Button>
        <PopupSTLViewer stlUrl={file_obj.utfile_url} />
      </div>
    </div>
  );
}

export default ShowcaseProduct;