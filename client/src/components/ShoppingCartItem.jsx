import React, { Suspense, useState, useEffect, useRef } from 'react';
import { FaMinus, FaPlus, FaSpinner, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { StlViewer } from "react-stl-viewer";
import { toast } from 'sonner'; 
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alertdialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios';


function hexToRgb(hex) {
  try {
    if (typeof hex !== 'string' || !hex) {
      console.log("Invalid hex color");
      return { r: 0, g: 0, b: 0 };
    }
    
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      toast.error('Invalid hex color');
      return { r: 0, g: 0, b: 0 };
    }
    
    return { r, g, b };
  } catch (error) {
    toast.error('Error converting hex to RGB:', error);
    return { r: 0, g: 0, b: 0 };
  }
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
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(quantity);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleQuantityChange = (newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      onQuantityChange(fileid, parsedQuantity);
    } else {
      setEditedQuantity(quantity);
    }
    setIsEditing(false);
  };

  async function forwardFileForReview(fileid, email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact/fileissue`, {
        fileid,
        email
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.status === 200) {
        toast.success('File forwarded for review successfully.');
        setDialogOpen(false);
      } else {
        toast.error('Failed to forward file for review. Please try again.');
      }
    } catch (error) {
      console.error('Error forwarding file for review:', error);
      toast.error('An error occurred while forwarding the file. Please try again.');
    }
  }
  const hexColor = filamentColors.find(color => color.filament_name === filament_color)?.filament_color;
  if (file_status === 'unsliced') {
    return (
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <a href="#" className="hover:underline">
                  <p className="text-white font-bold text-xl sm:text-2xl mb-2">
                    {filename}
                  </p>
                </a>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Download File</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to download {filename}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <a href={utfile_url} download>Download</a>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {isAuthenticated && (
              <div className="mb-2">
                <code className="text-white text-sm px-2 py-1 bg-[#2A2A2A] border border-[#5E5E5E] rounded-md">{fileid}</code>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 lg:mb-0 w-full lg:w-auto">
            <Skeleton className="w-32 h-32 border border-[#5E5E5E] rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-4" />
            <div>
              <p className="text-white font-bold">File Mass: <Skeleton className="inline-block h-4 w-16" /></p>
              <p className="text-white font-bold">Part Dimensions:</p>
              <p className="text-white">X: <Skeleton className="inline-block h-4 w-16" /></p>
              <p className="text-white">Y: <Skeleton className="inline-block h-4 w-16" /></p>
              <p className="text-white">Z: <Skeleton className="inline-block h-4 w-16" /></p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col items-start mb-4 lg:mb-0 w-full lg:w-auto">
            <div className="w-full sm:w-1/2 lg:w-full mb-4 sm:mb-0 sm:mr-2 lg:mr-0">
              <p className="text-white font-bold mb-1">File Color</p>
              <select
                className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full"
                disabled
              >
                <option>Select Color</option>
              </select>
            </div>
            <div className="w-full sm:w-1/2 lg:w-full">
              <p className="text-white font-bold mb-1 mt-2">Layer Height (Quality)</p>
              <select 
                className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full"
                disabled
              >
                <option value="0.20mm">0.20mm - Default</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
            <p className="text-white font-bold mb-1">Part Quantity</p>
            <div className="flex items-center mb-2">
              <button className="text-white p-1 card-special" disabled><FaMinus /></button>
              <p className="mx-2 text-white">1</p>
              <button className="text-white p-1 card-special" disabled><FaPlus /></button>
            </div>
            <div className="flex flex-col items-center justify-center mb-2">
              <p className="text-white font-bold mb-2">Your file is getting quoted...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="github-remove w-full lg:w-auto">Remove</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to remove this file?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove the file from your cart.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(fileid)}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <hr className="w-full border-[#5E5E5E] mt-4" />
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <p className="text-white cursor-pointer hover:underline">
                  <span className="font-bold">Fear not!</span> Click here to forward the file to our team for review.
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Forward File for Review</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll forward this file to our team for review.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                />
                <DialogFooter>
                  <Button type="submit" className="mt-2" onClick={() => {
                    forwardFileForReview(fileid, email);
                  }}>Send for Review</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="github-remove mt-2 sm:mt-0">Remove</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to remove this file?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the file from your cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(fileid)}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <hr className="w-full border-[#5E5E5E] mt-2" />
      </div>
    );
  }

  const contrastColor = getContrastColor(hexColor);

  return (
    <div className="p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <a href="#" className="hover:underline">
            <p className="text-white font-bold text-xl sm:text-2xl mb-2">
              {filename}
            </p>
          </a>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to download {filename}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <a href={utfile_url} download>Download</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
            <p className="text-white font-bold mb-1">File Color</p>
            <select
              className="bg-[#2A2A2A] text-white border border-[#5E5E5E] rounded-lg p-1 w-full"
              value={filament_color}
              onChange={(e) => onColorChange(fileid, e.target.value)}
            >
              {filamentColors.map((color) => (
                <option key={color.filament_id} value={color.filament_name}>
                  {color.filament_name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-1/2 lg:w-full">
            <p className="text-white font-bold mb-1 mt-2">Layer Height (Quality)</p>
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
          <p className="text-white font-bold mb-1">Part Quantity</p>
          <div className="flex items-center mb-2">
            <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity - 1)}><FaMinus /></button>
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                className="mx-2 text-white bg-[#2A2A2A] border border-[#5E5E5E] rounded w-16 text-center"
                value={editedQuantity}
                onChange={(e) => setEditedQuantity(e.target.value)}
                onBlur={() => handleQuantityChange(editedQuantity)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleQuantityChange(editedQuantity);
                  }
                }}
              />
            ) : (
              <div className="flex items-center mx-2 text-white cursor-pointer" onClick={() => setIsEditing(true)}>
                <span>{quantity}</span>
                <FaEdit className="ml-1 text-xs" />
              </div>
            )}
            <button className="text-white p-1 card-special" onClick={() => onQuantityChange(fileid, quantity + 1)}><FaPlus /></button>
          </div>
          <p className="text-white font-bold text-lg mb-2">${price}</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="github-remove w-full lg:w-auto">Remove</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to remove this file?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the file from your cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(fileid)}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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