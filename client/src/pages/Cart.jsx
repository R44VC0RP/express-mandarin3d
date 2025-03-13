import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaArrowLeft, FaArrowDown, FaArrowUp, FaTrash, FaClock, FaShoppingCart, FaTruck, FaBox, FaComments, FaSpinner, FaSync } from 'react-icons/fa';
import ShowcaseProduct from '../components/ShowcaseProduct';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileUploadProgress from '../components/FileUploadProgress';
import { useCart } from '../context/Cart';
import ShoppingCartItem from '../components/ShoppingCartItem';
import axios from 'axios';
import Loading from 'react-fullscreen-loading';
import { toast } from 'sonner';
import { AnimatedProgressBar } from '../components/progressbar';
import { motion } from 'framer-motion';

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

import CheckoutLineItem from '../components/CheckoutLineItem';

function Home() {
  const [cartFilesLength, setCartFilesLength] = useState(0);
  const [testMode, setTestMode] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();
  const { cart, deleteFile, addFile } = useCart();
  const [localLoading, setLocalLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const [filamentColors, setFilamentColors] = useState([]);
  const [showcaseProducts, setShowcaseProducts] = useState([]);
  const [files, setFiles] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [activeShippingOption, setActiveShippingOption] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [freeShippingProgress, setFreeShippingProgress] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [estimatedDays, setEstimatedDays] = useState(3); // Default to 3 days

  const [orderComments, setOrderComments] = useState("");
  const [shippingOption, setShippingOption] = useState(0);

  const [products, setProducts] = useState([]);
  const [cartStatus, setCartStatus] = useState('unchecked');
  const [previousCartStatus, setPreviousCartStatus] = useState('unchecked');
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const hasShownInitialToast = useRef(false);
  const hasShownStatusChangeToast = useRef(false);
  const previousCartItems = useRef([]);
  const [pollingFiles, setPollingFiles] = useState(new Set());
  const [filePollingInterval, setFilePollingInterval] = useState(null);
  const [lastPolledTime, setLastPolledTime] = useState(Date.now());
  const [isPollingActive, setIsPollingActive] = useState(false);
  const fileStatusChanges = useRef({});

  const fetchCartItems = useCallback(async (reload = true) => {
    if (reload) {
      setCartLoading(true);
    }
    console.log("Fetching cart items: ", cart.cart_id);
    if (!cart.cart_id) {
      console.log("No cart found");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart?cart_id=${cart.cart_id}`);
      if (response.data.status === 'success' && Array.isArray(response.data.files)) {
        console.log("Cart Updated: ");
        const newCartItems = response.data.files;
        
        // Check for status changes in files
        if (previousCartItems.current.length > 0) {
          newCartItems.forEach((newItem) => {
            const oldItem = previousCartItems.current.find(item => item.fileid === newItem.fileid);
            
            if (oldItem && oldItem.file_status !== newItem.file_status) {
              // Track the status change
              fileStatusChanges.current[newItem.fileid] = {
                from: oldItem.file_status,
                to: newItem.file_status,
                filename: newItem.filename
              };
              
              // Show toast notification for important status changes
              if (oldItem.file_status === 'unsliced' && newItem.file_status === 'success') {
                toast.success(`"${newItem.filename}" has been processed successfully!`);
              } else if (oldItem.file_status === 'unsliced' && newItem.file_status === 'error') {
                toast.error(`There was an error processing "${newItem.filename}".`);
              }
            }
          });
        }

        setCartItems(newCartItems);
        setSelectedAddons(response.data.cart.cart_addons || []);

        // Update previousCartItems for next comparison
        previousCartItems.current = newCartItems;
        
        // Update the set of files that need polling
        const filesNeedingPolling = new Set(
          newCartItems
            .filter(item => item.file_status === 'unsliced')
            .map(item => item.fileid)
        );
        
        setPollingFiles(filesNeedingPolling);
        
        // If we have files to poll but polling is not active, start it
        if (filesNeedingPolling.size > 0 && !isPollingActive) {
          startFilePolling();
        } 
        // If we don't have files to poll but polling is active, stop it
        else if (filesNeedingPolling.size === 0 && isPollingActive) {
          stopFilePolling();
        }
      } else {
        console.error('Unexpected response format:', response.data);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      if (reload) {
        setCartLoading(false);
      }
      setLastPolledTime(Date.now());
    }
  }, [cart.cart_id, isPollingActive]);

  const pollFileStatus = useCallback(async (fileId) => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/api/file', {
        action: 'get',
        fileid: fileId
      });
      
      if (response.data.status === 'success') {
        const fileData = response.data.result;
        
        // If file status has changed from unsliced
        if (fileData.file_status !== 'unsliced') {
          // Update the cart to reflect the new file status
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
            cart_id: cart.cart_id,
            fileid: fileId,
            file_status: fileData.file_status
          });
          
          // Refresh cart items without full reload
          fetchCartItems(false);
        }
      }
    } catch (error) {
      console.error(`Error polling file ${fileId}:`, error);
    }
  }, [cart.cart_id, fetchCartItems]);

  const startFilePolling = useCallback(() => {
    if (filePollingInterval) {
      clearInterval(filePollingInterval);
    }
    
    setIsPollingActive(true);
    
    // Increase polling interval from 2s to 3s to reduce browser load
    const interval = setInterval(() => {
      // Only poll if we have files that need polling
      if (pollingFiles.size > 0) {
        console.log(`Polling ${pollingFiles.size} files for status updates...`);
        
        // Debounce API calls by using Promise.all for batch processing
        const pollPromises = Array.from(pollingFiles).map(fileId => 
          pollFileStatus(fileId)
        );
        
        Promise.all(pollPromises).catch(err => 
          console.error('Error in polling files batch:', err)
        );
      } else {
        // If no files need polling, stop the interval
        stopFilePolling();
      }
    }, 3000); // Increased from 2000ms to 3000ms
    
    setFilePollingInterval(interval);
  }, [pollingFiles, pollFileStatus, filePollingInterval]);

  const stopFilePolling = useCallback(() => {
    if (filePollingInterval) {
      clearInterval(filePollingInterval);
      setFilePollingInterval(null);
    }
    setIsPollingActive(false);
  }, [filePollingInterval]);

  useEffect(() => {
    return () => {
      if (filePollingInterval) {
        clearInterval(filePollingInterval);
      }
    };
  }, [filePollingInterval]);

  const handleRefreshFile = async (fileId) => {
    toast.info(`Refreshing status for file ${fileId}...`);
    await pollFileStatus(fileId);
  };

  const checkCartStatus = useCallback(async () => {
    if (!cart.cart_id) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/status?cart_id=${cart.cart_id}`);
      if (response.data.status === 'success' && response.data.cart_valid) {
        if (cartStatus !== 'valid') {
          setCartStatus('valid');
          setTimeout(() => fetchCartItems(false), 1000);
        }
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      } else if (response.data.files_not_sliced) {
        if (cartStatus !== 'slicing') {
          setCartStatus('slicing');
          setPreviousCartStatus(cartStatus);
        }
        if (!statusCheckInterval) {
          // Increase polling interval from 5 to 8 seconds to reduce load
          const interval = setInterval(() => checkCartStatus(), 8000);
          setStatusCheckInterval(interval);
        }
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  }, [cart.cart_id, statusCheckInterval, cartStatus, fetchCartItems]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`);
      if (response.data.status === 'success') {
        setProducts(response.data.result);
        console.log("Products: ", response.data.result);
      } else {
        console.error('Error fetching products:', response.data.message);
        toast.error('Failed to fetch products. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('An error occurred while fetching products. Please try again later.');
    }
  };

  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('code') === 'C01') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
      // remove the parameter from the url
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location]);


  useEffect(() => {
    if (activeShippingOption && subtotal) {
      const addonTotal = selectedAddons.reduce((total, addon) => total + addon.addon_price, 0);
      let total;
      if (freeShippingProgress === 100) {
        total = subtotal + addonTotal;
      } else {
        total = subtotal + activeShippingOption + addonTotal;
      }
      console.log("Total: ", total);
      setTotal(total);
    }
  }, [activeShippingOption, subtotal, cartItems, selectedAddons]);

  const handleAddToCart = async (product_fileid) => {
    console.log("Adding to cart: ", product_fileid);

    try {
      const result = await addFile(product_fileid);
      if (result.status === 'success') {
        toast.success('File added to cart successfully');
        fetchCartItems(false);
      } else {
        toast.error(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      toast.error('An error occurred while adding the file to cart');
    }
  };

  useEffect(() => { // THIS IS THE DEFAULT LOAD ALL THE THINGS
    fetchAddons();
    fetchShippingThreshold();
    fetchCartItems();
    fetchFilamentColors();
    fetchShippingOptions();
    fetchProducts();
    
    // Simple one-time fetch for the time estimate
    console.log("Fetching order estimate...");
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/order-time-estimate`)
      .then(response => {
        console.log("Order estimate response:", response.data);
        if (response.data.status === 'success') {
          setEstimatedDays(response.data.estimatedDays);
        }
      })
      .catch(error => {
        console.error('Error fetching order estimate:', error);
        // Keep the default value of 3 days
      });
    
    console.log("User: ", isAuthenticated);
    
    // Cleanup function to stop polling when component unmounts
    return () => {
      if (filePollingInterval) {
        clearInterval(filePollingInterval);
      }
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      // Reset polling state
      setIsPollingActive(false);
      setPollingFiles(new Set());
    };
  }, []);

  // Add a separate effect to handle polling initialization after cart items are loaded
  useEffect(() => {
    if (cartItems.length > 0) {
      // Check if there are any unsliced files that need polling
      const unslicedFiles = cartItems
        .filter(item => item.file_status === 'unsliced')
        .map(item => item.fileid);
      
      if (unslicedFiles.length > 0) {
        // Update the polling files set
        setPollingFiles(new Set(unslicedFiles));
        
        // Start polling if not already active
        if (!isPollingActive) {
          startFilePolling();
        }
      } else if (isPollingActive) {
        // No unsliced files but polling is active, stop it
        stopFilePolling();
      }
    }
  }, [cartItems, isPollingActive]);

  useEffect(() => { // SUBTOTAL CALCULATION
    const newSubtotal = cartItems.reduce((total, item) => {
      if (item.file_status === "success") {
        if (item.price) {
          return total + item.price * item.quantity;
        } else {
          return total;
        }
      }
      return total;
    }, 0);
    setSubtotal(newSubtotal);
    if (newSubtotal >= freeShippingThreshold) {
      setFreeShippingProgress(100);
    } else {
      setFreeShippingProgress(newSubtotal / freeShippingThreshold * 100);
    }
  }, [cartItems, freeShippingThreshold]);

  const fetchFilamentColors = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, {
        action: 'list'
      });


      setFilamentColors(response.data.result);
    } catch (error) {
      console.error('Error fetching filament colors:', error);
    }
  };

  const fetchShippingThreshold = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/configs/shippingthreshold`);
      setFreeShippingThreshold(response.data.freeShippingThreshold);
    } catch (error) {
      console.error('Error fetching shipping threshold:', error);
    }
  };

  const handleShippingChange = async (shipping_option_id) => {
    const shippingOption = shippingOptions.find(option => option.id === shipping_option_id);
    setShippingOption(shippingOption.id);

    setActiveShippingOption(shippingOption.fixed_amount.amount / 100);
  };

  const fetchShippingOptions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shipping`, {
        params: { action: 'list' }
      });
      setShippingOptions(response.data.result);
      setShippingOption(response.data.result[0].id);
      setActiveShippingOption(response.data.result[0].fixed_amount.amount / 100);
    } catch (error) {
      console.error('Error fetching shipping options:', error);
    }
  };

  const fetchAddons = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/addon/list`);
      if (response.data.status === 'success') {
        const fetchedAddons = response.data.addons;
        setAddons(fetchedAddons);

        // Filter out any selected addons that are no longer valid
        const validSelectedAddons = selectedAddons.filter(selectedAddon =>
          fetchedAddons.some(addon => addon.addon_id === selectedAddon.addon_id)
        );

        // Update selectedAddons if any invalid addons were removed
        if (validSelectedAddons.length !== selectedAddons.length) {
          setSelectedAddons(validSelectedAddons);
          // Optionally, update the cart on the server with the new valid addons
          updateCartAddons(validSelectedAddons);
        }
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
      toast.error('Failed to fetch addons');
    }
  };

  const updateCartAddons = async (validAddons) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
        cart_id: cart.cart_id,
        cart_addons: validAddons.map(a => ({
          addon_id: a.addon_id,
          addon_name: a.addon_name,
          addon_price: a.addon_price
        }))
      });
      toast.success('Cart addons updated');
    } catch (error) {
      console.error('Error updating cart addons:', error);
      toast.error('Failed to update cart addons');
    }
  };

  const handleAddonToggle = async (addon) => {
    const isSelected = selectedAddons.some(a => a.addon_id === addon.addon_id);
    let newSelectedAddons;
    if (isSelected) {
      newSelectedAddons = selectedAddons.filter(a => a.addon_id !== addon.addon_id);
    } else {
      newSelectedAddons = [...selectedAddons, addon];
    }
    setSelectedAddons(newSelectedAddons);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
        cart_id: cart.cart_id,
        cart_addons: newSelectedAddons.map(a => ({
          addon_id: a.addon_id,
          addon_name: a.addon_name,
          addon_price: a.addon_price
        }))
      });
      fetchCartItems(false); // Refresh cart items to reflect the changes
    } catch (error) {
      console.error('Error updating cart addons:', error);
      toast.error('Failed to update cart addons');
    }
  };

  const handleQuantityChange = async (fileid, newQuantity) => {
    if (newQuantity === 0) {
      handleRemove(fileid);
      return;
    }
    if (newQuantity > 100) {
      toast.error("You cannot have more than 100 of the same item in your cart");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
        cart_id: cart.cart_id,
        fileid,
        quantity: newQuantity
      });
      const updatedItems = cartItems.map(item =>
        item.fileid === fileid ? { ...item, quantity: newQuantity } : item
      );
      fetchCartItems(false);

    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleQualityChange = async (fileid, newQuality) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
        cart_id: cart.cart_id,
        fileid,
        quality: newQuality
      });
      fetchCartItems(false);
    } catch (error) {
      console.error('Error updating quality:', error);
    }
  };

  const handleColorChange = async (fileid, newColor) => {
    console.log("New Color: ", newColor);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update`, {
        cart_id: cart.cart_id,
        fileid,
        color: newColor
      });
      console.log("Response: ", response.data);
      fetchCartItems(false);
    } catch (error) {
      console.error('Error updating color:', error);
      toast.error(`Failed to update color: ${error.message}`);
    }
  };

  const handleRemove = async (fileid) => {
    try {
      console.log("Removing file: ", fileid);
      const response = await deleteFile(fileid);
      if (response.status === 'success') {
        fetchCartItems(false);
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(`Error removing item: ${error.message}`);
    }
  };

  const handleRemoveAllFiles = async () => {
    try {

      const promises = cartItems.map(item => handleRemove(item.fileid));
      await Promise.all(promises);
      
      toast.success('All items removed from cart');
      fetchCartItems(false);
    } catch (error) {
      console.error('Error removing all items:', error);
      toast.error('Failed to remove all items from cart');
    }
  };

  useEffect(() => {
    setCartFilesLength(cartItems.length);
    if (cart.cart_id) {
      checkCartStatus(); // on load, check the cart status
    }
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      // Reset flags and previousCartItems when component unmounts
      hasShownInitialToast.current = false;
      hasShownStatusChangeToast.current = false;
      previousCartItems.current = [];
    };
  }, [cart.cart_id, checkCartStatus, statusCheckInterval, fetchCartItems]);

  // Add this effect to listen for the custom event
  useEffect(() => {
    const handleFilesUploaded = () => {
      fetchCartItems(false);
    };

    window.addEventListener('filesUploaded', handleFilesUploaded);

    return () => {
      window.removeEventListener('filesUploaded', handleFilesUploaded);
    };
  }, [fetchCartItems]);

  const createQuote = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a quote.");
      return;
    }

    try {
      const quoteData = {
        quote_comments: orderComments,
        quote_files: cartItems.map(item => ({
          fileid: item.fileid,
          quantity: item.quantity,
          quality: item.quality,
          filament_color: item.color
        })),
        action: 'create'
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quote/mgmt`, quoteData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('Quote created successfully');
        console.log("Quote created successfully: ", response.data.quote);
        // copy quote id to clipboard
        const rootDomain = window.location.origin;
        navigator.clipboard.writeText(`${rootDomain}/quote/${response.data.quote.quote_id}`);
        toast.success('Quote ID copied to clipboard');
      } else {
        toast.error('Failed to create quote');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('An error occurred while creating the quote');
    }
  };

  const processCheckout = async () => {
    if (process.env.NODE_ENV === 'production') {
      window?.datafast("checkout", {
        description: "user checked out"
      });
    }
    console.log("Processing Checkout");

    // Get the cookies
    let datafast_visitor_id = document.cookie
      .split('; ')
      .find(row => row.startsWith('datafast_visitor_id='))
      ?.split('=')[1];

    let datafast_session_id = document.cookie
      .split('; ')
      .find(row => row.startsWith('datafast_session_id='))
      ?.split('=')[1];

    if (!datafast_visitor_id || !datafast_session_id) {
      datafast_visitor_id = "none";
      datafast_session_id = "none";
    }

    console.log("Datafast Visitor ID: ", datafast_visitor_id);
    console.log("Datafast Session ID: ", datafast_session_id);

    // Checks to make sure the cart is valid before processing checkout
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add some items to your cart before you can checkout.");
      return;
    }
    if (cartItems.filter(item => item.file_status === 'unsliced').length > 0) {
      toast.error("You have items that need to be sliced before you can checkout. Please remove them from your cart.");
      return;
    }
    if (cartItems.filter(item => item.file_status === 'error').length > 0) {
      toast.error("You have items that have errors that need to be fixed before you can checkout. Please remove them from your cart.");
      return;
    }

    if (testMode) {
      toast.warning("You are in test mode. This will not actually process a charge.");
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // If we made it here, the cart is valid and we can process the checkout
    var order_comments = orderComments;

    var shipping_option_id = shippingOption;

    var checkout_cart_id = cart.cart_id;

    var checkout = {
      order_comments: order_comments,
      shipping_option_id: shipping_option_id,
      cart_id: checkout_cart_id,
      test_mode: testMode,
      datafast_visitor_id,
      datafast_session_id
    }

    console.log("Checkout: ", checkout);

    // Show loading
    setLocalLoading(true);
    // Lock screen
    document.body.style.overflow = 'hidden';

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/checkout`, checkout);
      if (response.data.status === 'success') {
        toast.success('Checkout successful');
        // Redirect to the order confirmation page
        window.location.href = response.data.checkout_url;
      } else {
        toast.error('Checkout failed');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error('Checkout failed');
    }
  };

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#466F80" />;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
      <Header />
      
      {/* Hero Section with Title */}
      <section className="relative mx-auto max-w-screen-2xl px-4 py-2 mt-2">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
        </div>

        <div className="relative">
          <div className="text-center mb-8">
            
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-4">
              Your Cart
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16">
        {showAlert && (
          <div className="bg-blue-500/20 border border-blue-500/40 text-white p-4 rounded-lg mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}

        {/* File Processing Status Indicator */}
        {pollingFiles.size > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <FaSpinner className="mr-2 animate-spin text-yellow-400" />
              <span>
                <span className="font-semibold text-yellow-400">Processing Files:</span> {pollingFiles.size} file(s) being processed. This may take a few minutes.
              </span>
            </div>
            <div className="text-xs text-neutral-400 flex items-center">
              <FaSync className="mr-1 animate-spin" />
              Auto-refreshing ({Math.floor((Date.now() - lastPolledTime) / 1000)}s ago)
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                {cartLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50">
                    <p className="text-xl font-bold mb-4">Loading Cart</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                ) : cartItems.length > 0 ? (
                  <>
                    {cartItems.filter(item => item.file_status === 'unsliced').map((item) => (
                      <ShoppingCartItem
                        key={item.fileid}
                        {...item}
                        filamentColors={filamentColors}
                        onQuantityChange={handleQuantityChange}
                        onQualityChange={handleQualityChange}
                        onColorChange={handleColorChange}
                        onRemove={handleRemove}
                        isAuthenticated={isAuthenticated}
                        onRefresh={() => handleRefreshFile(item.fileid)}
                        isPolling={isPollingActive && pollingFiles.has(item.fileid)}
                      />
                    ))}
                    {cartItems.filter(item => item.file_status === 'error').map((item) => (
                      <ShoppingCartItem
                        key={item.fileid}
                        {...item}
                        filamentColors={filamentColors}
                        onQuantityChange={handleQuantityChange}
                        onQualityChange={handleQualityChange}
                        onColorChange={handleColorChange}
                        onRemove={handleRemove}
                        isAuthenticated={isAuthenticated}
                        onRefresh={() => handleRefreshFile(item.fileid)}
                        isPolling={false}
                      />
                    ))}
                    {cartItems.filter(item => item.file_status !== 'unsliced' && item.file_status !== 'error').map((item) => (
                      <ShoppingCartItem
                        key={item.fileid}
                        {...item}
                        filamentColors={filamentColors}
                        onQuantityChange={handleQuantityChange}
                        onQualityChange={handleQualityChange}
                        onColorChange={handleColorChange}
                        onRemove={handleRemove}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50">
                    <FaShoppingCart className="text-4xl text-neutral-400 mb-4" />
                    <p className="text-xl font-semibold text-neutral-300 mb-2">Your cart is empty</p>
                    <p className="text-neutral-400 text-center mb-4">Add some items to get started with your 3D printing project.</p>
                    <button
                      onClick={() => window.location.href = '/upload'}
                      className="px-6 py-3 bg-[#466F80] hover:bg-[#0B7F86] text-white rounded-full transition-all duration-300 flex items-center group"
                    >
                      Start Your Project
                      <FaArrowLeft className="ml-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">
              {/* Order Summary Card */}
              <div className="bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50 p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-400">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {freeShippingProgress === 100 ? (
                      <div className="flex justify-between mb-2">
                        <span className="text-neutral-400">Shipping</span>
                        <span className="text-green-400 font-semibold">Free</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-neutral-400">Estimated Shipping</span>
                          <span className="font-semibold">${activeShippingOption.toFixed(2)}</span>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-neutral-400 mb-2">Free Shipping Progress (${freeShippingThreshold} Threshold)</p>
                          {/* Commented out AnimatedProgressBar for performance testing
                          {typeof document !== 'undefined' && 
                            document.visibilityState === 'visible' && 
                            <AnimatedProgressBar progress={freeShippingProgress} />
                          }
                          */}
                          
                          {/* Simple standard progress bar replacement */}
                          <div className="w-full h-[30px] bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-600 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${freeShippingProgress}%` }}
                            >
                              {freeShippingProgress > 15 && (
                                <div className="h-full flex items-center justify-center text-xs font-medium text-white">
                                  {Math.round(freeShippingProgress)}%
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedAddons.map(addon => (
                      <div key={addon.addon_id} className="flex justify-between mb-2">
                        <span className="text-neutral-400">{addon.addon_name}</span>
                        <span className="font-semibold">${addon.addon_price.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="border-t border-neutral-800/50 my-4" />

                    <div className="flex justify-between mb-4">
                      <span className="text-lg">Total</span>
                      <span className="text-lg font-bold">${total.toFixed(2)}</span>
                    </div>

                    {/* Estimated Time Card */}
                    <div className="bg-[#1A1A1A] p-4 rounded-md border border-[#3A3A3A] mb-4">
                      <div className="flex items-center mb-2">
                        <FaClock className="text-[#466F80] mr-2" />
                        <p className="font-semibold text-[#C7C7C7]">Estimated Production Time</p>
                      </div>
                      <p className="text-sm text-neutral-300 mb-1">
                        Based on our current order volume, your order will take approximately{' '}
                        <span className="font-bold text-white">{estimatedDays} days</span> to complete before shipping.
                      </p>
                      <p className="text-xs text-neutral-500">
                        This estimate includes production time only. Shipping time will vary based on your location and selected shipping method.
                      </p>
                    </div>

                    <button
                      onClick={processCheckout}
                      disabled={cartItems.length === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                        cartItems.length === 0
                          ? 'bg-neutral-700/50 text-neutral-400 cursor-not-allowed'
                          : 'bg-[#466F80] hover:bg-[#0B7F86] text-white hover:shadow-lg hover:shadow-cyan-500/20'
                      }`}
                    >
                      <FaShoppingCart />
                      Proceed to Checkout
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={createQuote}
                        className="w-full py-3 px-4 rounded-lg font-semibold mt-2 border border-[#466F80] text-[#466F80] hover:bg-[#466F80] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaBox />
                        Create Quote
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Options Card */}
              <div className="bg-[#1a1b1e]/80 backdrop-blur-sm rounded-lg border border-neutral-800/50 p-6">
                <h2 className="text-xl font-semibold mb-4">Order Options</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaTruck className="inline-block mr-2" />
                      Shipping Method
                    </label>
                    <select 
                      className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-neutral-800 text-white focus:border-cyan-500 transition-colors duration-300"
                      onChange={(e) => handleShippingChange(e.target.value)}
                    >
                      {shippingOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.display_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      <FaComments className="inline-block mr-2" />
                      Order Comments
                    </label>
                    <textarea 
                      className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-neutral-800 text-white focus:border-cyan-500 transition-colors duration-300 min-h-[100px]"
                      placeholder="Add any special instructions here..."
                      onChange={(e) => setOrderComments(e.target.value)}
                    />
                  </div>

                  {addons.map((addon) => (
                    <div key={addon.addon_id} className="flex items-start">
                      <div className="flex items-start cursor-pointer group" onClick={() => handleAddonToggle(addon)}>
                        <div className="relative flex items-center mt-1 mr-3">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={selectedAddons.some(a => a.addon_id === addon.addon_id)}
                            readOnly
                          />
                          <div className="w-4 h-4 border-2 border-neutral-600 rounded transition-all duration-200 
                            peer-checked:border-cyan-500 peer-checked:bg-cyan-500 
                            group-hover:border-cyan-500/50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white transform scale-0 peer-checked:scale-100 transition-transform duration-200">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-cyan-500 transition-colors duration-200">
                            {addon.addon_name}
                            {addon.addon_price > 0 && (
                              <span className="text-cyan-400 ml-1">
                                (+${addon.addon_price.toFixed(2)})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200">{addon.addon_description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAuthenticated && (
                    <div className="flex items-center pt-4 border-t border-neutral-800/50">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="testMode"
                          className="peer sr-only"
                          checked={testMode}
                          onChange={() => setTestMode(!testMode)}
                        />
                        <div className="w-4 h-4 border-2 border-neutral-600 rounded transition-all duration-200 
                          peer-checked:border-cyan-500 peer-checked:bg-cyan-500 
                          hover:border-cyan-500/50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white transform scale-0 peer-checked:scale-100 transition-transform duration-200">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                      <label htmlFor="testMode" className="text-sm text-neutral-400 ml-2 cursor-pointer hover:text-neutral-300 transition-colors duration-200">
                        Test Mode
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-neutral-400 text-center">
                By placing this order you agree to Mandarin 3D's{' '}
                <a href="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                  Terms and Conditions
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {cartStatus === 'slicing' && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500/90 backdrop-blur-sm text-black p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" />
            Some files in your cart are being processed. Please wait...
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;