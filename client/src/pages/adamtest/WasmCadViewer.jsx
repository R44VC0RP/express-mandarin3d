import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { FaArrowRight, FaSpinner, FaSlidersH, FaRuler, FaCube, FaHome, FaExpand, FaCompress, FaCamera, FaEye, FaDownload } from 'react-icons/fa';
import CadViewerNav from './CadViewerNav';

// WASM-based CAD Viewer component
const WasmCadViewer = forwardRef(({
  onMeasurementChange,
  onViewAnglesChange,
  onScreenshotTaken,
  onModelDimensionsCalculated,
  isMeasuringExternal,
  setIsMeasuringExternal,
  unitSystem = 'mm',
  showControls = true
}, ref) => {
  const canvasRef = useRef(null);
  const wasmModuleRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(isMeasuringExternal || false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [distance, setDistance] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [viewAngles, setViewAngles] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [modelDimensions, setModelDimensions] = useState(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    toggleMeasurement: () => {
      toggleMeasurement();
    },
    resetView: () => {
      handleResetView();
    },
    resetMeasurements: () => {
      handleResetMeasurements();
    },
    takeScreenshot: () => {
      handleTakeScreenshot();
    },
    getViewAngles: () => {
      return viewAngles;
    },
    getDistance: () => {
      return distance;
    },
    getModelDimensions: () => {
      return modelDimensions;
    }
  }));

  // Sync with external measurement state if provided
  useEffect(() => {
    if (setIsMeasuringExternal && isMeasuring !== isMeasuringExternal) {
      setIsMeasuring(isMeasuringExternal);
    }
  }, [isMeasuringExternal]);

  // Notify parent of measurement changes
  useEffect(() => {
    if (onMeasurementChange && distance !== null) {
      onMeasurementChange(distance);
    }
  }, [distance, onMeasurementChange]);

  // Notify parent of view angle changes
  useEffect(() => {
    if (onViewAnglesChange && viewAngles !== null) {
      onViewAnglesChange(viewAngles);
    }
  }, [viewAngles, onViewAnglesChange]);

  // Notify parent of screenshot taken
  useEffect(() => {
    if (onScreenshotTaken && screenshotUrl !== null) {
      onScreenshotTaken(screenshotUrl);
    }
  }, [screenshotUrl, onScreenshotTaken]);

  // Notify parent of model dimensions calculated
  useEffect(() => {
    if (onModelDimensionsCalculated && modelDimensions !== null) {
      onModelDimensionsCalculated(modelDimensions);
    }
  }, [modelDimensions, onModelDimensionsCalculated]);

  // Initialize the WASM module and set up the viewer
  useEffect(() => {
    // We'll use Three.js compiled to WASM for our initial implementation
    // This is a simplified version - in a real app, you'd use a proper WASM module
    
    async function initWasmViewer() {
      try {
        setLoading(true);
        
        // In a real implementation, we would load the WASM module like this:
        // const wasmModule = await WebAssembly.instantiateStreaming(
        //   fetch('/cad-engine.wasm'),
        //   { env: { /* environment functions */ } }
        // );
        // wasmModuleRef.current = wasmModule.instance.exports;
        
        // For now, we'll use Three.js directly from JavaScript as a placeholder
        // and simulate the WASM integration
        const THREE = await import('three');
        const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        
        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        
        const camera = new THREE.PerspectiveCamera(
          75,
          canvasRef.current.clientWidth / canvasRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(15, 15, 15);
        
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          preserveDrawingBuffer: true // Required for screenshots
        });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xf82484, 0.5);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);
        
        // Add controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        
        // Add grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        scene.add(gridHelper);
        
        // Add axes
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        // Create measurement tools
        const measurementGroup = new THREE.Group();
        scene.add(measurementGroup);
        
        const measurePointMaterial = new THREE.MeshBasicMaterial({ color: 0xf82484 });
        const measureLineMaterial = new THREE.LineBasicMaterial({ 
          color: 0xf82484,
          linewidth: 3 // Note: Due to WebGL limitations, line width may not work in all browsers
        });
        
        // Raycaster for measurements
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // Text sprite for measurement label
        const createTextSprite = (value) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 256;
          canvas.height = 128;
          
          // Format the measurement value based on unit system
          const formattedValue = unitSystem === 'mm' 
            ? `${value} mm` 
            : `${(parseFloat(value) / 25.4).toFixed(3)} in`;
          
          // Background
          context.fillStyle = 'rgba(26, 27, 30, 0.8)';
          context.strokeStyle = '#f82484';
          context.lineWidth = 2;
          context.roundRect(0, 0, canvas.width, canvas.height, 16);
          context.fill();
          context.stroke();
          
          // Text
          context.font = 'bold 36px Arial';
          context.fillStyle = 'white';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(formattedValue, canvas.width / 2, canvas.height / 2);
          
          // Create texture and sprite
          const texture = new THREE.CanvasTexture(canvas);
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(5, 2.5, 1);
          
          return sprite;
        };
        
        // Function to handle measurements
        const handleMeasurement = (event) => {
          if (!isMeasuring || !wasmModuleRef.current?.mesh) return;
          
          // Calculate mouse position in normalized device coordinates
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          
          // Update the raycaster
          raycaster.setFromCamera(mouse, camera);
          
          // Check for intersections with the model
          const intersects = raycaster.intersectObject(wasmModuleRef.current.mesh);
          
          if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Create a sphere to mark the point with glow effect
            const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
            const sphere = new THREE.Mesh(sphereGeometry, measurePointMaterial);
            sphere.position.copy(point);
            
            // Add a highlight glow
            const glowMaterial = new THREE.MeshBasicMaterial({ 
              color: 0xf82484, 
              transparent: true, 
              opacity: 0.5 
            });
            const glowSphere = new THREE.Mesh(
              new THREE.SphereGeometry(0.25, 32, 32),
              glowMaterial
            );
            glowSphere.position.copy(point);
            
            measurementGroup.add(sphere);
            measurementGroup.add(glowSphere);
            
            // Update measurement points
            const newPoints = [...measurePoints, point];
            setMeasurePoints(newPoints);
            
            // If we have two points, draw a line and calculate distance
            if (newPoints.length === 2) {
              // Create line with enhanced visibility
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(newPoints);
              const line = new THREE.Line(lineGeometry, measureLineMaterial);
              
              // Add dashed line for better visibility
              const dashLineMaterial = new THREE.LineDashedMaterial({
                color: 0xffffff,
                linewidth: 1,
                scale: 1,
                dashSize: 0.2,
                gapSize: 0.1,
              });
              const dashLine = new THREE.Line(lineGeometry.clone(), dashLineMaterial);
              dashLine.computeLineDistances(); // Required for dashed lines
              
              measurementGroup.add(line);
              measurementGroup.add(dashLine);
              
              // Calculate distance
              const dist = newPoints[0].distanceTo(newPoints[1]);
              const distanceValue = dist.toFixed(2);
              setDistance(distanceValue);
              
              // Create text label at midpoint
              const midpoint = new THREE.Vector3().addVectors(
                newPoints[0], newPoints[1]
              ).multiplyScalar(0.5);
              
              const textSprite = createTextSprite(distanceValue);
              textSprite.position.copy(midpoint);
              textSprite.position.y += 0.5; // Position above the line
              measurementGroup.add(textSprite);
              
              // Reset for next measurement
              setIsMeasuring(false);
              setMeasurePoints([]);
            }
          }
        };
        
        // Add click event listener for measurements
        renderer.domElement.addEventListener('click', handleMeasurement);
        
        // Function to reset measurements
        const resetMeasurements = () => {
          while (measurementGroup.children.length > 0) {
            const object = measurementGroup.children[0];
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
            measurementGroup.remove(object);
          }
          setMeasurePoints([]);
          setDistance(null);
        };
        
        // Function to reset view
        const resetView = () => {
          camera.position.set(0, 15, 15);
          camera.lookAt(0, 0, 0);
          controls.reset();
        };
        
        // Function to take screenshot
        const takeScreenshot = () => {
          renderer.render(scene, camera);
          const dataUrl = renderer.domElement.toDataURL('image/png');
          setScreenshotUrl(dataUrl);
          setShowScreenshot(true);
        };
        
        // Function to get current view angles
        const getViewAngles = () => {
          // Convert camera position to spherical coordinates
          const position = camera.position.clone();
          const spherical = new THREE.Spherical();
          spherical.setFromVector3(position);
          
          // Convert to degrees
          const theta = THREE.MathUtils.radToDeg(spherical.theta).toFixed(1);
          const phi = THREE.MathUtils.radToDeg(spherical.phi).toFixed(1);
          
          return {
            azimuth: theta,
            elevation: phi,
            distance: spherical.radius.toFixed(1)
          };
        };
        
        // Function to update view angles display
        const updateViewAngles = () => {
          setViewAngles(getViewAngles());
        };
        
        // Add event listener for control changes
        controls.addEventListener('change', updateViewAngles);
        
        // Load STL file
        const loader = new STLLoader();
        loader.load(
          'https://utfs.io/f/RSbfEU0J8DcdJdXLiF53YcMCbI7gKOhHekyato51XAsQxF68',
          (geometry) => {
            // Center the geometry
            geometry.center();
            
            // Create material
            const material = new THREE.MeshPhongMaterial({
              color: 0xf82484,
              specular: 0x111111,
              shininess: 30
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            
            // Calculate model dimensions
            const box = new THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new THREE.Vector3());
            
            // Calculate volume (approximate for STL)
            // For a more accurate volume, we would need to use a proper CAD kernel
            // This is a rough approximation based on the bounding box
            const volume = size.x * size.y * size.z * 0.8; // 0.8 is a fudge factor for non-cubic shapes
            
            // Set model dimensions
            const dimensions = {
              width: size.x * 10, // Scale to mm (assuming the model is in cm)
              height: size.y * 10,
              depth: size.z * 10,
              volume: volume * 1000 // Convert to mm³
            };
            setModelDimensions(dimensions);
            
            // Scale the mesh to fit the view
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 10 / maxDim;
            mesh.scale.set(scale, scale, scale);
            
            // Rotate the model 90 degrees on the x-axis (Math.PI/2 radians = 90 degrees)
            mesh.rotation.x = -1 * (Math.PI / 2);
            
            // Add mesh to scene
            scene.add(mesh);
            
            // Create dimension lines (hidden by default)
            const dimensionGroup = new THREE.Group();
            scene.add(dimensionGroup);
            
            // Function to toggle dimension lines
            const toggleDimensionLines = (show) => {
              dimensionGroup.visible = show;
            };
            
            // Store references for cleanup
            wasmModuleRef.current = {
              scene,
              camera,
              renderer,
              controls,
              mesh,
              resetMeasurements,
              resetView,
              takeScreenshot,
              getViewAngles,
              toggleDimensionLines,
              dispose: () => {
                geometry.dispose();
                material.dispose();
                controls.dispose();
                renderer.dispose();
                renderer.domElement.removeEventListener('click', handleMeasurement);
                controls.removeEventListener('change', updateViewAngles);
              }
            };
            
            // Animation loop
            function animate() {
              requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            }
            
            animate();
            setLoading(false);
            setViewerReady(true);
            updateViewAngles(); // Initialize view angles
          },
          (xhr) => {
            // Progress callback
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            // Error callback
            console.error('Error loading STL:', error);
            setError('Failed to load the 3D model');
            setLoading(false);
          }
        );
        
        // Handle window resize
        const handleResize = () => {
          if (wasmModuleRef.current) {
            const { camera, renderer } = wasmModuleRef.current;
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (wasmModuleRef.current && wasmModuleRef.current.dispose) {
            wasmModuleRef.current.dispose();
          }
        };
      } catch (err) {
        console.error('Error initializing WASM CAD viewer:', err);
        setError('Failed to initialize the 3D viewer');
        setLoading(false);
      }
    }
    
    initWasmViewer();
  }, [isMeasuring, measurePoints]);

  // Handle measurement tool toggle
  const toggleMeasurement = () => {
    if (isMeasuring) {
      // Cancel current measurement
      setIsMeasuring(false);
      if (setIsMeasuringExternal) {
        setIsMeasuringExternal(false);
      }
      setMeasurePoints([]);
    } else {
      // Start new measurement
      setIsMeasuring(true);
      if (setIsMeasuringExternal) {
        setIsMeasuringExternal(true);
      }
      if (wasmModuleRef.current?.resetMeasurements) {
        wasmModuleRef.current.resetMeasurements();
      }
    }
  };

  // Handle reset view
  const handleResetView = () => {
    if (wasmModuleRef.current?.resetView) {
      wasmModuleRef.current.resetView();
    }
  };

  // Handle reset measurements
  const handleResetMeasurements = () => {
    if (wasmModuleRef.current?.resetMeasurements) {
      wasmModuleRef.current.resetMeasurements();
      setDistance(null);
      if (onMeasurementChange) {
        onMeasurementChange(null);
      }
    }
  };
  
  // Handle take screenshot
  const handleTakeScreenshot = () => {
    if (wasmModuleRef.current?.takeScreenshot) {
      wasmModuleRef.current.takeScreenshot();
    }
  };
  
  // Handle close screenshot
  const handleCloseScreenshot = () => {
    setShowScreenshot(false);
    setScreenshotUrl(null);
  };
  
  // Handle download screenshot
  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `mandarin3d-model-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full w-full bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Canvas Container */}
        <div className="absolute inset-0 z-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F]/80 z-10">
              <div className="flex flex-col items-center">
                <FaSpinner className="animate-spin text-[#F82484] text-4xl mb-4" />
                <p className="text-white text-lg">Loading WASM CAD Viewer...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F]/80 z-10">
              <div className="bg-[#1a1b1e] p-6 rounded-lg border border-red-500/50 max-w-md">
                <h3 className="text-red-500 text-xl mb-2">Error</h3>
                <p className="text-white/80">{error}</p>
                <button 
                  className="mt-4 inline-flex items-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
            style={{ outline: 'none' }}
          />
        </div>
        
        {/* Measurement Info - Only show if not controlled by parent */}
        {!onMeasurementChange && distance && (
          <div className="absolute top-4 left-4 z-20 bg-[#1a1b1e]/80 p-3 rounded-lg border border-[#F82484]/50">
            <div className="flex items-center space-x-2">
              <FaRuler className="text-[#F82484]" />
              <span className="text-white">Distance: {distance} units</span>
            </div>
          </div>
        )}
        
        {/* View Angles Info - Only show if not controlled by parent */}
        {!onViewAnglesChange && viewAngles && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#1a1b1e]/80 p-3 rounded-lg border border-[#F82484]/30">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <FaEye className="text-[#F82484] text-sm" />
                <span className="text-white text-sm font-medium">View Info</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-white/70">Azimuth:</span>
                <span className="text-white">{viewAngles.azimuth}°</span>
                <span className="text-white/70">Elevation:</span>
                <span className="text-white">{viewAngles.elevation}°</span>
                <span className="text-white/70">Distance:</span>
                <span className="text-white">{viewAngles.distance} units</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Screenshot Modal - Removed as it's now handled at the AdamCad component level */}
        
        {/* Controls Overlay - Only show if showControls is true */}
        {viewerReady && showControls && (
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
            <button 
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-10 w-10 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 shadow-[0_0_15px_rgba(248,36,132,0.3)]"
              title="Settings"
              onClick={() => setShowPanel(!showPanel)}
            >
              <FaSlidersH />
            </button>
            
            <button 
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-10 w-10 rounded-full border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200 shadow-[0_0_15px_rgba(248,36,132,0.3)]"
              title="Take Screenshot"
              onClick={handleTakeScreenshot}
            >
              <FaCamera />
            </button>
            
            {showPanel && (
              <div className="absolute top-12 right-0 bg-[#1a1b1e] p-4 rounded-lg border border-[#F82484]/50 w-64 shadow-lg">
                <h3 className="text-white text-lg font-medium mb-3">View Controls</h3>
                
                <div className="space-y-3">
                  <button 
                    className={`w-full inline-flex items-center justify-between whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-lg border ${isMeasuring ? 'border-[#F82484] bg-[#F82484]/20 shadow-[0_0_15px_rgba(248,36,132,0.4)]' : 'border-[#F82484]/50 hover:bg-[#F82484]/40'} bg-[#2D2D2D] shadow-adam transition-all duration-200`}
                    onClick={toggleMeasurement}
                  >
                    <span className="flex items-center">
                      <FaRuler className="mr-2" />
                      Measure
                    </span>
                    {isMeasuring && <span className="text-xs bg-[#F82484] px-2 py-0.5 rounded">Active</span>}
                  </button>
                  
                  <button 
                    className="w-full inline-flex items-center justify-start whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
                    onClick={handleResetView}
                  >
                    <FaHome className="mr-2" />
                    Reset View
                  </button>
                  
                  <button 
                    className="w-full inline-flex items-center justify-start whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 rounded-lg border border-[#F82484]/50 text-white hover:bg-[#F82484]/40 bg-[#2D2D2D] shadow-adam transition-all duration-200"
                    onClick={handleResetMeasurements}
                  >
                    <FaCube className="mr-2" />
                    Clear Measurements
                  </button>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-2">Instructions:</p>
                  <ul className="text-xs text-white/60 list-disc pl-4 space-y-1">
                    <li>Click and drag to rotate the model</li>
                    <li>Scroll to zoom in/out</li>
                    <li>Right-click and drag to pan</li>
                    <li>Click "Measure" then click two points on the model to measure distance</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default WasmCadViewer; 