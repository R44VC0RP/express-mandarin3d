import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaTimes } from 'react-icons/fa';

const FileUploadProgress = ({ files, onRemove }) => {
  const [visibleFiles, setVisibleFiles] = useState(files);

  useEffect(() => {
    const timers = {};

    files.forEach((file, index) => {
      if (file.status === 'success' || file.status === 'error') {
        timers[index] = setTimeout(() => {
          setVisibleFiles(prev => prev.filter((_, i) => i !== index));
        }, 5000);
      }
    });

    setVisibleFiles(files);

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [files]);

  if (visibleFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white rounded-lg p-4 shadow-lg shadow-black/50 max-w-xs w-full sm:max-w-xs transition-opacity duration-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">File Upload Progress</h3>
        <button onClick={() => onRemove(null)} className="text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {visibleFiles.map((file, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {file.status === 'uploading' && <FaSpinner className="animate-spin text-blue-500 mr-2" />}
                {file.status === 'success' && <FaCheckCircle className="text-green-500 mr-2" />}
                {file.status === 'error' && <FaTimesCircle className="text-red-500 mr-2" />}
                <p className="font-semibold truncate max-w-[200px]">{file.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadProgress;