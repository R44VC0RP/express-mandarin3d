import React, { Suspense, useState, useEffect, useRef } from 'react';
import { FaMinus, FaPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { StlViewer } from "react-stl-viewer";

function hexToRgb(hex) {
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function calculateLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const colorLuminance = calculateLuminance(r, g, b);
  const whiteLuminance = calculateLuminance(255, 255, 255);
  const blackLuminance = calculateLuminance(0, 0, 0);

  const contrastWithWhite = Math.abs(colorLuminance - whiteLuminance);
  const contrastWithBlack = Math.abs(colorLuminance - blackLuminance);

  return contrastWithWhite > contrastWithBlack ? '#F9FAFB' : '#111827';
}


const LazyModelViewer = ({ url, style, hexColor }) => {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <div ref={containerRef} style={style}>
      {isVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <StlViewer
            style={style}
            orbitControls
            shadows
            showAxes={true}
            url={url}
            modelProps={{ color: hexColor, scale: 1.2 }}
          />
        </Suspense>
      ) : (
        <div style={style}>Loading...</div>
      )}
    </div>
  );
};

const style = {
  width: '100%',
  height: '100%',
};

const ShoppingCartItem = ({
  isAuthenticated,
  fileid = "1",
  filename = "Placeholder",
  file_status = "unsliced",
  fileurl = "https://via.placeholder.com/150",
  mass_in_grams = 0,
  dimensions = {
    x: 0,
    y: 0,
    z: 0
  },
  utfile_url = "https://s2.mandarin3d.com/or_4hioorot5xn/Pylon_Threaded_Version_STEP.stl",
  quantity = 1,
  quality = "0.20mm",
  price = 0,
  file_error = "Your file is being quoted...",
  filamentColors = [],
  filament_color = "Black PLA",
  onQuantityChange = () => { },
  onQualityChange = () => { },
  onColorChange = () => { },
  onRemove = () => { }
}) => {
  const hexColor = filamentColors.find(color => color.filament_name === filament_color)?.filament_color;
  if (file_status === 'unsliced') {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4">
        {isAuthenticated && (
          <div className="flex items-center mb-2 sm:mb-0">
            <code className="text-white">{fileid}</code>
          </div>
        )}

        <div className="flex items-center mb-2 sm:mb-0">
          <FaSpinner className="animate-spin mr-2" />
          <p className="text-white">{filename}</p>
        </div>
        <p className="text-gray-400">Your file is being quoted...</p>
        <button className="github-remove mt-2 sm:mt-0" onClick={() => onRemove(fileid)}>Remove</button>
      </div>
    );
  }

  if (file_status === 'error') {
    return (
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between">
        {isAuthenticated && (
          <div className="flex items-center mb-2 sm:mb-0">
            <code className="text-white">{fileid}</code>
            </div>
          )}
          <div className="flex items-center mb-2 sm:mb-0">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="text-white">{filename}</p>
          </div>
          <div className="mb-2 sm:mb-0">
            <p className="text-red-500">There was an error processing your file.</p>
            <p className="text-red-500"><span className="font-bold">Error:</span> {file_error}</p>
          </div>
          <button className="github-remove mt-2 sm:mt-0" onClick={() => onRemove(fileid)}>Remove</button>
        </div>
        <hr className="w-full border-[#5E5E5E] mt-2" />
      </div>
    );
  }

  const contrastColor = getContrastColor(hexColor);

  return (
    <div className="p-4">
      <a href={utfile_url} download title="Click to download" className="hover:underline">
        <p className="text-white font-bold text-xl sm:text-2xl mb-2">
          {filename}
        </p>
      </a>
      {isAuthenticated && (
        <div className="mb-2">
          <code className="text-white text-sm px-2 py-1 bg-[#2A2A2A] border border-[#5E5E5E] rounded-md">{fileid}</code>
        </div>
      )}
      <div className="flex flex-col lg:flex-row items-start justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 lg:mb-0 w-full lg:w-auto">
          <div className="w-full sm:w-32 h-32 border border-[#5E5E5E] rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-4" style={{ backgroundColor: contrastColor }}>
            {utfile_url ? (
              <LazyModelViewer url={utfile_url} style={style} hexColor={hexColor} />
            ) : (
              <img src={fileurl} alt={filename} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-white font-bold">File Mass: <span className="font-light">{mass_in_grams}g</span></p>
            <p className="text-white font-bold">Part Dimensions:</p>
            <p className="text-white">X: <span className="font-light">{dimensions.x}mm</span></p>
            <p className="text-white">Y: <span className="font-light">{dimensions.y}mm</span></p>
            <p className="text-white">Z: <span className="font-light">{dimensions.z}mm</span></p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col items-start mb-4 lg:mb-0 w-full lg:w-auto">
          <div className="w-full sm:w-1/2 lg:w-full mb-4 sm:mb-0 sm:mr-2 lg:mr-0">
            <p className="text-white font-bold mb-1">Part Quantity</p>
            <div className="flex items-center">
              <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity - 1)}><FaMinus /></button>
              <p className="mx-2 text-white">{quantity}</p>
              <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity + 1)}><FaPlus /></button>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-full">
            <p className="text-white font-bold mb-1">Layer Height (Quality)</p>
            <select
              className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full"
              value={quality}
              onChange={(e) => onQualityChange(fileid, e.target.value)}
            >
              <option value="0.12mm">0.12mm - Best</option>
              <option value="0.16mm">0.16mm - Good</option>
              <option value="0.20mm">0.20mm - Default</option>
              <option value="0.25mm">0.25mm - Draft</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
          <p className="text-white font-bold mb-1">File Color</p>
          <select
            className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full lg:w-auto mb-2"
            value={filament_color}
            onChange={(e) => onColorChange(fileid, e.target.value)}
          >
            {filamentColors.map((color) => (
              <option key={color.filament_id} value={color.filament_name}>
                {color.filament_name}
              </option>
            ))}
          </select>
          <p className="text-white font-bold text-lg mb-2">${price}</p>
          <button className="github-remove w-full lg:w-auto" onClick={() => onRemove(fileid)}>Remove</button>
        </div>
      </div>
      <hr className="w-full border-[#5E5E5E] mt-4" />
    </div>
  );
};

const getQualityMultiplier = (quality) => {
  switch (quality) {
    case '0.12mm': return 1.5;
    case '0.20mm': return 1.3;
    case '0.25mm': return 1.1;
    default: return 1.3;
  }
};

export default ShoppingCartItem;