import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cart_id: null, files: [] });

  useEffect(() => {
    const cartId = Cookies.get('cart_id');
    if (!cartId) {
      createNewCart();
    } else {
      getFilesFromCart(cartId);
    }

    // Set up polling interval
    const intervalId = setInterval(() => {
      getFilesFromCart(cartId);
    }, 10000); // Check every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const createNewCart = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/create');
      if (response.data.status === 'success') {
        const cartId = response.data.cart_id;
        Cookies.set('cart_id', cartId, { expires: 365 });
        setCart({ cart_id: cartId, files: [] });
      }
    } catch (error) {
      console.error('Error creating new cart:', error);
    }
  };

  const addFile = async (fileid) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(backendUrl + '/api/cart/add', { cart_id: cartId, fileid });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId); // Refresh the cart after adding
      }
      return response.data;
    } catch (error) {
      console.error('Error adding file to cart:', error);
      return { status: 'error', message: 'Failed to add file to cart' };
    }
  };

  const deleteFile = async (fileid) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(backendUrl + '/api/cart/remove', { cart_id: cartId, fileid });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId); // Refresh the cart after removing
      }
      return response.data;
    } catch (error) {
      console.error('Error removing file from cart:', error);
      return { status: 'error', message: 'Failed to remove file from cart' };
    }
  };

  const getFilesFromCart = async (cartId) => {
    try {
      const response = await axios.get(backendUrl + `/api/cart?cart_id=${cartId}`);
      if (response.data.status === 'success') {
        setCart(prevCart => {
          // Only update if there's a change
          if (JSON.stringify(prevCart) !== JSON.stringify(response.data)) {
            return {
              cart_id: response.data.cart_id,
              files: response.data.files || []
            };
          }
          return prevCart;
        });
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ cart_id: null, files: [] });
      return { status: 'error', message: 'Failed to fetch cart' };
    }
  };

  const deleteCart = async () => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.delete(backendUrl + `/api/cart?cart_id=${cartId}`);
      if (response.data.status === 'success') {
        setCart({ cart_id: null, files: [] });
        Cookies.remove('cart_id');
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting cart:', error);
      return { status: 'error', message: 'Failed to delete cart' };
    }
  };

  return (
    <CartContext.Provider value={{ cart, addFile, deleteFile, getFilesFromCart, deleteCart }}>
      {children}
    </CartContext.Provider>
  );
};
