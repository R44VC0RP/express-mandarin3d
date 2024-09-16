import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaArrowLeft, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import ShowcaseProduct from '../components/ShowcaseProduct';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileUploadProgress from '../components/FileUploadProgress';
import { useCart } from '../context/Cart';
import ShoppingCartItem from '../components/ShoppingCartItem';
import axios from 'axios';
import Loading from 'react-fullscreen-loading';
// Asset Imports
import prining_bambu from '../assets/videos/printing_bambu.mp4';
import fusion360 from '../assets/images/fusion360.gif';
import building from '../assets/images/outdoor.png';
import { toast } from 'sonner';
import { AnimatedProgressBar } from '../components/progressbar';

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

  const [orderComments, setOrderComments] = useState("");
  const [shippingOption, setShippingOption] = useState(0);

  const [products, setProducts] = useState([]);
  const [cartStatus, setCartStatus] = useState('unchecked');
  const [previousCartStatus, setPreviousCartStatus] = useState('unchecked');
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const hasShownInitialToast = useRef(false);
  const hasShownStatusChangeToast = useRef(false);
  const previousCartItems = useRef([]);

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

        // Only check for status changes if previousCartItems is not empty
        if (previousCartItems.current.length > 0) {
          // Check if any file status has changed from 'unsliced' to 'success'
          const statusChanged = newCartItems.some((newItem) => {
            const oldItem = previousCartItems.current.find(item => item.fileid === newItem.fileid);
            return oldItem && oldItem.file_status === 'unsliced' && newItem.file_status === 'success';
          });

          if (statusChanged && !hasShownStatusChangeToast.current) {
            toast.success('Some files in your cart have been updated!');
            hasShownStatusChangeToast.current = true;
          }
        }

        setCartItems(newCartItems);
        setSelectedAddons(response.data.cart.cart_addons || []);

        // Update previousCartItems for next comparison
        previousCartItems.current = newCartItems;
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
    }
  }, [cart.cart_id]);

  const checkCartStatus = useCallback(async () => {
    if (!cart.cart_id) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/status?cart_id=${cart.cart_id}`);
      if (response.data.status === 'success' && response.data.cart_valid) {
        if (cartStatus !== 'valid') {
          setCartStatus('valid');
          // if (!hasShownInitialToast.current) {

          //   toast.success('All files in your cart are up to date!');
          //   hasShownInitialToast.current = true;
          // }
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
          const interval = setInterval(() => checkCartStatus(), 5000); // Check every 5 seconds
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
      const addonTotal = selectedAddons.reduce((total, addon) => total + addon.addon_price / 100, 0);
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
    
  }, []);

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
    if (newQuantity > 20) {
      toast.error("You cannot have more than 20 of the same item in your cart");
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

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
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

  

  const processCheckout = async () => {
    console.log("Processing Checkout");

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

    // If we made it here, the cart is valid and we can process the checkout
    var order_comments = orderComments;
    
    var shipping_option_id = shippingOption;

    var checkout_cart_id = cart.cart_id;

    var checkout = {
      order_comments: order_comments,
      shipping_option_id: shipping_option_id,
      cart_id: checkout_cart_id
    }

    // Show loading
    setLocalLoading(true);
    // Lock screen
    document.body.style.overflow = 'hidden';
    



  };

  

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Header />
      <div className="mt-3 w-full border-t border-b border-[#5E5E5E] bg-[#2A2A2A]">
        <div className="flex items-center justify-left mt-2">
          <a href="/" className="ml-4 my-4 inline-block"><FaArrowLeft /></a>
          <p className="ml-2 text-3xl font-bold">Your Project</p>
        </div>
        <div className="flex items-center justify-left mb-4">
          <p className="ml-4 mr-4 inline-block text-sm font-light"><a href="/" className="text-white">Home</a> / <span className="text-white font-bold">Shopping Cart</span></p>
        </div>

      </div>
      <main className="container mx-auto ">
        {showAlert && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}
        {/* Checkout Section */}
        <section className="px-4">

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
            {/* Left Column: Shopping Cart Items */}
            
            <div name="checkout-items" className="col-span-2 mt-4 lg:mt-4">
              <div className="w-full">
                <div className="lg:hidden">
                  <button 
                    onClick={() => {
                      const checkoutConfig = document.querySelector('div[name="checkout-config"]');
                      if (checkoutConfig) {
                        checkoutConfig.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center justify-center w-full py-2 mb-4 bg-[#0D939B] text-white rounded-md"
                  >
                    Go to Checkout
                    <FaArrowDown className="ml-2" />
                  </button>
                </div>
                {cartLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Cart</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
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
                  <p>Your cart is empty.</p>
                )}
              </div>
            </div>
            {/* Right Column: Shopping Cart Config */}
            <div name="checkout-config" className="mt-4 lg:-mt-8">
              <div className="card-special w-full p-4">
                <div className="flex flex-col items-center mb-4">
                  <p className="text-xl font-bold mb-2 text-[#C7C7C7]" >Parts Subtotal:</p>
                  <p className="text-4xl font-bold">${subtotal.toFixed(2)}</p>
                </div>
                <div className="mb-4">
                  {cartItems.filter(item => item.file_status === "success").map((item) => (
                    <CheckoutLineItem
                      key={item.fileid}
                      item_name={item.filename}
                      item_price={item.price}
                      item_quantity={item.quantity}
                    />
                  ))}
                </div>

                <hr className="border-t border-[#5E5E5E] my-4" />
                {freeShippingProgress === 100 ? (
                  <div className="flex justify-between mb-2">
                    <p className="font-light">Shipping:</p>
                    <p className="font-bold text-green-500">Free</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between mb-2">
                      <p className="font-light">Estimated Shipping:</p>
                      <p className="font-bold">${activeShippingOption.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="font-light">Free Shipping Progress (${freeShippingThreshold} Threshold):</p>
                    </div>
                    <AnimatedProgressBar progress={freeShippingProgress} />
                  </>
                )}
                {selectedAddons.map(addon => (
                  <div key={addon.addon_id} className="flex justify-between mb-2">
                    <p className="font-light">{addon.addon_name}</p>
                    {addon.addon_price > 0 && (
                      <p className="font-bold">${(addon.addon_price / 100).toFixed(2)}</p>
                    )}
                  </div>
                ))}
                <hr className="border-t border-[#5E5E5E] my-4" />
                <div className="flex justify-between mb-4">
                  <p className="font-light">Estimated Total:</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
                <button 
                  className={`primary-button w-full py-2 rounded-lg ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={cartItems.length === 0}
                  onClick={() => {processCheckout()}}
                >
                  Checkout
                </button>
              </div>
              <div className="card-special w-full p-4 mt-4">
                <div className="flex flex-col items-center mb-4">
                  <p className="text-lg font-bold mb-2 text-[#C7C7C7]">Order Options and Addons:</p>
                </div>
                <p className="text-md text-white">Shipping Speed</p>
                <select className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#5E5E5E] text-white" onChange={(e) => handleShippingChange(e.target.value)}>
                  {shippingOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.display_name}</option>
                  ))}
                </select>
                <p className="text-md text-white mt-2">Order Comments</p>
                <textarea className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#5E5E5E] text-white" placeholder="Add any special instructions here..." onChange={(e) => setOrderComments(e.target.value)}></textarea>
                {addons.map((addon) => (
                  <div key={addon.addon_id} className="flex items-start mt-2">
                    <div className="flex items-start mt-2 cursor-pointer" onClick={() => handleAddonToggle(addon)}>
                      <input
                        id={`addon-${addon.addon_id}`}
                        type="checkbox"
                        className="mr-2 mt-1"
                        checked={selectedAddons.some(a => a.addon_id === addon.addon_id)}
                        readOnly
                      />
                      <div>
                        <p className="text-md text-white font-bold">
                          {addon.addon_name}
                          {addon.addon_price > 0 && ` (+$${(addon.addon_price).toFixed(2)})`}
                        </p>
                        <p className="text-sm text-gray-400">{addon.addon_description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="py-8 px-4">
          <h2 className="text-3xl font-bold mb-6">Our Featured Products</h2>
          <Slider {...settings}>
            {products.map((plan, index) => (
              <div key={index} className="px-2">
                <ShowcaseProduct {...plan} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </Slider>
        </section>
      </main>
      <Footer />
      
      {cartStatus === 'slicing' && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center">
          Some files in your cart are being processed. Please wait...
        </div>
      )}
    </div>
  );
}

export default Home;