import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCube, FaCode } from 'react-icons/fa';

function CadViewerNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 bg-[#1a1b1e]/90 backdrop-blur-sm rounded-full border border-[#F82484]/30 shadow-lg">
      <div className="flex items-center p-1">
        <Link
          to="/adamcad"
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
            currentPath === '/adamcad'
              ? 'bg-[#F82484] text-white'
              : 'text-white/70 hover:text-white hover:bg-[#F82484]/20'
          }`}
        >
          <FaCube className="mr-2" />
          <span className="font-medium">Babylon.js Viewer</span>
        </Link>
        
        <Link
          to="/wasmcad"
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
            currentPath === '/wasmcad'
              ? 'bg-[#F82484] text-white'
              : 'text-white/70 hover:text-white hover:bg-[#F82484]/20'
          }`}
        >
          <FaCode className="mr-2" />
          <span className="font-medium">WASM Viewer</span>
        </Link>
      </div>
    </div>
  );
}

export default CadViewerNav; 