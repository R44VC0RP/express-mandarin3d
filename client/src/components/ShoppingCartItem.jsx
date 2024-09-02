import React from 'react';
import { FaMinus, FaPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ShoppingCartItem = ({
  filename="example.stl",
  status="error",
  fileurl="https://placehold.co/600x400",
  filemass="100",
  filedimensions={x:100, y:100, z:100},
  quantity=1,
  quality="0.12mm",
  price="100",
  onQuantityChange=()=>{},
  onRemove=()=>{}
}) => {
  if (status === 'unsliced') {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <FaSpinner className="animate-spin mr-2" />
          <p className="text-white">{filename}</p>
        </div>
        <p className="text-gray-400">Your file is being quoted...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <p className="text-white">{filename}</p>
        </div>
        <p className="text-red-500">There was an error processing your file.</p>
        <button className="github-remove mt-2" onClick={() => onRemove(filename)}>Remove</button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="w-32 h-32 border border-[#5E5E5E] rounded-md overflow-hidden mr-4">
          <img src={fileurl} alt={filename} className="w-full h-full object-cover" />
        </div>
        
        <div>
          <p className="text-white font-bold">{filename}</p>
          <p className="text-gray-400">File Mass: {filemass}g</p>
          <p className="text-gray-400">Part Dimensions:</p>
          <p className="text-gray-400">X: {filedimensions.x}mm</p>
          <p className="text-gray-400">Y: {filedimensions.y}mm</p>
          <p className="text-gray-400">Z: {filedimensions.z}mm</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-white">Part Quantity</p>
        <div className="flex items-center">
          <button className="text-white" onClick={() => onQuantityChange(filename, quantity - 1)}><FaMinus /></button>
          <p className="mx-2 text-white">{quantity}</p>
          <button className="text-white" onClick={() => onQuantityChange(filename, quantity + 1)}><FaPlus /></button>
        </div>
        <p className="text-white">Layer Height (Quality)</p>
        <select className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1">
          <option value="0.12mm">0.12mm - Best</option>
          <option value="0.20mm">0.20mm - Default</option>
          <option value="0.25mm">0.25mm - Draft</option>
        </select>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-white font-bold">${price}</p>
        <button className="secondary-button mt-2" onClick={() => onRemove(filename)}>Remove</button>
      </div>
    </div>
  );
};

export default ShoppingCartItem;