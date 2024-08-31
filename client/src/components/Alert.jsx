import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Alert = ({ type, title, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade-out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertStyle = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-white mr-2" />;
      case 'success':
        return <FaCheckCircle className="text-white mr-2" />;
      case 'error':
        return <FaExclamationCircle className="text-white mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${getAlertStyle()} text-white rounded-lg p-4 shadow-lg max-w-md w-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold flex items-center">
          {getIcon()}
          {title}
        </h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FaTimes />
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Alert;