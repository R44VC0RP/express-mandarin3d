import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cart_id: Cookies.get('cart_id'), files: [] });
  

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

  const addFile = async (fileid, quantity = 1, quality = '0.20mm') => {
    getFilesFromCart();
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(backendUrl + '/api/cart/add', { cart_id: cartId, fileid, quantity, quality });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
      }
      return response.data;
    } catch (error) {
      console.error('Error adding file to cart:', error);
      return { status: 'error', message: 'Failed to add file to cart' };
    }
  };

  const updateFile = async (fileid, quantity, quality) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(backendUrl + '/api/cart/update', { cart_id: cartId, fileid, quantity, quality });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
      }
      return response.data;
    } catch (error) {
      console.error('Error updating file in cart:', error);
      return { status: 'error', message: 'Failed to update file in cart' };
    }
  };

  const deleteFile = async (fileid) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(backendUrl + '/api/cart/remove', { cart_id: cartId, fileid });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
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
      if (response.data.cart_found === false) {
        console.log("No cart found for cart_id: ", cartId);
        // Delete the cart
        deleteCart();
        createNewCart();
        console.log("Cart created: ", cart);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);

      return { status: 'error', message: 'Failed to fetch cart', cart_found: false};
    }
  };

  const deleteCart = async () => {
    const cartId = Cookies.get('cart_id');
    try {
      console.log("Deleting cart with id: ", cartId);
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
    <CartContext.Provider value={{ cart, addFile, deleteFile, updateFile, getFilesFromCart, deleteCart }}>
      {children}
    </CartContext.Provider>
  );
};
