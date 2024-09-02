import React, { Suspense } from 'react';
import { FaMinus, FaPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import {StlViewer} from "react-stl-viewer";

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const ModelViewer = ({ url, style }) => {
  console.log("ModelViewer url: ", url);
  return (
    <StlViewer
      style={style}
      orbitControls
      shadows
      showAxes={true}
      url={url}
    />
  );
};

const style = {
  width: '100%',
  height: '100%',
};

const ShoppingCartItem = ({
  fileid="1",
  filename="Placeholder",
  file_status="unsliced",
  fileurl="https://via.placeholder.com/150",
  mass_in_grams=0,
  dimensions={
    x: 0,
    y: 0,
    z: 0
  },
  utfile_url="https://s2.mandarin3d.com/or_4hioorot5xn/Pylon_Threaded_Version_STEP.stl",
  quantity = 1,
  quality = "0.20mm",
  price=0,
  file_error="Your file is being quoted...",
  onQuantityChange=()=>{},
  onQualityChange=()=>{},
  onRemove=()=>{}
}) => {
  if (file_status === 'unsliced') {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between p-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <FaSpinner className="animate-spin mr-2" />
          <p className="text-white">{filename}</p>
        </div>
        <p className="text-gray-400">Your file is being quoted...</p>
      </div>
    );
  }

  if (file_status === 'error') {
    return (
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between">
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

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
          <div className="w-full sm:w-32 h-32 border border-[#5E5E5E] rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-4">
            {utfile_url ? (
              <ModelViewer url={utfile_url} style={style}/>
            ) : (
              <img src={fileurl} alt={filename} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <p className="text-white font-bold">{filename}</p>
            <p className="text-white font-bold">File Mass: <span className="font-light">{mass_in_grams}g</span></p>
            <p className="text-white font-bold">Part Dimensions:</p>
            <p className="text-white font-bold">X: <span className="font-light">{dimensions.x}mm</span></p>
            <p className="text-white font-bold">Y: <span className="font-light">{dimensions.y}mm</span></p>
            <p className="text-white font-bold">Z: <span className="font-light">{dimensions.z}mm</span></p>
          </div>
        </div>
        <div className="flex flex-col items-start mb-4 sm:mb-0">
          <p className="text-white font-bold">Part Quantity</p>
          <div className="flex items-center">
            <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity - 1)}><FaMinus /></button>
            <p className="mx-2 text-white">{quantity}</p>
            <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity + 1)}><FaPlus /></button>
          </div>
          <p className="text-white font-bold mt-2">Layer Height (Quality)</p>
          <select 
            className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full" 
            value={quality}
            onChange={(e) => onQualityChange(fileid, e.target.value)}
          >
            <option value="0.12mm">0.12mm - Best</option>
            <option value="0.20mm">0.20mm - Default</option>
            <option value="0.25mm">0.25mm - Draft</option>
          </select>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="text-white font-bold" id={`${fileid}_price`}>$</p>
          <button className="github-remove" onClick={() => onRemove(fileid)}>Remove</button>
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