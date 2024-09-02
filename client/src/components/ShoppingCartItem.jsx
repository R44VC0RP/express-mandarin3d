import React from 'react';
import { FaMinus, FaPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ShoppingCartItem = ({
    fileid = null,
    filename = "example.stl",
    status = "sliced",
    fileurl = "https://placehold.co/600x400",
    filemass = "100",
    filedimensions = { x: 100, y: 100, z: 100 },
    quantity = 1,
    quality = "0.12mm",
    price = "100",
    onQuantityChange = () => { },
    onQualityChange = () => { },
    onRemove = () => { }
}) => {
    if (status === 'unsliced') {
        return (
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <p className="text-white">{filename}</p>
                </div>
                <p className="text-gray-400">Your file is being quoted...</p>
                <hr className="w-full border-[#5E5E5E] mt-2" />
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
                <hr className="w-full border-[#5E5E5E] mt-2" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-start justify-between p-4">
                <div className="flex items-center">
                    <div className="w-32 h-32 border border-[#5E5E5E] rounded-md overflow-hidden mr-4">
                        <img src={fileurl} alt={filename} className="w-full h-full object-cover" />
                    </div>

                    <div>
                        <p className="text-white font-bold">{filename}</p>
                        <p className="text-white font-bold">File Mass: <span className="font-light">{filemass}g</span></p>
                        <p className="text-white font-bold">Part Dimensions:</p>
                        <p className="text-white font-bold">X: <span className="font-light">{filedimensions.x}mm</span></p>
                        <p className="text-white font-bold">Y: <span className="font-light">{filedimensions.y}mm</span></p>
                        <p className="text-white font-bold">Z: <span className="font-light">{filedimensions.z}mm</span></p>
                    </div>
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-white font-bold">Part Quantity</p>
                    <div className="flex items-center">
                        <button className="text-white p-1 card-special" onClick={() => onQuantityChange(filename, quantity - 1)}><FaMinus /></button>
                        <p className="mx-2 text-white">{quantity}</p>
                        <button className="text-white p-1 card-special" onClick={() => onQuantityChange(filename, quantity + 1)}><FaPlus /></button>
                    </div>
                    <p className="text-white font-bold">Layer Height (Quality)</p>
                    <select className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1" onChange={(e) => onQualityChange(filename, e.target.value)}>
                        <option value="0.12mm">0.12mm - Best</option>
                        <option value="0.20mm">0.20mm - Default</option>
                        <option value="0.25mm">0.25mm - Draft</option>
                    </select>
                </div>
                <div className="h-full flex flex-col items-end space-y-2">
                    <p className="text-white font-bold">${price}</p>
                    <button className="github-remove" onClick={() => onRemove(filename)}>Remove</button>
                </div>

            </div>
            <hr className="w-full border-[#5E5E5E] mt-2" />
        </div>
    );
};

export default ShoppingCartItem;