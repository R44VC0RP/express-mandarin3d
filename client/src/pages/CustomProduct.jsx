import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { GetColorName } from 'hex-color-to-color-name';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import { Textarea } from '../components/ui/textarea';
import { UploadButton } from "../utils/uploadthing";
import axios from 'axios';
import { toast } from 'sonner';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AnimatedProgressBar } from '../components/progressbar';
import { BlockPicker, CirclePicker } from 'react-color';


function CustomProductForm({ formConfig }) {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [availableColors, setAvailableColors] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentImage, setCurrentImage] = useState(formConfig.fields[0].image);
  const inputRefs = useRef({});
  const notesRef = useRef(null);

  useEffect(() => {
    fetchAvailableColors();
  }, []);

  useEffect(() => {
    setCurrentImage(formConfig.fields[currentStep].image);
  }, [currentStep]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePreviousStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentStep, formData]);

  useEffect(() => {
    // Focus the input of the current step or the notes textarea in review step
    if (isReviewing) {
      if (notesRef.current) {
        notesRef.current.focus();
      }
    } else {
      const currentField = formConfig.fields[currentStep];
      if (inputRefs.current[currentField.id]) {
        inputRefs.current[currentField.id].focus();
      }
    }
  }, [currentStep, isReviewing]);

  const fetchAvailableColors = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, { action: 'list' });
      if (response.data.status === 'success') {
        const colors = response.data.result.map(filament => filament.filament_color);
        setAvailableColors(Array.from(new Set(colors))); // Remove duplicates
      }
    } catch (error) {
      console.error('Error fetching filament colors:', error);
    }
  };

  const validateField = (field, value) => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }
    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`;
      }
      // Add more validation rules as needed
    }
    return null;
  };

  const handleInputChange = (id, value) => {
    setFormData(prevData => ({ ...prevData, [id]: value }));
    const field = formConfig.fields.find(f => f.id === id);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReviewing) {
      setIsReviewing(true);
    } else {
      try {
        console.log(formData);
        // Implement your submission logic here
        // const response = await axios.post(formConfig.submitButton.action, formData);
        // if (response.data.success) {
        //   toast.success(formConfig.onSubmitSuccess.message);
        //   navigate(formConfig.onSubmitSuccess.redirect);
        // } else {
        //   toast.error('Failed to submit order. Please try again.');
        // }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const ReviewStep = ({ formData, formConfig, onEdit, onSubmit }) => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>
        <p className="text-md text-gray-400">Please note, this does not place an order, this sends an email to our team to review the submissions and respond to you with the link for the product. You will be able to edit your order before submitting if needed.</p>
        {formConfig.fields.map((field) => (
          <div key={field.id} className="flex justify-between items-center">
            <span className="font-medium">
              {field.label}
              {!field.required && <span className="text-gray-400 text-sm ml-1">(Optional)</span>}
            </span>
            <span className="text-right">
              {field.type === 'color' ? (
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: formData[field.id] || '#000000' }}
                  />
                  <span>{GetColorName(formData[field.id]) || 'Not selected'}</span>
                </div>
              ) : field.type === 'custom' ? (
                formData[field.id] ? `Uploaded: ${formData[field.id].fileName}` : 'Not uploaded'
              ) : field.type === 'select' && field.id === 'font' ? (
                <span style={{ fontFamily: formData[field.id] || 'inherit' }}>
                  {formData[field.id] || 'Not selected'}
                </span>
              ) : (
                formData[field.id] || (field.required ? 'Not provided' : 'Not provided (Optional)')
              )}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-8">
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            Edit
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-[#0D939B] text-white rounded-full hover:bg-[#11B3BD] transition duration-300 ease-in-out"
          >
            Submit Order
          </button>
        </div>
      </div>
    );
  };

  const handleNextStep = () => {
    const currentField = formConfig.fields[currentStep];
    const error = validateField(currentField, formData[currentField.id]);

    if (error) {
      setErrors(prev => ({ ...prev, [currentField.id]: error }));
      toast.error(error);
    } else {
      if (currentStep < formConfig.fields.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentImage(formConfig.fields[currentStep + 1].image);
      } else if (!isReviewing) {
        setIsReviewing(true);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentImage(formConfig.fields[currentStep - 1].image);
    } else if (isReviewing) {
      setIsReviewing(false);
      setCurrentStep(formConfig.fields.length - 1);
    }
  };

  const renderField = (field) => {
    const baseInputClass = "w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D939B] text-white placeholder-gray-300";
    const errorClass = "border-red-500 focus:ring-red-500";

    switch (field.type) {
      case 'text':
        return (
          <div>

            <p className="text-sm text-gray-400 mb-2">{field.description}</p>
            <input
              ref={el => inputRefs.current[field.id] = el}
              type="text"
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`${baseInputClass} ${errors[field.id] ? errorClass : ''}`}
            />
            {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
      case 'color':
        return (
          <div className="relative">

            <p className="text-sm text-gray-400 mb-2">{field.description}</p>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div
                className="w-10 h-10 rounded"
                style={{ backgroundColor: formData[field.id] || '#000000' }}
              />
              {formData[field.id] && (
                <span className="text-white">{GetColorName(formData[field.id]) || 'Not selected'}</span>
              ) || (
                  <span className="text-white">Not selected</span>
                )}
            </div>
            {showColorPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-10">
                <BlockPicker
                  color={formData[field.id] || '#000000'}
                  onChange={(color) => {
                    handleInputChange(field.id, color.hex);
                    setShowColorPicker(false);
                  }}
                  colors={availableColors}
                  triangle="hide"
                />
              </div>
            )}
            {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
      case 'select':
        return (
          <div>

            <p className="text-sm text-gray-400 mb-2">{field.description}</p>
            <select
              ref={el => inputRefs.current[field.id] = el}
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`${baseInputClass} ${errors[field.id] ? errorClass : ''}`}
              style={{ fontFamily: formData[field.id] || 'inherit' }}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value} style={{ fontFamily: option.value }}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
      case 'custom':
        return (
          <div>

            <p className="text-sm text-gray-400 mb-2">{field.description}</p>
            <UploadButton
              endpoint="svgUploader"
              onClientUploadComplete={(res) => {
                console.log("Upload completed:", res);
                handleInputChange(field.id, { url: res[0].url, fileName: res[0].name });
                toast.success("Logo uploaded successfully.");
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
                toast.error(`Upload Error: ${error.message}`);
              }}
            />
            {formData[field.id] && (
              <p className="mt-2 text-sm text-white">
                Uploaded file: {formData[field.id].fileName}
              </p>
            )}
            {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
      case 'notes':

        return (
          <div>
            <p className="text-sm text-gray-400 mb-2">{field.description}</p>
            <Textarea placeholder="Please add any additional notes or instructions for your nameplate here." onChange={(e) => handleInputChange('notes', e.target.value)} value={formData.notes || ''} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects />
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white border-opacity-20">
          <h1 className="text-4xl font-bold text-center mb-6">{formConfig.title}</h1>
          <p className="text-center mb-8 text-lg">{formConfig.description}</p>
          {!isReviewing && (
            <img src={currentImage} alt={`Step ${currentStep + 1}`} className="w-1/2 h-auto mb-8 rounded-lg mx-auto border-2 border-white border-opacity-20" />
          )}

          {isReviewing ? (
            <ReviewStep
              formData={formData}
              formConfig={formConfig}
              onEdit={() => {
                setIsReviewing(false);
                setCurrentStep(formConfig.fields.length - 1);
              }}
              onSubmit={handleSubmit}
            />
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Progress: {Math.round(((currentStep + 1) / formConfig.fields.length) * 100)}%</p>
                <AnimatedProgressBar progress={((currentStep + 1) / formConfig.fields.length) * 100} />
              </div>

              {formConfig.fields.map((field, index) => (
                <div key={field.id} className={`space-y-4 ${index !== currentStep ? 'hidden' : ''}`}>
                  <label htmlFor={field.id} className="block text-lg font-medium mb-2">
                    {field.label}
                    {!field.required && <span className="text-gray-400 text-sm ml-1">(Optional)</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 transition duration-300 ease-in-out flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
                {currentStep < formConfig.fields.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#0D939B] text-white rounded-full hover:bg-[#11B3BD] transition duration-300 ease-in-out flex items-center"
                  >
                    Next
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsReviewing(true)}
                    className="px-6 py-3 bg-[#0D939B] text-white rounded-full hover:bg-[#11B3BD] transition duration-300 ease-in-out flex items-center"
                  >
                    Review Order
                    <FaArrowRight className="ml-2" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomProductForm;
