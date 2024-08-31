import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/Cart';
import { FaInfoCircle, FaCopy, FaCheck } from 'react-icons/fa';
import m3d_logo from '../assets/images/m3d_logo.png';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const [showTooltip, setShowTooltip] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <footer className="bg-[#2A2A2A] text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="flex items-center">
            <img src={m3d_logo} alt="Logo" className="h-8 mr-2 rounded-lg" />
            <span>© 2024 Mandarin 3D Prints</span>
          </div>
          {isAuthenticated && cart.cart_id && (
            <div className='flex flex-col items-center md:items-start'>
              <p className='text-sm mt-2 px-2 py-1'>Cart ID: <code className="bg-gray-700 px-2 py-1 rounded">{cart.cart_id}</code></p>
              <div className="relative">
                <p 
                  className='text-sm mt-1 px-2 py-1 flex items-center cursor-pointer'
                  onMouseEnter={() => setShowTooltip(true)}
                >
                  Files in cart: {cart.files.length}
                  <FaInfoCircle className="ml-1" />
                </p>
                {showTooltip && cart.files.length > 0 && (
                  <div 
                    className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white p-2 rounded shadow-lg z-10 whitespace-nowrap"
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <p className="font-bold mb-1">File IDs (click to copy):</p>
                    <ul className="list-none">
                      {cart.files.map((file, index) => (
                        <li key={index} className="mb-1">
                          <button
                            onClick={() => handleCopy(file)}
                            className="flex items-center hover:bg-gray-700 p-1 rounded w-full"
                          >
                            {copiedId === file ? (
                              <FaCheck className="mr-2 text-green-500 flex-shrink-0" />
                            ) : (
                              <FaCopy className="mr-2 flex-shrink-0" />
                            )}
                            <span className="truncate">{file}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-4 mb-4 md:mb-0">
          {!isAuthenticated ? (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
              <Link to="/admin" className="text-white hover:text-gray-400 font-extralight text-sm">Admin Login</Link>
              <Link to="/privacy-policy" className="text-white hover:text-gray-400 font-extralight text-sm">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-white hover:text-gray-400 font-extralight text-sm">Terms of Service</Link>
            </div>
          ) : (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-white hover:text-gray-400 font-light text-sm">Admin</Link>
              ) : null}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
                <Link to="/account" className="text-white hover:text-gray-400 font-light text-sm">{user.username}'s account</Link>
              </div>
            </>
          )}
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
