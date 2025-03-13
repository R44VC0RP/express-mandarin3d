import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowRight, 
  FaCheck, 
  FaSpinner, 
  FaRedo, 
  FaUser, 
  FaRobot, 
  FaPlus, 
  FaComments, 
  FaChevronLeft, 
  FaChevronRight, 
  FaBars, 
  FaCommentAlt, 
  FaCog, 
  FaSlidersH, 
  FaRuler, 
  FaCube, 
  FaHome, 
  FaCamera, 
  FaEye, 
  FaDownload, 
  FaSave 
} from 'react-icons/fa';
import CadViewerNav from './CadViewerNav';
import WasmCadViewer from './WasmCadViewer';

// Parameter slider component
function ParameterSlider({ label, value, min, max, step, onChange, unit = "mm" }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white/90 text-xs font-medium">{label}</span>
        <span className="text-white bg-[#1a1b1e]/80 px-1.5 py-0.5 rounded text-xs">
          {value} <span className="text-xs text-white/70">{unit}</span>
        </span>
      </div>
      <div className="flex items-center relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-[#F82484]"
          style={{
            background: `linear-gradient(to right, #F82484 0%, #F82484 ${((value - min) / (max - min)) * 100}%, #2a2b2e ${((value - min) / (max - min)) * 100}%, #2a2b2e 100%)`
          }}
        />
      </div>
    </div>
  );
}

// Chat message component
function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex items-start max-w-[80%]">
        {!isUser && (
          <div className="bg-[#1a1b1e]/80 rounded-full p-2 mr-2 shadow-lg border border-[#2a2b2e]">
            <img 
              src="https://app.adamcad.com/adam-logo.svg" 
              alt="AI Agent" 
              className="w-10" 
            />
          </div>
        )}
        <div
          className={`rounded-lg px-4 py-2 shadow-lg ${
            isUser 
              ? 'bg-[#1a1b1e]/80 text-white border border-[#2a2b2e]' 
              : 'bg-gradient-to-br from-[#1a1b1e]/90 to-[#1a1b1e]/70 text-white border border-[#2a2b2e]'
          }`}
        >
          <p className="text-sm">{message.text}</p>
          {message.version && (
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-400 mr-2">v{message.version}</span>
              <button className="inline-flex items-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 px-3 py-1 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 hover:text-white bg-[#2D2D2D] shadow-adam justify-center mr-1 transition-all duration-200">
                <FaCheck className="mr-1 h-3 w-3" /> restore
              </button>
              {message.retry && (
                <button className="inline-flex items-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 px-3 py-1 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 hover:text-white bg-[#2D2D2D] shadow-adam justify-center transition-all duration-200">
                  <FaRedo className="mr-1 h-3 w-3" /> retry
                </button>
              )}
            </div>
          )}
        </div>
        {isUser && (
          <div className="bg-[#1a1b1e]/80 rounded-full p-2 ml-2 mt-1 shadow-lg border border-[#2a2b2e]">
            <FaUser className="text-gray-400 text-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar item component
function SidebarItem({ icon: Icon, text, active, onClick }) {
  return (
    <div 
      className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      <Icon className="mr-3" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// Creation item component
function CreationItem({ text, active, onClick }) {
  return (
    <div 
      className={`pl-8 pr-4 py-1.5 cursor-pointer transition-colors text-sm ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

// Welcome screen component
function WelcomeScreen({ onStartChat }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-[#F82484] to-[#F82484]/70">
        What can I help you build?
      </h1>
      <p className="text-lg text-white/60 mb-12 max-w-2xl">
        Describe the 3D part you want to create and I'll help you build it.
      </p>
      
      <div className="w-full max-w-2xl relative">
        <input
          type="text"
          placeholder="Describe an object..."
          className="w-full bg-[#1a1b1e]/50 border border-[#2a2b2e] text-white rounded-lg px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F82484]/50 shadow-lg backdrop-blur-sm"
        />
        <button
          onClick={onStartChat}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 w-9 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#F82484] shadow-adam transition-all duration-200"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

// CAD Controls Component
const CADControls = ({ onMeasure, measurementMode }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2 bg-[#1a1b1e]/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-[#2a2b2e] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      <button 
        className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full ${
          measurementMode 
            ? 'border-[#F82484] bg-[#F82484]/30 text-white shadow-[0_0_15px_rgba(248,36,132,0.6)]' 
            : 'border-[#F82484]/50 hover:bg-[#F82484]/40 bg-[#2D2D2D] hover:shadow-[0_0_15px_rgba(248,36,132,0.4)]'
        } shadow-adam transition-all duration-200`}
        onClick={onMeasure}
        title={measurementMode ? "Measuring (click to cancel)" : "Measure"}
      >
        <FaRuler />
      </button>
      <div className="h-4 border-r border-[#2a2b2e]"></div>
      <button 
        className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_15px_rgba(248,36,132,0.4)]"
        title="Top View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </button>
      <button 
        className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_15px_rgba(248,36,132,0.4)]"
        title="Front View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      </button>
      <button 
        className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_15px_rgba(248,36,132,0.4)]"
        title="Side View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>
      <div className="h-4 border-r border-[#2a2b2e]"></div>
      <button 
        className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
        title="Wireframe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      </button>
      <button 
        className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
        title="Solid"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      </button>
    </div>
  );
};

function AdamCad() {
  // State for parameters
  const [parameters, setParameters] = useState({
    studSpacing: 8,
    height: 9.6,
    wallThickness: 1.2,
    cylinderDiameter: 4.8,
    cylinderHeight: 1.8,
    studCenterOffset: 3.9,
    innerTubeDiameter: 4.8,
    innerTubeWall: 0.85,
    innerTubeOffset: 7.9,
    resolution: 100
  });

  // Parameter units mapping
  const parameterUnits = {
    studSpacing: "mm",
    height: "mm",
    wallThickness: "mm",
    cylinderDiameter: "mm",
    cylinderHeight: "mm",
    studCenterOffset: "mm",
    innerTubeDiameter: "mm",
    innerTubeWall: "mm",
    innerTubeOffset: "mm",
    resolution: "segments"
  };

  // Sample chat messages
  const [messages, setMessages] = useState([
    { text: "Welcome to Adam CAD! How can I help you today?", isUser: false },
    { text: "I need to create a LEGO brick", isUser: true },
    { text: "I can help with that! What dimensions would you like for your LEGO brick?", isUser: false },
    { text: "Let's start with a standard 2x4 brick", isUser: true },
    { 
      text: "I've created a 2x4 LEGO brick for you. You can adjust the parameters on the right panel.",
      isUser: false,
      version: "10"
    },
    { text: "ok what about 4×7", isUser: true },
    { 
      text: "I've updated the model to a 4×7 brick. You can see it in the viewer.",
      isUser: false,
      version: "11"
    },
    { text: "now try 8×10", isUser: true },
    { 
      text: "I've created an 8×10 brick. The model has been updated in the viewer.",
      isUser: false,
      version: "12"
    },
    { text: "ok go back to 2×4", isUser: true },
    { 
      text: "I've reverted to a 2×4 brick as requested. You can continue adjusting parameters if needed.",
      isUser: false,
      version: "13",
      retry: true
    }
  ]);

  // State for sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [activeCreation, setActiveCreation] = useState("LEGO Brick");
  
  // State for panel visibility and size
  const [chatMinimized, setChatMinimized] = useState(false);
  const [paramsMinimized, setParamsMinimized] = useState(false);
  const [chatWidth, setChatWidth] = useState(350); // Default width in pixels
  const [paramsWidth, setParamsWidth] = useState(350); // Default width in pixels
  
  // Refs for resizing
  const chatResizeRef = useRef(null);
  const paramsResizeRef = useRef(null);
  const chatPanelRef = useRef(null);
  const paramsPanelRef = useRef(null);

  // WASM viewer state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [distance, setDistance] = useState(null);
  const [viewAngles, setViewAngles] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const wasmViewerRef = useRef(null);
  
  // New state for display options
  const [showDimensions, setShowDimensions] = useState(true);
  const [unitSystem, setUnitSystem] = useState('mm');
  const [modelDimensions, setModelDimensions] = useState(null);

  // Function to toggle dimension lines in the viewer
  const toggleDimensionLines = (show) => {
    if (wasmViewerRef.current?.toggleDimensionLines) {
      wasmViewerRef.current.toggleDimensionLines(show);
    }
  };

  // Update dimension lines when showDimensions changes
  useEffect(() => {
    toggleDimensionLines(showDimensions);
  }, [showDimensions]);

  // Sample creations
  const creations = [
    "LEGO Brick",
    "create a square with rounded edges",
    "create a plaque that says Ryan",
    "create a shelf that has a bottom",
    "Propellor Blade"
  ];

  // Function to handle parameter changes
  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  // Function to handle sending a new message
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    setMessages(prev => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          text: `I've processed your request: "${newMessage}". Is there anything else you'd like to adjust?`,
          isUser: false
        }
      ]);
    }, 1000);
  };

  // Setup resize handlers
  useEffect(() => {
    const handleChatResize = (e) => {
      if (!chatResizeRef.current || chatMinimized) return;
      
      const newWidth = Math.max(250, Math.min(500, e.clientX));
      setChatWidth(newWidth);
    };
    
    const handleParamsResize = (e) => {
      if (!paramsResizeRef.current || paramsMinimized) return;
      
      const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX));
      setParamsWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      chatResizeRef.current = null;
      paramsResizeRef.current = null;
      document.body.style.cursor = 'default';
    };
    
    const handleMouseMove = (e) => {
      if (chatResizeRef.current) {
        handleChatResize(e);
      } else if (paramsResizeRef.current) {
        handleParamsResize(e);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [chatMinimized, paramsMinimized]);

  // Chat panel resize handler
  const startChatResize = (e) => {
    chatResizeRef.current = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  };
  
  // Parameters panel resize handler
  const startParamsResize = (e) => {
    paramsResizeRef.current = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  };

  // WASM viewer control functions
  const toggleMeasurement = () => {
    if (wasmViewerRef.current) {
      wasmViewerRef.current.toggleMeasurement();
    }
  };

  const handleResetView = () => {
    if (wasmViewerRef.current) {
      wasmViewerRef.current.resetView();
    }
  };

  const handleResetMeasurements = () => {
    if (wasmViewerRef.current) {
      wasmViewerRef.current.resetMeasurements();
    }
  };

  const handleTakeScreenshot = () => {
    if (wasmViewerRef.current) {
      wasmViewerRef.current.takeScreenshot();
    }
  };

  const handleCloseScreenshot = () => {
    setShowScreenshot(false);
    setScreenshotUrl(null);
  };

  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `mandarin3d-model-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Callbacks for WASM viewer
  const handleMeasurementChange = (newDistance) => {
    setDistance(newDistance);
  };

  const handleViewAnglesChange = (newAngles) => {
    setViewAngles(newAngles);
  };

  const handleScreenshotTaken = (url) => {
    setScreenshotUrl(url);
    setShowScreenshot(true);
  };

  const handleModelDimensionsCalculated = (dimensions) => {
    setModelDimensions(dimensions);
  };

  // Screenshot Modal (placed at the root level to ensure it's above everything)
  const ScreenshotModal = () => {
    if (!showScreenshot || !screenshotUrl) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-[#1a1b1e] rounded-lg border border-[#F82484]/30 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
          <div className="flex items-center justify-between p-4 border-b border-[#F82484]/20 bg-gradient-to-r from-[#1a1b1e] to-[#1a1b1e]/90">
            <h3 className="text-white text-lg font-medium flex items-center">
              <FaCamera className="text-[#F82484] mr-2" />
              Model Screenshot
            </h3>
            <button 
              className="text-white/70 hover:text-white hover:bg-[#F82484]/20 p-1.5 rounded-full transition-colors"
              onClick={handleCloseScreenshot}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-auto">
            <img 
              src={screenshotUrl} 
              alt="Model Screenshot" 
              className="max-w-full h-auto rounded-md border border-[#2a2b2e] shadow-lg"
            />
          </div>
          <div className="p-4 border-t border-[#F82484]/20 flex justify-end bg-gradient-to-r from-[#1a1b1e] to-[#1a1b1e]/90">
            <button 
              className="inline-flex items-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
              onClick={handleDownloadScreenshot}
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Download Image
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden">
      {/* Navigation */}
      {/* <CadViewerNav /> */}
      
      {/* Screenshot Modal - Rendered at the root level */}
      <ScreenshotModal />
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarCollapsed ? 'w-0' : 'w-64'
        } bg-[#121212] border-r border-[#2a2b2e] transition-all duration-300 flex flex-col h-full relative z-20`}
      >
        {!sidebarCollapsed && (
          <>
            {/* Logo */}
            <div className="p-4 flex items-center justify-center space-x-2">
              <img src="https://app.adamcad.com/beta-logo.png" alt="Adam CAD" className="h-8" />
              <img 
                src="https://framerusercontent.com/images/mAZA0MyPjfiYpXC3wZP2ERvzVI.png?scale-down-to=1024" 
                alt="AI Agent" 
                className="h-6 w-6 animate-pulse" 
              />
            </div>
            
            {/* New Chat Button */}
            <button 
              className="mx-4 my-3 inline-flex items-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 hover:text-white bg-[#2D2D2D] shadow-adam justify-center mb-4 transition-all duration-200 shadow-[0_0_15px_rgba(248,36,132,0.3)]"
              onClick={() => setShowChat(false)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <div className="font-semibold">New Chat</div>
            </button>
            
            {/* Navigation */}
            <div className="mt-4">
              <SidebarItem 
                icon={FaCommentAlt} 
                text="Creations" 
                active={true} 
                onClick={() => {}}
              />
              
              {/* Creations List */}
              <div className="mt-1">
                {creations.map((creation, index) => (
                  <CreationItem 
                    key={index}
                    text={creation}
                    active={creation === activeCreation}
                    onClick={() => setActiveCreation(creation)}
                  />
                ))}
              </div>
            </div>
            
            {/* Bottom Items */}
            <div className="mt-auto">
              <SidebarItem 
                icon={FaComments} 
                text="Feedback" 
                active={false} 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={FaBars} 
                text="Toggle Sidebar" 
                active={false} 
                onClick={() => setSidebarCollapsed(true)}
              />
              
              {/* User Profile */}
              <div className="p-4 border-t border-[#2a2b2e] mt-2 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white text-[#121212] flex items-center justify-center font-semibold">
                  RV
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">Ryan Vogel</div>
                  <div className="text-xs text-gray-500">ryan@mandarin3d.com</div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Collapse/Expand Button */}
        {sidebarCollapsed && (
          <button 
            className="absolute top-4 right-0 transform translate-x-1/2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam z-50"
            onClick={() => setSidebarCollapsed(false)}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* WASM Viewer (Always visible) */}
        <div className="absolute inset-0 z-0">
          <WasmCadViewer 
            ref={wasmViewerRef}
            onMeasurementChange={handleMeasurementChange}
            onViewAnglesChange={handleViewAnglesChange}
            onScreenshotTaken={handleScreenshotTaken}
            onModelDimensionsCalculated={handleModelDimensionsCalculated}
            isMeasuringExternal={isMeasuring}
            setIsMeasuringExternal={setIsMeasuring}
            unitSystem={unitSystem}
            showControls={false}
          />
          <CADControls onMeasure={toggleMeasurement} measurementMode={isMeasuring} />
        </div>

        {showChat ? (
          /* Floating Panels Container */
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="flex h-full p-4">
              {/* Left Column - Chat Panel */}
              <div 
                ref={chatPanelRef}
                className={`pointer-events-auto flex flex-col h-full transition-all duration-300 ease-in-out ${
                  chatMinimized ? 'w-12' : `w-[${chatWidth}px]`
                }`}
                style={{ width: chatMinimized ? '48px' : `${chatWidth}px` }}
              >
                {chatMinimized ? (
                  <button 
                    onClick={() => setChatMinimized(false)}
                    className="h-12 w-12 rounded-full bg-[#121212]/90 backdrop-blur-md border border-[#2a2b2e] shadow-xl flex items-center justify-center text-white hover:bg-[#F82484]/20 transition-colors"
                  >
                    <FaCommentAlt className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col rounded-2xl overflow-hidden backdrop-blur-md bg-[#121212]/70 border border-[#2a2b2e] shadow-xl">
                    <div className="p-4 border-b border-[#2a2b2e]/70 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Chat</h2>
                      <div className="flex items-center">
                        <button 
                          onClick={() => setChatMinimized(true)}
                          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 w-8 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam mr-2 transition-all duration-200"
                        >
                          <FaChevronLeft className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Chat history */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {messages.map((message, index) => (
                        <ChatMessage 
                          key={index} 
                          message={message} 
                          isUser={message.isUser} 
                        />
                      ))}
                    </div>
                    
                    {/* Chat input */}
                    <div className="p-4 border-t border-[#2a2b2e]/70 bg-[#121212]/80">
                      <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Describe an object..."
                          className="flex-1 bg-[#1a1b1e]/60 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F82484]/30 border border-[#2a2b2e]/70 border-r-0 backdrop-blur-sm"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-r-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/80 bg-[#F82484] shadow-adam transition-all duration-200 shadow-[0_0_15px_rgba(248,36,132,0.4)]"
                        >
                          <FaArrowRight />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Resize Handle */}
                {!chatMinimized && (
                  <div 
                    className="absolute top-0 right-0 w-1 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-[#F82484]/50 transition-opacity"
                    onMouseDown={startChatResize}
                  />
                )}
              </div>
              
              {/* Spacer */}
              <div className="flex-1" />
              
              {/* Right Column - Parameters Panel */}
              <div 
                ref={paramsPanelRef}
                className={`pointer-events-auto flex flex-col h-full transition-all duration-300 ease-in-out ${
                  paramsMinimized ? 'w-12' : `w-[${paramsWidth}px]`
                }`}
                style={{ width: paramsMinimized ? '48px' : `${paramsWidth}px` }}
              >
                {paramsMinimized ? (
                  <button 
                    onClick={() => setParamsMinimized(false)}
                    className="h-12 w-12 rounded-full bg-[#121212]/90 backdrop-blur-md border border-[#2a2b2e] shadow-xl flex items-center justify-center text-white hover:bg-[#F82484]/20 transition-colors ml-auto"
                  >
                    <FaSlidersH className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col rounded-2xl overflow-hidden backdrop-blur-md bg-[#121212]/70 border border-[#2a2b2e] shadow-xl">
                    <div className="p-3 border-b border-[#2a2b2e]/70 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Parameters</h2>
                      <div className="flex items-center">
                        <button 
                          onClick={() => setParamsMinimized(true)}
                          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 w-7 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam mr-1 transition-all duration-200"
                        >
                          <FaChevronRight className="h-3 w-3" />
                        </button>
                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 w-7 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200">
                          <FaRedo className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                      {/* WASM Viewer Controls */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-white/90 mb-2 border-b border-[#2a2b2e]/70 pb-1">Viewer Controls</h3>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button 
                            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 px-3 py-1 rounded-lg border ${isMeasuring ? 'border-[#F82484] bg-[#F82484]/20 shadow-[0_0_15px_rgba(248,36,132,0.4)]' : 'border-[#F82484]/50 hover:bg-[#F82484]/40 hover:shadow-[0_0_10px_rgba(248,36,132,0.3)]'} bg-[#2D2D2D] shadow-adam transition-all duration-200`}
                            onClick={toggleMeasurement}
                          >
                            <FaRuler className="mr-1.5 h-3 w-3" />
                            {isMeasuring ? "Measuring..." : "Measure"}
                          </button>
                          
                          <button 
                            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 px-3 py-1 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_10px_rgba(248,36,132,0.3)]"
                            onClick={handleResetView}
                          >
                            <FaHome className="mr-1.5 h-3 w-3" />
                            Reset View
                          </button>
                          
                          <button 
                            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 px-3 py-1 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_10px_rgba(248,36,132,0.3)]"
                            onClick={handleResetMeasurements}
                          >
                            <FaCube className="mr-1.5 h-3 w-3" />
                            Clear Measures
                          </button>
                          
                          <button 
                            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-8 px-3 py-1 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 hover:shadow-[0_0_10px_rgba(248,36,132,0.3)]"
                            onClick={handleTakeScreenshot}
                          >
                            <FaCamera className="mr-1.5 h-3 w-3" />
                            Screenshot
                          </button>
                        </div>

                        {/* Display Options */}
                        <div className="mt-4 mb-3">
                          <h4 className="text-xs font-medium text-white/80 mb-2">Display Options</h4>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/80">Show Dimensions</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={showDimensions}
                                onChange={() => setShowDimensions(!showDimensions)}
                              />
                              <div className="w-9 h-5 bg-[#2D2D2D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F82484]"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/80">Units</span>
                            <div className="flex rounded-md overflow-hidden border border-[#2a2b2e]">
                              <button
                                className={`px-2 py-1 text-xs ${unitSystem === 'mm' ? 'bg-[#F82484] text-white shadow-[0_0_10px_rgba(248,36,132,0.3)]' : 'bg-[#2D2D2D] text-white/70 hover:bg-[#3D3D3D]'}`}
                                onClick={() => setUnitSystem('mm')}
                              >
                                mm
                              </button>
                              <button
                                className={`px-2 py-1 text-xs ${unitSystem === 'in' ? 'bg-[#F82484] text-white shadow-[0_0_10px_rgba(248,36,132,0.3)]' : 'bg-[#2D2D2D] text-white/70 hover:bg-[#3D3D3D]'}`}
                                onClick={() => setUnitSystem('in')}
                              >
                                in
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Measurement Display */}
                        {distance && (
                          <div className="mb-3 bg-[#1a1b1e]/60 rounded-lg p-3 border border-[#F82484]/30 shadow-[0_0_10px_rgba(248,36,132,0.15)]">
                            <div className="flex items-center mb-1">
                              <FaRuler className="text-[#F82484] mr-2" />
                              <span className="text-white/90 font-medium">Measurement</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-white/70 text-xs">Distance:</span>
                              <span className="text-white font-medium bg-[#F82484]/20 px-2 py-1 rounded text-sm">
                                {unitSystem === 'mm' 
                                  ? `${distance} mm` 
                                  : `${(distance / 25.4).toFixed(3)} in`}
                              </span>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <button 
                                onClick={handleResetMeasurements}
                                className="text-xs text-white/70 hover:text-white flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                Clear
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Model Dimensions Display */}
                        {showDimensions && modelDimensions && (
                          <div className="mb-3 bg-[#1a1b1e]/60 rounded-lg p-2 border border-[#2a2b2e]">
                            <div className="flex items-center mb-1 text-xs">
                              <FaCube className="text-[#F82484] mr-2 h-3 w-3" />
                              <span className="text-white/90 font-medium">Model Dimensions</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                              <span className="text-white/70">Width:</span>
                              <span className="text-white">
                                {unitSystem === 'mm' 
                                  ? `${modelDimensions.width.toFixed(2)} mm` 
                                  : `${(modelDimensions.width / 25.4).toFixed(3)} in`}
                              </span>
                              <span className="text-white/70">Height:</span>
                              <span className="text-white">
                                {unitSystem === 'mm' 
                                  ? `${modelDimensions.height.toFixed(2)} mm` 
                                  : `${(modelDimensions.height / 25.4).toFixed(3)} in`}
                              </span>
                              <span className="text-white/70">Depth:</span>
                              <span className="text-white">
                                {unitSystem === 'mm' 
                                  ? `${modelDimensions.depth.toFixed(2)} mm` 
                                  : `${(modelDimensions.depth / 25.4).toFixed(3)} in`}
                              </span>
                              <span className="text-white/70">Volume:</span>
                              <span className="text-white">
                                {unitSystem === 'mm' 
                                  ? `${(modelDimensions.volume / 1000).toFixed(2)} cm³` 
                                  : `${(modelDimensions.volume / 16387.064).toFixed(3)} in³`}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* View Angles Display */}
                        {viewAngles && (
                          <div className="bg-[#1a1b1e]/60 rounded-lg p-2 border border-[#2a2b2e]">
                            <div className="flex items-center mb-1 text-xs">
                              <FaEye className="text-[#F82484] mr-2 h-3 w-3" />
                              <span className="text-white/90 font-medium">View Information</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                              <span className="text-white/70">Azimuth:</span>
                              <span className="text-white">{viewAngles.azimuth}°</span>
                              <span className="text-white/70">Elevation:</span>
                              <span className="text-white">{viewAngles.elevation}°</span>
                              <span className="text-white/70">Distance:</span>
                              <span className="text-white">{viewAngles.distance} units</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Model Parameters Section */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-white/90 mb-2 border-b border-[#2a2b2e]/70 pb-1">Model Parameters</h3>
                        <ParameterSlider
                          label="Stud Spacing"
                          value={parameters.studSpacing}
                          min={4}
                          max={12}
                          step={0.1}
                          unit={parameterUnits.studSpacing}
                          onChange={(e) => handleParameterChange("studSpacing", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Height"
                          value={parameters.height}
                          min={5}
                          max={15}
                          step={0.1}
                          unit={parameterUnits.height}
                          onChange={(e) => handleParameterChange("height", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Wall Thickness"
                          value={parameters.wallThickness}
                          min={0.5}
                          max={2}
                          step={0.1}
                          unit={parameterUnits.wallThickness}
                          onChange={(e) => handleParameterChange("wallThickness", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Cylinder Diameter"
                          value={parameters.cylinderDiameter}
                          min={2}
                          max={6}
                          step={0.1}
                          unit={parameterUnits.cylinderDiameter}
                          onChange={(e) => handleParameterChange("cylinderDiameter", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Cylinder Height"
                          value={parameters.cylinderHeight}
                          min={1}
                          max={3}
                          step={0.1}
                          unit={parameterUnits.cylinderHeight}
                          onChange={(e) => handleParameterChange("cylinderHeight", parseFloat(e.target.value))}
                        />
                      </div>

                      {/* Advanced Parameters Section */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-white/90 mb-2 border-b border-[#2a2b2e]/70 pb-1">Advanced</h3>
                        <ParameterSlider
                          label="Stud Center Offset"
                          value={parameters.studCenterOffset}
                          min={2}
                          max={5}
                          step={0.1}
                          unit={parameterUnits.studCenterOffset}
                          onChange={(e) => handleParameterChange("studCenterOffset", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Inner Tube Diameter"
                          value={parameters.innerTubeDiameter}
                          min={3}
                          max={6}
                          step={0.1}
                          unit={parameterUnits.innerTubeDiameter}
                          onChange={(e) => handleParameterChange("innerTubeDiameter", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Inner Tube Wall"
                          value={parameters.innerTubeWall}
                          min={0.5}
                          max={1.5}
                          step={0.01}
                          unit={parameterUnits.innerTubeWall}
                          onChange={(e) => handleParameterChange("innerTubeWall", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Inner Tube Offset"
                          value={parameters.innerTubeOffset}
                          min={5}
                          max={10}
                          step={0.1}
                          unit={parameterUnits.innerTubeOffset}
                          onChange={(e) => handleParameterChange("innerTubeOffset", parseFloat(e.target.value))}
                        />
                        
                        <ParameterSlider
                          label="Resolution"
                          value={parameters.resolution}
                          min={50}
                          max={200}
                          step={1}
                          unit={parameterUnits.resolution}
                          onChange={(e) => handleParameterChange("resolution", parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        <div className="w-6 h-6 rounded-md mr-2 shadow-lg" style={{ backgroundColor: "#F82484" }}></div>
                        <span className="text-xs text-white/90"># F82484</span>
                      </div>
                    </div>
                    <div className="p-3 border-t border-[#2a2b2e]/70 flex flex-col">
                      <div className="flex flex-col space-y-2">
                        <button className="inline-flex items-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 px-3 py-1 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 hover:text-white bg-[#2D2D2D] shadow-adam justify-center transition-all duration-200">
                          <FaDownload className="mr-1 h-3 w-3" /> Download STEP
                        </button>
                        <button className="inline-flex items-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 px-3 py-1 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 hover:text-white bg-[#2D2D2D] shadow-adam justify-center transition-all duration-200">
                          <FaDownload className="mr-1 h-3 w-3" /> Download STL
                        </button>
                        <button className="inline-flex items-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-7 px-3 py-1 rounded-full border border-[#466F80]/50 text-white hover:bg-[#466F80]/40 hover:text-white bg-[#093739] shadow-adam justify-center transition-all duration-200">
                          <FaSpinner className="mr-1 h-3 w-3" /> 3D Print via Mandarin 3D
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Resize Handle */}
                {!paramsMinimized && (
                  <div 
                    className="absolute top-0 left-0 w-1 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-[#F82484]/50 transition-opacity"
                    onMouseDown={startParamsResize}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Welcome Screen
          <div className="flex-1 bg-gradient-to-b from-[#121212]/80 to-[#1a1a1a]/80 backdrop-blur-sm flex items-center justify-center">
            <WelcomeScreen onStartChat={() => setShowChat(true)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdamCad;
