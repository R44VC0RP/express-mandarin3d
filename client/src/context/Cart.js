import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cart_id: null, files: [] });

  useEffect(() => {
    getFilesFromCart();
  }, []);

  const addFile = async (fileid) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/add', { fileid }, { withCredentials: true });
      if (response.data.status === 'success') {
        await getFilesFromCart(); // Refresh the cart after adding
      }
      return response.data;
    } catch (error) {
      console.error('Error adding file to cart:', error);
      return { status: 'error', message: 'Failed to add file to cart' };
    }
  };

  const deleteFile = async (fileid) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/remove', { fileid }, { withCredentials: true });
      if (response.data.status === 'success') {
        await getFilesFromCart(); // Refresh the cart after removing
      }
      return response.data;
    } catch (error) {
      console.error('Error removing file from cart:', error);
      return { status: 'error', message: 'Failed to remove file from cart' };
    }
  };

  const getFilesFromCart = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/cart', { withCredentials: true });
      if (response.data.status === 'success') {
        setCart({
          cart_id: response.data.cart_id,
          files: response.data.files || []
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
    try {
      const response = await axios.delete(backendUrl + '/api/cart', { withCredentials: true });
      if (response.data.status === 'success') {
        setCart({ cart_id: null, files: [] });
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
