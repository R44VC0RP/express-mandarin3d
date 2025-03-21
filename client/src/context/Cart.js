import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cart_id: Cookies.get('cart_id'), files: [] });

  const [cartFiles, setCartFiles] = useState([]);
  
  useEffect(() => {
    const cartId = Cookies.get('cart_id');
    if (!cartId) {
      createNewCart();
    } else {
      getFilesFromCart(cartId);
    }
  }, []);

  const createNewCart = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/create`);
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
    if (process.env.NODE_ENV === 'prod') {
      window?.datafast("add_to_cart", {
        description: "user uploaded file to cart" 
      });
    }
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(`${backendUrl}/api/cart/add`, { cart_id: cartId, fileid, quantity, quality });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
      }
      return response.data;
    } catch (error) {
      console.error('Error adding file to cart:', error);
      if (error.response && error.response.status === 404) {
        await createNewCart();
      }
      return { status: 'error', message: 'Failed to add file to cart' };
    }
  };

  const addBulkFiles = async (fileids, quantity=1, quality='0.20mm') => {
    for (const fileid of fileids) {
      await addFile(fileid, quantity, quality);
    }
  };

  const updateFile = async (fileid, quantity, quality, color) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(`${backendUrl}/api/cart/update`, { cart_id: cartId, fileid, quantity, quality, color });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
      }
      return response.data;
    } catch (error) {
      console.error('Error updating file in cart:', error);
      if (error.response && error.response.status === 404) {
        await createNewCart();
      }
      return { status: 'error', message: 'Failed to update file in cart' };
    }
  };

  const deleteFile = async (fileid) => {
    const cartId = Cookies.get('cart_id');
    try {
      const response = await axios.post(`${backendUrl}/api/cart/remove`, { cart_id: cartId, fileid });
      if (response.data.status === 'success') {
        await getFilesFromCart(cartId);
      }
      return response.data;
    } catch (error) {
      console.error('Error removing file from cart:', error);
      if (error.response && error.response.status === 404) {
        await createNewCart();
      }
      return { status: 'error', message: 'Failed to remove file from cart' };
    }
  };

  const getFilesFromCart = async (cartId) => {
    console.log("(cart.js) Fetching cart items (func): ", cartId);
    try {
      const response = await axios.get(`${backendUrl}/api/cart/status?cart_id=${cartId}`);
      if (response.data.status === 'success') {
        if (response.data.cart_locked) {
          console.log("Cart is locked. Creating a new cart.");
          await deleteCart();
          await createNewCart();
        } else {
          const cartResponse = await axios.get(`${backendUrl}/api/cart?cart_id=${cartId}`);
          if (cartResponse.data.status === 'success') {
            setCart(prevCart => {
              if (JSON.stringify(prevCart) !== JSON.stringify(cartResponse.data)) {
                return {
                  cart_id: cartResponse.data.cart_id,
                  files: cartResponse.data.files || []
                };
              }
              return prevCart;
            });
          }
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response && error.response.status === 404) {
        await createNewCart();
      }
      return { status: 'error', message: 'Failed to fetch cart', cart_found: false };
    }
  };

  const deleteCart = async () => {
    const cartId = Cookies.get('cart_id');
    try {
      console.log("Deleting cart with id: ", cartId);
      const response = await axios.delete(`${backendUrl}/api/cart?cart_id=${cartId}`);
      if (response.data.status === 'success') {
        setCart({ cart_id: null, files: [] });
        Cookies.remove('cart_id');
        await createNewCart();
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting cart:', error);
      if (error.response && error.response.status === 404) {
        await createNewCart();
      }
      return { status: 'error', message: 'Failed to delete cart' };
    }
  };

  return (
    <CartContext.Provider value={{ cart, addFile, addBulkFiles, deleteFile, updateFile, getFilesFromCart, deleteCart }}>
      {children}
    </CartContext.Provider>
  );
};
