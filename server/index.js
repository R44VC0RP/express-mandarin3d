import dotenv from 'dotenv';
dotenv.config({
  'path': '.env.local'
});
import axios from 'axios';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  createUploadthing,
  createRouteHandler
} from "uploadthing/express";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  v4 as uuidv4
} from 'uuid';
import {
    createNewStripeProduct,
    deleteStripeProduct,
    createNewShippingOption,
    deleteShippingOption,
    getShippingOptions,
    createSession,
    getCheckoutSession,
    getPayment
} from './modules/stripeConn.js';
import {
    UTApi
} from "uploadthing/server";
import {
    calculatePrice
} from './modules/calculatingPrice.js';
import { 
  sendOrderReceivedEmail, 
  sendOrderShippedEmail,
  businessOrderReceived
} from './modules/email_sending.js';

const utapi = new UTApi();


// Modules

import {
  cartSchema,
  fileSchema,
  userSchema,
  configSchema,
  filamentSchema,
  addonSchema,
  productSchema,
  collectionSchema,
  orderNumberSchema,
  orderSchema,
  quoteSchema
} from './modules/dbSchemas.js';



// Express App Initialization and Setup

const app = express();

// Add this middleware before other app.use() calls
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Update CORS configuration

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


const Cart = mongoose.model('Cart', cartSchema);
const File = mongoose.model('File', fileSchema);
const User = mongoose.model('User', userSchema);
const Config = mongoose.model('Config', configSchema);
const Product = mongoose.model('Product', productSchema);
const Addon = mongoose.model('Addon', addonSchema);
const Collection = mongoose.model('Collection', collectionSchema);
const OrderNumber = mongoose.model('OrderNumber', orderNumberSchema);
const Order = mongoose.model('Order', orderSchema);
const Quote = mongoose.model('Quote', quoteSchema);

// #region LOGIN AND AUTHENTICATION

// Login route
app.post('/login', async (req, res) => {
  console.log("Login request received");
  const {
    username,
    password
  } = req.body;
  const user = await User.findOne({
    username
  });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      userId: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    console.log("User {username: ", user.username, ", role: ", user.role, "} logged in");
    res.json({
      token
    });
  } else {
    console.log("Invalid credentials for user {username: ", username, "}");
    res.status(401).json({
      message: 'Invalid credentials'
    });
  }
});


const requireLogin = async (req, res, next) => {
  const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
  if (!token) {
    console.log("No token provided");
    return res.status(403).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Failed to authenticate token");
    return res.status(401).json({
      message: 'Failed to authenticate token'
    });
  }
};

const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    console.log(`User {username: ${req.user?.username}, role: ${req.user?.role}} is not an admin`);
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// #endregion LOGIN AND AUTHENTICATION

// #region USER MANAGEMENT

/*
This is the authentication middleware that is used to protect routes that require the user to be logged in.
It uses JWT to authenticate the user.
*/

async function addUser(username, password, role, email = "", profilePicture = "", fullName = "") {
  console.log("Adding user: ", username, password, role, email, profilePicture, fullName);
  // Check if the username already exists
  const existingUser = await User.findOne({
    username
  });
  if (existingUser) {
    console.log('Username already exists');
    return {
      status: 'error',
      message: 'Username already exists'
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    password: hashedPassword,
    role,
    email,
    profilePicture,
    fullName: fullName || username
  });
  await user.save();
  console.log("User added successfully");
}

async function getUserByUserId(userId) {
  const user = await User.findById(userId);
  return user;
}

async function getUserByUsername(username) {
  // Find the user by username
  const user = await User.findOne({
    username
  });
  if (!user) {
    return null;
  }
  return user;
}

async function getUserRole(username) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  return user.role;
}

async function deleteUser(username) {
  const result = await User.deleteOne({
    username
  });
  if (result.deletedCount === 0) {
    return {
      status: 'error',
      message: 'User not found'
    };
  }
  return {
    status: 'success',
    message: 'User deleted successfully'
  };
}

async function updateUser(username, newPassword, newEmail, newProfilePicture, newFullName) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  if (newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
  }
  if (newEmail) {
    user.email = newEmail;
  }
  if (newProfilePicture) {
    user.profilePicture = newProfilePicture;
  }
  if (newFullName) {
    user.fullName = newFullName;
  }
  await user.save();
  return user;
}


/*
  GET /api/users
  - requires login & admin
  - returns all users and user objects except the password
*/
app.get('/api/users', requireLogin, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      status: 'success',
      users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

/*
  POST /api/users
  - requires login & admin
  - body: {
    action: 'add' | 'edit' | 'delete'
    userId: string
    username: string
    fullName: string
    password: string
    profilePic: string
  }
  - returns {
    status: 'success' | 'error'
    message: string
  }
*/

app.post('/api/users', requireLogin, requireAdmin, async (req, res) => {
  const {
    action,
    userId,
    username,
    fullName,
    password,
    profilePic
  } = req.body;

  try {
    switch (action) {
      case 'add':
        if (req.user.username === username) {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot add yourself'
          });
        }
        await addUser(username, password, 'user', '', profilePic, fullName);
        res.json({
          status: 'success',
          message: 'User added successfully'
        });
        break;

      case 'edit':
        // if (req.user.id === userId) {
        //   return res.status(400).json({ status: 'error', message: 'Cannot edit your own profile' });
        // }
        await updateUser(username, password, '', profilePic, fullName);
        res.json({
          status: 'success',
          message: 'User updated successfully'
        });
        break;

      case 'delete':
        if (req.user.id === userId) {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot delete your own profile'
          });
        }
        await deleteUser(username);
        res.json({
          status: 'success',
          message: 'User deleted successfully'
        });
        break;

      default:
        res.status(400).json({
          status: 'error',
          message: 'Invalid action'
        });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// #endregion USER MANAGEMENT

// #region FILE MANAGEMENT

const reSliceFile = async (fileid) => {
  const file = await File.findOne({
      fileid
  });
  if (!file) {
      return null;
  }
  file.file_status = "unsliced";
  await file.save();
  sliceFile(fileid);
  return {
      "status": "success",
      "message": "File resliced successfully"
  };
}


const sliceFile = async (fileid) => {
  const file = await File.findOne({
      fileid
  });
  if (!file) {
      return null;
  }
  const sliceResponse = await fetch('https://api.mandarin3d.com/v2/api/slice', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "fileid": fileid,
          "env": process.env.NODE_ENV
      })
  });
  return {
      "status": "success",
      "message": "File sliced successfully"
  };
}

const createNewFile = async (filename, utfile_id, utfile_url, price_override = null) => {
  const fileid = "file_" + uuidv4();
  const stripeProduct = await createNewStripeProduct(filename, fileid, utfile_id, utfile_url);
  const newFile = new File({
      fileid,
      stripe_product_id: stripeProduct.id,
      utfile_id,
      utfile_url,
      filename,
      price_override,
      file_status: "unsliced"
  });
  await newFile.save();
  // Post to https://api.mandarin3d.com/v2/api/slice
  console.log("Posting to https://api.mandarin3d.com/v2/api/slice");
  sliceFile(fileid);
  return newFile;
}

const updateFile = async (fileid, price_override) => {
  const file = await File.findOne({
      fileid
  });
  if (!file) {
      return null;
  }
  file.price_override = price_override;
  await file.save();
}
const deleteFile = async (fileid) => {
  // this requires a user to be an admin
  const file = await File.findOne({
      fileid
  });
  if (!file) {
      return null;
  }
  const product = await checkIfFileIsInProduct(fileid);
  if (product) {
    console.log("File is in product: ", product);
    return {
      status: 'error',
      message: 'File is in product'
    };
  }
  const stripeid = file.stripe_product_id;
  const utid = file.utfile_id;
  await File.deleteOne({
      fileid
  });
  await deleteStripeProduct(stripeid);
  await utapi.deleteFiles(utid); // Delete the file from UploadThing
  return file;
}

const getFile = async (fileid) => {
  const file = await File.findOne({
      fileid
  });
  return file;
}

const getAllFiles = async () => {
  const files = await File.find().sort({ dateCreated: -1 });
  const filesWithProductNames = await Promise.all(files.map(async (file) => {
    const product = await checkIfFileIsInProduct(file.fileid);
    const fileObject = file.toObject(); // Convert to a plain JavaScript object
    if (product) {
      fileObject.productName = product.product_title;
    }
    return fileObject;
  }));
  
  return filesWithProductNames;
}

app.post('/api/file', async (req, res) => {
  const {
    action,
    fileid,
    filename,
    utfile_id,
    utfile_url,
    price_override
  } = req.body;
  let result;
  console.log("File action: ", action, "fileid: ", fileid, "filename: ", filename, "utfile_id: ", utfile_id, "utfile_url: ", utfile_url, "price_override: ", price_override);
  try {
    switch (action) {
      case 'create':
        result = await createNewFile(filename, utfile_id, utfile_url, price_override);
        break;
      case 'get':
        console.log("Getting file with fileid: ", fileid);
        result = await getFile(fileid);
        break;
      case 'list':
        result = await getAllFiles();
        break;
      case 'slice':
        result = await reSliceFile(fileid);
        break;
      case 'update':
        result = await updateFile(fileid, price_override);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action'
        });
    }
    res.json({
      status: 'success',
      result
    });
  } catch (error) {
    console.error('Error handling file action:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

app.delete('/api/file', requireLogin, requireAdmin, async (req, res) => {
  const {
    fileid
  } = req.body;
  try {
    const result = await deleteFile(fileid);
    if (result) {
      res.json({
        status: 'success',
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create an UploadThing instance
const f = createUploadthing();

const ourFileRouter = {
  modelUploader: f({
    "blob": {
      maxFileSize: "128MB",
      maxFileCount: 20
    }
  })
    .onUploadComplete(async ({
      metadata,
      file
    }) => {
      console.log("File uploaded: ", file.name);

      const newFile = await createNewFile(file.name, file.key, file.url);
      console.log("File saved: ", newFile.fileid);
      return {
        status: "success",
        message: "File uploaded successfully",
        fileid: newFile.fileid
      }
    }),
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1
    }
  })
    .onUploadComplete(async ({
      metadata,
      file
    }) => {
      console.log("File uploaded: ", file.name);
    })

};

// Create the UploadThing route handler
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: ourFileRouter,
    logLevel: "Trace",
    config: {
      token: process.env.UPLOADTHING_TOKEN,
      isDev: process.env.NODE_ENV === "dev",
    },
  })
);

// Add this endpoint to get the status of all files
app.get('/api/file-status', async (req, res) => {
  try {
    const files = await getAllFiles();
    res.json({
      status: 'success',
      files
    });
  } catch (error) {
    console.error('Error fetching file statuses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// #endregion FILE MANAGEMENT

// #region CART MANAGEMENT

async function getAddon(addon_id) {
  const addon = await Addon.findOne({ addon_id });
  return addon;
}

async function getAddonByName(addon_name) {
  const addon = await Addon.findOne({ addon_name });
  return addon;
}

async function getAddonList() {
  const addons = await Addon.find();
  return addons;
}

async function createAddon(addon_name, addon_price, addon_description) {
  const addon_id = "addon_" + uuidv4();
  const newAddon = new Addon({
    addon_id,
    addon_name,
    addon_price,
    addon_description
  });

  await newAddon.save();
  return newAddon;
}

async function updateAddon(addon_id, addon_name, addon_price, addon_description) {
  const addon = await Addon.findOne({ addon_id });
  if (!addon) {
    return null;
  }
  addon.addon_name = addon_name;
  addon.addon_price = addon_price;
  addon.addon_description = addon_description;
  await addon.save();
  return addon;
}

async function deleteAddon(addon_id) {
  const addon = await Addon.findOne({ addon_id });
  if (!addon) {
    return null;
  }
  await Addon.deleteOne({ addon_id });
  return addon;
}

app.post('/api/addon', requireLogin, requireAdmin, async (req, res) => {
  const {
    action,
    addon_id,
    addon_name,
    addon_price,
    addon_description
  } = req.body;
  let result;
  try {
    switch (action) {
      case 'create':
        result = await createAddon(addon_name, addon_price, addon_description);
        break;
      case 'get':
        result = await getAddon(addon_id);
        break;
      case 'getByName':
        result = await getAddonByName(addon_name);
        break;
      case 'list':
        result = await getAddonList();
        break;
      case 'update':
        result = await updateAddon(addon_id, addon_name, addon_price, addon_description);
        break;
      case 'delete':
        result = await deleteAddon(addon_id);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action'
        });
    }
    res.json({
      status: 'success',
      result
    });
  } catch (error) {
    console.error('Error handling addon action:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

app.get('/api/addon', async (req, res) => {
  const { addon_id } = req.query;
  if (!addon_id) {
    return res.status(400).json({ status: 'error', message: 'No addon_id provided' });
  }
  const addon = await getAddon(addon_id);
  if (!addon) {
    return res.status(404).json({ status: 'error', message: 'Addon not found' });
  }
  res.json({ status: 'success', addon });
});

app.get('/api/addon/list', async (req, res) => {
  const addons = await getAddonList();
  for (const addon of addons) {
    addon.addon_price = parseFloat(addon.addon_price).toFixed(2);
  }
  res.json({ status: 'success', addons });
});


async function getCart(cart_id) {
  const cart = await Cart.findOne({ cart_id }).populate('cart_addons');
  return cart;
}
async function getCartComplete(cart_id) {
  const cart = await getCart(cart_id);
  if (!cart) {
    return null;
  }
  const cart_updated = cart.toObject();
  
  // do not modify the files array
  // create a new array with the same data, but with the file details added
  const filesWithDetails = await Promise.all(cart_updated.files.map(async (file) => {
    const fileDetails = await getFile(file.fileid);
    return {
      ...fileDetails.toObject(),
      quantity: file.quantity,
      quality: file.quality,
      filament_color: file.filament_color
    };
  }));

  return {
    ...cart_updated,
    files: filesWithDetails
  };
}

async function getAllCarts() {
  const carts = await Cart.find();
  return carts;
}

async function createCart() {
  const cart_id = "cart_" + uuidv4();
  console.log("Creating new cart with id: ", cart_id);
  const newCart = new Cart({ cart_id, files: [] });
  await newCart.save();
  return newCart.cart_id;
}

async function addFileToCart(cart_id, fileid, quantity = 1, quality = '0.20mm') {
  const cart = await getCart(cart_id);
  if (!cart) {
    console.error("No cart found for cart_id: ", cart_id);
    return { status: 'error', message: 'No cart found', cart_found: false };
  }
  console.log("Updating cartid: ", cart.cart_id, " with fileid: ", fileid);
  // Check if the file exists in the files db
  const file = await getFile(fileid);
  if (!file) {
    console.error("No file found for fileid: ", fileid);
    return { status: 'error', message: 'No file found', file_found: false };
  }
  const existingFileIndex = cart.files.findIndex(file => file.fileid === fileid);
  if (existingFileIndex === -1) {
    cart.files.push({ fileid, quantity, quality });
  } else {
    cart.files[existingFileIndex].quantity += quantity;
  }
  await cart.save();
  return { status: "success", message: "Cart updated successfully" };
}

app.post('/api/cart/create', async (req, res) => {
  try {
    const cart_id = await createCart();
    res.json({ status: 'success', cart_id });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create cart' });
  }
});

app.post('/api/cart/add', async (req, res) => {
  const { cart_id, fileid, quantity, quality } = req.body;
  if (!fileid || !cart_id) {
    return res.status(400).json({ status: 'error', message: 'No fileid or cart_id provided' });
  }
  const result = await addFileToCart(cart_id, fileid, quantity, quality);
  res.json(result);
});

app.post('/api/cart/remove', async (req, res) => {
  const { cart_id, fileid } = req.body;
  if (!fileid || !cart_id) {
    return res.status(400).json({ status: 'error', message: 'No fileid or cart_id provided' });
  }
  const cart = await getCart(cart_id);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Cart not found', cart_found: false });
  }
  cart.files = cart.files.filter(file => file.fileid !== fileid);
  await cart.save();
  res.json({ status: 'success', message: 'File removed from cart successfully' });
});

app.get('/api/cart/status', async (req, res) => {
  const { cart_id } = req.query;
  if (!cart_id) {
    return res.status(400).json({ status: 'error', message: 'No cart_id provided' });
  }
  const cart = await getCart(cart_id);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Cart not found' });
  }
  
  var files_not_sliced = [];
  for (const file of cart.files) {
    const fileDetails = await getFile(file.fileid);
    if (!fileDetails) {
      return res.status(404).json({ status: 'error', message: 'File not found', file_found: false });
    }
    if (fileDetails.file_status === 'unsliced') {
      files_not_sliced.push(fileDetails);
    }
  }
  
  res.json({
    status: 'success',
    cart_locked: cart.cart_locked,
    files_not_sliced: files_not_sliced.length > 0,
    files: files_not_sliced.length > 0 ? files_not_sliced : [],
    cart_valid: files_not_sliced.length === 0
  });
});


app.get('/api/cart', async (req, res) => {
  const { cart_id } = req.query;
  if (!cart_id || cart_id === undefined) {
    return res.status(400).json({ status: 'error', message: 'No cart_id provided' });
  }
  const cart = await getCart(cart_id);
  
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'No cart found', cart_found: false });
  }
  const filesWithDetails = await Promise.all(cart.files.map(async (file) => {
    const fileDetails = await getFile(file.fileid);
    if (!fileDetails) {
      return null;
    }
    let filament = await getFilamentByName(file.filament_color);
    if (!filament) {
      filament = await getDefaultFilament();
    }
    let price;
    if (fileDetails.price_override) {
      price = fileDetails.price_override;
    } else {
      price = calculatePrice(fileDetails, filament, file);
    }
    return {
      ...fileDetails.toObject(),
      quantity: file.quantity,
      quality: file.quality,
      filament_color: file.filament_color,
      price: price
    };
  }));
  const validFiles = filesWithDetails.filter(file => file !== null);
  cart.files = validFiles;
  
  // Fetch full addon details
  const addonsWithDetails = await Promise.all(cart.cart_addons.map(async (addon) => {
    const addonDetails = await getAddon(addon.addon_id);
    return addonDetails;
  }));
  
  await cart.save();
  res.json({ status: 'success', cart_id: cart.cart_id, files: validFiles, cart: { ...cart.toObject(), cart_addons: addonsWithDetails } });
});

app.delete('/api/cart', async (req, res) => {
  const { cart_id } = req.query;
  if (!cart_id) {
    return res.status(400).json({ status: 'error', message: 'No cart_id provided' });
  }
  const result = await Cart.findOneAndDelete({ cart_id });
  if (!result) {
    return res.status(404).json({ status: 'error', message: 'Cart not found' });
  }
  res.json({ status: 'success', message: 'Cart deleted successfully' });
});

app.post('/api/cart/update', async (req, res) => {
  const { cart_id, fileid, quantity, quality, color, cart_addons } = req.body;
  console.log("Updating cart with id: ", cart_id, " with fileid: ", fileid, " quantity: ", quantity, " quality: ", quality, " color: ", color, " addons: ", cart_addons);
  if (!cart_id) {
    return res.status(400).json({ status: 'error', message: 'No cart_id provided' });
  }
  const cart = await getCart(cart_id);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Cart not found', cart_found: false });
  }
  
  if (fileid) {
    const fileIndex = cart.files.findIndex(file => file.fileid === fileid);
    if (fileIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'File not found in cart' });
    }
    if (quantity !== undefined) {
      cart.files[fileIndex].quantity = quantity;
    }
    if (quality !== undefined) {
      cart.files[fileIndex].quality = quality;
    }
    if (color !== undefined) {
      cart.files[fileIndex].filament_color = color;
    }
  }
  
  if (cart_addons) {
    cart.cart_addons = cart_addons;
  }
  
  await cart.save();
  res.json({ status: 'success', message: 'Cart updated successfully' });
});

async function lockCart(cart_id) {
  const cart = await getCart(cart_id);
  if (!cart) {
    return false;
  }
  cart.cart_locked = true;
  await cart.save();
  return true;
}

app.post('/api/mgmt/cart', requireLogin, requireAdmin, async (req, res) => {
  const {
    action,
    cart_id,
    fileid,
    quantity,
    quality,
    color
  } = req.body;
  let result;
  try {
    switch (action) {
      case 'get':
        result = await getCart(cart_id);
        break;
      case 'list':
        result = await getAllCarts();
        break;
      case 'addFile':
        result = await addFileToCart(cart_id, fileid, quantity, quality, color);
        break;
      case 'removeFile':
        result = await removeFileFromCart(cart_id, fileid);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action'
        });
    }
    res.json({
      status: 'success',
      result
    });
  } catch (error) {
    console.error('Error handling cart action:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});
// #endregion CART MANAGEMENT

// #region ADMIN MANAGEMENT

// Protected route example
app.get('/protected', requireLogin, (req, res) => {
  res.json({
    message: 'This is a protected route',
    userId: req.userId
  });
});

app.get('/', (req, res) => {
  res.send({
    "status": "success",
    "message": "Server is running!"
  })
})

// New route to get user role
app.get('/user-role', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.json({
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user role'
    });
  }
});

// New route to get user data
app.get('/user-data', requireLogin, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.json({
      username: user.username,
      role: user.role,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user data'
    });
  }
});

// #endregion ADMIN MANAGEMENT

// #region INVENTORY MANAGEMENT


const Filament = mongoose.model('Filament', filamentSchema);

const getFilament = async (filament_id) => {
  const filament = await Filament.findOne({ filament_id });
  return filament;
}

const getFilamentByName = async (filament_name) => {
  const filament = await Filament.findOne({ filament_name });
  return filament;
}

const getDefaultFilament = async () => {
  const filament = await Filament.findOne();
  return filament;
}

const getFilamentList = async () => {
  const filaments = await Filament.find();
  return filaments;
}

const addFilament = async (filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link) => {
  const filament_id = "filament_" + uuidv4();
  const newFilament = new Filament({
    filament_id,
    filament_brand,
    filament_name,
    filament_color,
    filament_unit_price,
    filament_image_url,
    filament_mass_in_grams,
    filament_link
  });
  await newFilament.save();
  return newFilament;
}

const updateFilament = async (filament_id, filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link) => {
  const filament = await Filament.findOne({ filament_id });
  if (!filament) {
    return null;
  }
  filament.filament_brand = filament_brand;
  filament.filament_name = filament_name;
  filament.filament_unit_price = filament_unit_price;
  filament.filament_image_url = filament_image_url;
  filament.filament_mass_in_grams = filament_mass_in_grams;
  filament.filament_link = filament_link;
  await filament.save();
  return filament;
}

const deleteFilament = async (filament_id) => {
  await Filament.deleteOne({ filament_id });
}

app.post('/api/filament', async (req, res) => {
  const {
    action,
    filament_id,
    filament_brand,
    filament_name,
    filament_color,
    filament_unit_price,
    filament_image_url,
    filament_mass_in_grams,
    filament_link
  } = req.body;
  try {
    let result;
    switch (action) {

      case 'get':
        result = await getFilament(filament_id);
        break;
      case 'list':
        result = await getFilamentList();
        break;
      case 'add':
        result = await addFilament(filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link);
        break;
      case 'update':
        result = await updateFilament(filament_id, filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link);
        break;
      case 'delete':
        result = await deleteFilament(filament_id);
        break;
      default:
        console.error("Invalid Action")
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling filament action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// #endregion INVENTORY MANAGEMENT

// #region PRODUCT MANAGEMENT

const createProduct = async (product_title, product_description, product_features = [], product_image_url, product_fileid, product_author = "Mandarin 3D Prints", product_author_url = "https://mandarin3d.com", product_license = "CC BY-SA 4.0", product_url = "https://mandarin3d.com", product_tags = [], product_collection = null) => {
  // First, check if the product already exists
  const existingProduct = await Product.findOne({ product_title });
  if (existingProduct) {
    return existingProduct;
  }

  const product_features_array = product_features.split(',');

  // Make sure the product_fileid and product_filament_id are valid
  const file = await File.findOne({ fileid: product_fileid });
  if (!file) {
    return null;
  }
  const product_id = "product_" + uuidv4();
  const newProduct = new Product({
    product_id,
    product_title,
    product_description,
    product_features: product_features_array,
    product_image_url,
    product_fileid,
    product_author,
    product_author_url,
    product_license,
    product_url,
    product_tags,
    product_collection
  });
  await newProduct.save();
  return newProduct;
}

const checkIfFileIsInProduct = async (fileid) => {
  const product = await Product.findOne({ product_fileid: fileid });
  if (product) {
    return product;
  }
  return false;
}

const getProduct = async (product_id) => {
  const product = await Product.findOne({ product_id });
  const file = await File.findOne({ fileid: product.product_fileid });
  const filament = await Filament.findOne({ });
  if (file && file.file_status === "success") {
    const price = calculatePrice(file, filament, { quantity: 1, quality: '0.20mm' });
    product.product_price = price;
    product.file_obj = file;
  } else {
    product.product_price = 1;
    product.file_obj = null;
  }
  return product;
}

const getProductList = async () => {
  const products = await Product.find();
  for (const product of products) {
    const file = await File.findOne({ fileid: product.product_fileid });
    const filament = await Filament.findOne({ });
    if (file && file.file_status === "success") {
      const price = calculatePrice(file, filament, { quantity: 1, quality: '0.20mm' });
      product.product_price = price;
      product.file_obj = file;
    } else {
      product.product_price = 1;
      product.file_obj = null;
    }
  }
  return products;
}

const updateProduct = async (product_id, product_title, product_description, product_features, product_image_url, product_fileid, product_author, product_author_url, product_license, product_url, product_tags, product_collection) => {
  const product = await Product.findOne({ product_id });
  if (!product) {
    return null;
  }
  if (product_title) {
    product.product_title = product_title;
  }
  if (product_description) {
    product.product_description = product_description;
  }
  if (product_features) {
    product.product_features = product_features;
  }
  if (product_image_url) {
    product.product_image_url = product_image_url;
  }
  if (product_fileid) {
    product.product_fileid = product_fileid;
  }
  if (product_author) {
    product.product_author = product_author;
  }
  if (product_author_url) {
    product.product_author_url = product_author_url;
  }
  if (product_license) {
    product.product_license = product_license;
  }
  if (product_url) {
    product.product_url = product_url;
  }
  if (product_tags) {
    product.product_tags = product_tags;
  }
  if (product_collection) {
    product.product_collection = product_collection;
  }
  await product.save();
  return product;
}

const deleteProduct = async (product_id) => {
  await Product.deleteOne({ product_id });
}

// Add new functions for collection management
const createCollection = async (collection_name, collection_description, collection_image_url) => {
  const collection_id = "collection_" + uuidv4();
  const newCollection = new Collection({
    collection_id,
    collection_name,
    collection_description,
    collection_image_url
  });
  await newCollection.save();
  return newCollection;
}

const getCollection = async (collection_id) => {
  const collection = await Collection.findOne({ collection_id });
  return collection;
}

const getCollectionList = async () => {
  const collections = await Collection.find();
  return collections;
}

const updateCollection = async (collection_id, collection_name, collection_description, collection_image_url, featured) => {
  const collection = await Collection.findOne({ collection_id });
  if (!collection) {
    return null;
  }
  if (collection_name) collection.collection_name = collection_name;
  if (collection_description) collection.collection_description = collection_description;
  if (collection_image_url) collection.collection_image_url = collection_image_url;
  if (featured !== undefined) {
    collection.featured = featured;
  }
  await collection.save();
  return collection;
}

// Add a new function to get the featured collection
const getFeaturedCollection = async () => {
  const collection = await Collection.findOne({ featured: true });
  return collection;
}

const deleteCollection = async (collection_id) => {
  await Collection.deleteOne({ collection_id });
  // Remove the collection from all products
  await Product.updateMany({ product_collection: collection_id }, { $unset: { product_collection: "" } });
}

app.get('/api/product', async (req, res) => {
  const { action } = req.query;
  let result;
  try {
    switch (action) {
      case 'list':
        result = await getProductList();
        break;
      case 'featured_product':
        result = await Product.findOne({ product_tags: 'featured' });
        result = await getProduct(result.product_id);
        break;
      default:
        console.error("Invalid Action")
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling product action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


app.post('/api/product', async (req, res) => {
  const {
    action,
    product_id,
    product_title,
    product_description,
    product_features,
    product_image_url,
    product_fileid,
    product_author,
    product_author_url,
    product_license,
    product_url=null,
    product_tags,
    product_collection
  } = req.body;
  try {
    let result;
    switch (action) {
      case 'create':
        result = await createProduct(product_title, product_description, product_features, product_image_url, product_fileid, product_author, product_author_url, product_license, product_url, product_tags, product_collection);
        break;
      case 'get':
        result = await getProduct(product_id);
        break;
      case 'list':
        result = await getProductList();
        break;
      case 'update':
        result = await updateProduct(product_id, product_title, product_description, product_features, product_image_url, product_fileid, product_author, product_author_url, product_license, product_url, product_tags, product_collection);
        break;
      case 'delete':
        result = await deleteProduct(product_id);
        break;
      case 'checkIfFileIsInProduct':
        result = await checkIfFileIsInProduct(product_fileid);
        break;
      default:
        console.error("Invalid Action")
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling product action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Add a new API endpoint for collection management
app.post('/api/collection', requireLogin, requireAdmin, async (req, res) => {
  const {
    action,
    collection_id,
    collection_name,
    collection_description,
    collection_image_url,
    featured
  } = req.body;
  try {
    let result;
    switch (action) {
      case 'create':
        result = await createCollection(collection_name, collection_description, collection_image_url);
        break;
      case 'get':
        result = await getCollection(collection_id);
        break;
      case 'list':
        result = await getCollectionList();
        break;
      case 'update':
        if (featured) {
          // Unset featured on all other collections
          await Collection.updateMany({}, { featured: false });
        }
        result = await updateCollection(collection_id, collection_name, collection_description, collection_image_url, featured);
        break;
      case 'delete':
        result = await deleteCollection(collection_id);
        break;
      default:
        console.error("Invalid Action")
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling collection action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Endpoint to get the featured collection
app.get('/api/collection/featured', async (req, res) => {
  try {
    const collection = await getFeaturedCollection();
    if (!collection) {
      return res.status(404).json({ status: 'error', message: 'No featured collection found' });
    }
    res.json({
      status: 'success',
      collection: {
        name: collection.collection_name,
        description: collection.collection_description,
        image_url: collection.collection_image_url
      }
    });
  } catch (error) {
    console.error('Error fetching featured collection:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Add this new function in the PRODUCT MANAGEMENT section
async function getCollectionWithProducts(collectionId) {
  const collection = await Collection.findOne({ collection_id: collectionId });
  if (!collection) {
    return null;
  }

  const products = await Product.find({ product_collection: collectionId });
  
  // Fetch file details and calculate prices for each product
  const productsWithDetails = await Promise.all(products.map(async (product) => {
    const file = await File.findOne({ fileid: product.product_fileid });
    const filament = await Filament.findOne({});
    let price = 0;

    if (file && file.file_status === "success") {
      if (file.price_override) {
        price = file.price_override;
      } else {
        price = calculatePrice(file, filament, { quantity: 1, quality: '0.20mm' });
      }
    }

    return {
      ...product.toObject(),
      price: price,
      file_status: file ? file.file_status : 'unknown'
    };
  }));

  return {
    collection,
    products: productsWithDetails
  };
}

async function getCollectionProducts(collectionId) {
  const collection = await Collection.findOne({ collection_id: collectionId });
  if (!collection) {
    return null;
  }

  const products = await Product.find({ product_collection: collectionId });
  const filament = await Filament.findOne({});

  for (const product of products) {
    const file = await File.findOne({ fileid: product.product_fileid });
    product.file_obj = file;

    product.product_price = calculatePrice(file, filament, { quantity: 1, quality: '0.20mm' });
  }
  return products;
}

// Add this new route in the PRODUCT MANAGEMENT section
app.get('/api/collection/:collectionId', async (req, res) => {
  const { collectionId } = req.params;
  try {
    const collection = await getCollection(collectionId);
    const result = await getCollectionProducts(collectionId);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Collection not found' });
    }
    res.json({ status: 'success', products: result, collection: collection });
  } catch (error) {
    console.error('Error fetching collection with products:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/api/collections/products', async (req, res) => {
  const { collectionId } = req.params;
  try {
    const result = await getCollectionWithProducts(collectionId);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Collection not found' });
    }
    res.json({ status: 'success', collection: result.collection, products: result.products });
  } catch (error) {
    console.error('Error fetching collection with products:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// #endregion PRODUCT MANAGEMENT

// #region SHIPPING MANAGEMENT

app.post('/api/shipping', requireLogin, requireAdmin, async (req, res) => {
  const {
    action,
    shipping_option_id,
    name,
    price,
    delivery_estimate,
    notes
  } = req.body;
  let result;
  try {
    switch (action) {
      case 'create':
        result = await createNewShippingOption(name, price, delivery_estimate, notes);
        break;
      case 'delete':
        result = await deleteShippingOption(shipping_option_id);
        break;
      case 'list':
        result = await getShippingOptions();
        break;
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling shipping action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/api/shipping', async (req, res) => {
  const { action } = req.query;
  let result;
  try {
    switch (action) {
      case 'list':
        result = await getShippingOptions();
        break;
      default:
        console.error("Invalid Action")
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling shipping action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// #endregion SHIPPING MANAGEMENT

// #region SETTINGS MANAGEMENT

app.get('/api/configs', requireLogin, requireAdmin, async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config || {});
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching configs'
    });
  }
});

app.get('/api/configs/shippingthreshold', async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) {
      return res.status(404).json({
        status: 'error',
        message: 'Config not found'
      });
    }
    res.json({
      status: 'success',
      freeShippingThreshold: config.priceConfig.freeShippingThreshold
    });
  } catch (error) {
    console.error('Error fetching free shipping threshold:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching free shipping threshold'
    });
  }
});

// Update configs
app.post('/api/configs', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { dimensionConfig, priceConfig, stripeConfig } = req.body;
    
    // Validate the freeShippingThreshold
    if (priceConfig && priceConfig.freeShippingThreshold !== undefined) {
      if (isNaN(priceConfig.freeShippingThreshold) || priceConfig.freeShippingThreshold < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Free shipping threshold must be a non-negative number'
        });
      }
    }

    const updatedConfig = await Config.findOneAndUpdate({}, {
      dimensionConfig,
      priceConfig,
      stripeConfig
    }, {
      new: true,
      upsert: true
    });

    res.json({
      status: 'success',
      config: updatedConfig
    });
  } catch (error) {
    console.error('Error updating configs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating configs'
    });
  }
});

// #endregion SETTINGS MANAGEMENT

// #region CHECKOUT MANAGEMENT

app.post('/api/checkout', async (req, res) => {
  const { order_comments, shipping_option_id, cart_id, test_mode } = req.body;
  try {
    const cart = await getCart(cart_id);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const checkoutObject = {
      line_items: [],
      total: 0,
      free_shipping: false
    };

    // Process files
    const pricing_obj = {};
    let price = 0;
    for (const file of cart.files) {
      const fileDetails = await File.findOne({ fileid: file.fileid });
      const getFilament = await getFilamentByName(file.filament_color);
      if (!fileDetails) {
        console.error(`File not found: ${file.fileid}`);
        continue;
      }
      console.log("File: ", file);
      if (fileDetails.price_override) {
        price = fileDetails.price_override;
        console.log("File Override: ", file.fileid, "Price: ", price);
      } else {
        price = calculatePrice(fileDetails, getFilament, file);
      }
      
      pricing_obj[file.fileid] = price;
      

      
      checkoutObject.line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: fileDetails.filename,
            metadata: {
              fileid: file.fileid,
              quality: file.quality,
              filament_color: file.filament_color
            }
          },
          unit_amount: Math.round(price * 100) // Stripe uses cents
        },
        quantity: file.quantity
      });
      checkoutObject.total += price * file.quantity;
    }

    const config = await Config.findOne();
    const free_shipping = checkoutObject.total >= config.priceConfig.freeShippingThreshold;
    if (free_shipping) {
      checkoutObject.free_shipping = true;
    } else {
      checkoutObject.free_shipping = false;
    }

    // Process addons
    for (const addon of cart.cart_addons) {
      checkoutObject.line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: addon.addon_name,
            metadata: {
              addon_id: addon.addon_id
            }
          },
          unit_amount: addon.addon_price
        },
        quantity: 1
      });
      checkoutObject.total += addon.addon_price / 100; // Convert cents to dollars for the total
    }

    // console.log('Checkout object:', JSON.stringify(checkoutObject, null, 2));
    // Here you would create a Stripe checkout session using the checkoutObject
    const session = await createSession(checkoutObject, shipping_option_id, cart_id, order_comments, test_mode, pricing_obj);
    // console.log('Stripe checkout session:', session);

    // For now, we'll just return a mock response
    res.json({ 
      status: 'success', 
      message: 'Checkout object created successfully', 
      checkout_url: session.url,
      total: checkoutObject.total
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/api/email/test', async (req, res) => {
  const order = await Order.findOne({ order_number: '#1255-2024' });
  const test_email = await sendOrderReceivedEmail(order);
  const business_email = await businessOrderReceived(order);
  res.json({ status: 'success', message: 'Email sent successfully', test_email });
});



app.get('/api/checkout/success', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ status: 'error', message: 'Session ID is required' });
  }
  


  try {
    const order_id = await checkOrdersForSession(session_id);
    if (order_id != "NONE") {
      return res.redirect(`${process.env.FRONTEND_URL}/confirmation/${order_id}`);
    } else {
    const checkout_session_info = await getCheckoutSession(session_id);
    let cart_id = checkout_session_info.metadata.cart_id;
    let pricing_obj = JSON.parse(checkout_session_info.metadata.pricing_obj);
    const cart = await getCartComplete(cart_id);
    console.log("NEW ORDER CREATED AT " + new Date().toLocaleString());

      // const payment = await getPayment(checkout_session_info.payment_intent);

      // Lock the cart
      await lockCart(cart_id);

      const order = await createOrder(cart, checkout_session_info, pricing_obj);

      // Print the receipt

      console.log("Order: ", order.cart.files);
      var order_object = {
        "order_number": order.order_number,
        "customer_name": order.customer_details.name,
        "order_date": order.dateCreated,
        "line_items": order.cart.files.map(file => ({
          qty: file.quantity,
          product: file.filename,
          price: file.file_sale_cost
        })),
        "addons": cart.cart_addons.map(addon => ({
          name: addon.addon_name,
          price: parseFloat(addon.addon_price / 100)
        }))
      }

      
      const response = await axios.post('https://host.home.exonenterprise.com/print', {
        name: `receipt ${order.order_id}`,
        pdf_url: "none",
        action: 'print_receipt',
        order_object: order_object
      });

      const email_result = await sendOrderReceivedEmail(order);
      const business_email_result = await businessOrderReceived(order);
      console.log("Email result: ", email_result);

      // console.log("Checkout session info: ", checkout_session_info);
      res.redirect(`${process.env.FRONTEND_URL}/confirmation/${order.order_id}`);
    }
    //res.json({ status: 'success', message: 'Checkout successful', order_id: order.order_id });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve checkout session' });
  }
});

// #endregion CHECKOUT MANAGEMENT

// #region ORDER MANAGEMENT

app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }
    res.json({ status: 'success', order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch order' });
  }
});




app.post('/api/admin/orders/downloadAllFiles', requireLogin, requireAdmin, async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    const zip = new JSZip();
    const filePromises = order.cart.files.map(async (file) => {
      console.log("Downloading file: ", file.fileid);
      const response = await axios.get(file.utfile_url, { responseType: 'arraybuffer' });
      zip.file(file.fileid, response.data);
    });

    await Promise.all(filePromises);
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${orderId}_files.zip`
    });
    res.send(zipContent);
  } catch (error) {
    console.error('Error downloading files:', error);
    res.status(500).json({ status: 'error', message: 'Failed to download files' });
  }
});


app.get('/api/admin/orders/getall', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== 'all') {
      query.order_status = status;
    }

    const orders = await Order.find(query)
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$order_status', count: { $sum: 1 } } }
    ]);

    const statusCountsObject = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      status: 'success',
      orders,
      totalOrders,
      statusCounts: statusCountsObject,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch orders' });
  }
});

async function updateOrderStatus(orderId, newStatus) {
  const order = await Order.findOne({ order_id: orderId });
  if (!order) {
    return { status: 'error', message: 'Order not found' };
  }
  console.log("Order: ", newStatus);
  if (newStatus === 'Shipping') {
    const email_result = await sendOrderShippedEmail(order);
    
    console.log("Email result: ", email_result);
    
  }

  order.order_status = newStatus;
  order.dateUpdated = new Date();
  await order.save();
  return { status: 'success', message: 'Order status updated' };
}

async function createShippingLabel(orderId) {
  const order = await Order.findOne({ order_id: orderId });
  if (!order) {
    return { status: 'error', message: 'Order not found' };
  }

  const auth = Buffer.from(`${process.env.SENDLE_ACC}:${process.env.SENDLE_KEY}`).toString('base64');

  // Calculate total weight from file masses
  const totalWeight = order.cart.files.reduce((acc, file) => {
    return acc + (file.mass_in_grams * file.quantity);
  }, 0);

  // Ensure the weight is at least 0.1 kg (100 grams)
  const weightInKg = Math.max((totalWeight / 1000), 0.1).toFixed(2);

  try {
    const response = await axios.post('https://api.sendle.com/api/orders', {
      sender: {
        contact: {
          name: "Mandarin 3D Prints",
          email: "orders@mandarin3d.com",
          phone: "+19041234567", // Remove hyphens
          company: "Mandarin 3D Prints"
        },
        address: {
          country: "US",
          address_line1: "8 UNF Drive",
          address_line2: "PMB 231",
          suburb: "Jacksonville",
          postcode: "32246",
          state_name: "FL"
        },
        instructions: "Please handle with care"
      },
      receiver: {
        contact: {
          name: order.customer_details.name
        },
        address: {
          country: "US",
          address_line1: order.shipping_details.address.line1,
          address_line2: order.shipping_details.address.line2 || "",
          suburb: order.shipping_details.address.city,
          postcode: order.shipping_details.address.postal_code,
          state_name: order.shipping_details.address.state
        },
        instructions: order.shipping_details.instructions || "Please handle with care"
      },
      weight: {
        units: "kg",
        value: weightInKg
      },
      dimensions: {
        units: "cm",
        length: "15",
        width: "15",
        height: "15"
      },
      description: "3D Printed Items",
      customer_reference: orderId,
      product_code: "STANDARD-DROPOFF",
      pickup_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      packaging_type: "box",
      hide_pickup_address: false
    }, {
      headers: {
        'accept': 'application/json',
        'authorization': `Basic ${auth}`,
        'content-type': 'application/json'
      }
    });

    console.log("Sendle response: ", response.data);
    const { 
      sendle_reference, 
      tracking_url, 
      labels, 
      price: { gross: { amount: total_cost } },
      order_id: sendle_order_id,
    } = response.data;
    const label_url = labels.find(label => label.size === 'cropped')?.url;
    const pdfCroppedUrl = label_url;
    // Fetch the download URL for the cropped PDF label
    let downloadUrl;
    try {
      const headResponse = await axios.head(pdfCroppedUrl, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      downloadUrl = headResponse.request.res.responseUrl;
      console.log("PDF Cropped Download URL:", downloadUrl);

      // Upload the PDF directly from the URL to UploadThing
      console.log("Uploading shipping label to UploadThing");
      const uploadResponse = await utapi.uploadFilesFromUrl(
        {
          url: downloadUrl,
          name: `shipping_label_${orderId}.pdf`,
        },
        {
          metadata: { orderId },
          contentDisposition: 'attachment',
        }
      );

      console.log("UploadThing response:", uploadResponse);

      console.log("Shipping label uploaded successfully");

      // Update the order with the UploadThing file URL
      const order = await Order.findOne({ order_id: orderId });
      if (order) {
        order.shipping_label_url = uploadResponse.data.url;
        order.shipping_details.sendle_reference = sendle_reference;
        order.shipping_details.tracking_url = tracking_url;
        await order.save();
      }

    } catch (error) {
      console.error("Error processing shipping label:", error);
    }

    console.log("Sendle Reference:", sendle_reference);
    console.log("Tracking URL:", tracking_url);
    console.log("Total Cost:", total_cost);

    const shippingLabel = response.data;
    return { status: 'success', message: 'Shipping label created', shippingLabel };
  } catch (error) {
    console.error('Error creating shipping label:', error);
    let errorMessage = 'Failed to create shipping label';
    let errorDetails = {};

    if (error.response) {
      console.error('Error response:', error.response.data.messages.receiver);
      errorDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };

      if (error.response.data && error.response.data.messages) {
        if (error.response.data.messages.receiver && error.response.data.messages.receiver.length > 0) {
          errorMessage = error.response.data.messages.receiver[0];
        } else if (typeof error.response.data.messages === 'string') {
          errorMessage = error.response.data.messages;
        } else {
          errorMessage = JSON.stringify(error.response.data.messages);
        }
      }
    } else if (error.request) {
      console.error('Error request:', error.request.messages);
      errorMessage = 'No response received from Sendle API';
      errorDetails = { request: error.request };
    } else {
      console.error('Error:', error.message);
      errorMessage = error.message;
    }

    return { 
      status: 'error', 
      message: errorMessage, 
      error: errorDetails 
    };
  }
}

async function printShippingLabel(orderId) {
  const order = await Order.findOne({ order_id: orderId });
  if (!order) {
    return { status: 'error', message: 'Order not found' };
  }

  const labelUrl = order.shipping_label_url;
  if (!labelUrl) {
    return { status: 'error', message: 'Shipping label not found' };
  }

  try {
    const response = await axios.post('https://host.home.exonenterprise.com/print', {
      name: `Shipping_Label_${orderId}`,
      pdf_url: labelUrl,
      action: 'print_label'
    });

    if (response.status === 200) {
      return { status: 'success', message: 'Shipping label sent to printer' };
    } else {
      return { status: 'error', message: 'Failed to send shipping label to printer' };
    }
  } catch (error) {
    console.error('Error printing shipping label:', error);
    return { status: 'error', message: 'Error occurred while printing shipping label' };
  }
}

async function printReceipt(orderId) {
  const order = await Order.findOne({ order_id: orderId });
  if (!order) {
    return { status: 'error', message: 'Order not found' };
  }

  var order_object = {
    "order_number": order.order_number,
    "customer_name": order.customer_details.name,
    "order_date": order.dateCreated,
    "line_items": order.cart.files.map(file => ({
      qty: file.quantity,
      product: file.filename,
      price: file.file_sale_cost
    })),
    "addons": order.cart.cart_addons.map(addon => ({
      name: addon.addon_name,
      price: parseFloat(addon.addon_price / 100)
    }))
  }

  
  const response = await axios.post('https://host.home.exonenterprise.com/print', {
    name: `receipt ${order.order_id}`,
    pdf_url: "none",
    action: 'print_receipt',
    order_object: order_object
  });

  return { status: 'success', message: 'Receipt sent to printer' };
  
}

app.post('/api/admin/orders/actions', requireLogin, requireAdmin, async (req, res) => {
  const { orderId, action, newStatus } = req.body;
  let result;
  try {
    switch (action) {
      case 'delete':
        result = await deleteOrder(orderId);
        break;
      case 'updateStatus':
        result = await updateOrderStatus(orderId, newStatus);
        break;
      case 'createShippingLabel':
        result = await createShippingLabel(orderId);
        break;
      case 'printShippingLabel':
        result = await printShippingLabel(orderId);
        break;
      case 'printReceipt':
        result = await printReceipt(orderId);
        break;
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling order action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

async function checkOrdersForSession(session_id) {
  const orders = await Order.find({ stripe_session_id: session_id });
  if (orders.length > 0) {
    return orders[0].order_id;
  }
  return "NONE";
}

async function createOrder(cart, checkout_session_info, pricing_obj) {
  // Get the last order number and increment it
  const orderNumberDoc = await OrderNumber.findOneAndUpdate(
    {},
    { $inc: { lastOrderNumber: 1 } },
    { new: true, upsert: true }
  );

  const orderNumber = orderNumberDoc.lastOrderNumber;

  // Calculate subtotal for files
  const subtotal = cart.files.reduce((acc, file) => {
    return acc + (parseFloat(pricing_obj[file.fileid]) * file.quantity);
  }, 0);

  // Calculate total for addons
  const addonsTotal = cart.cart_addons.reduce((acc, addon) => {
    return acc + (parseFloat(addon.addon_price) / 100);
  }, 0);

  // Calculate total before tax and shipping
  let items_total = subtotal + addonsTotal;

  // Add tax and shipping
  const shipping = parseFloat(checkout_session_info.total_details.amount_shipping) / 100;
  const tax = parseFloat(checkout_session_info.total_details.amount_tax) / 100;

  // Calculate final total
  const order_total = parseFloat((items_total + shipping + tax).toFixed(2));

  const order_comments = checkout_session_info.metadata.order_comments;
  console.log("Order comments: ", order_comments);
  console.log(`Test mode: ${typeof checkout_session_info.metadata.test_mode}`);

  const order = new Order({
    order_id: "order_" + uuidv4(),
    order_number: `#${orderNumber}-${new Date().getFullYear()}`,
    order_comments: order_comments,
    stripe_session_id: checkout_session_info.id,
    customer_details: {
      address: {
        city: checkout_session_info.customer_details.address.city,
        country: checkout_session_info.customer_details.address.country,
        line1: checkout_session_info.customer_details.address.line1,
        line2: checkout_session_info.customer_details.address.line2,
        postal_code: checkout_session_info.customer_details.address.postal_code,
        state: checkout_session_info.customer_details.address.state
      },
      email: checkout_session_info.customer_details.email,
      name: checkout_session_info.customer_details.name
    },
    test_mode: checkout_session_info.metadata.test_mode,
    payment_status: checkout_session_info.payment_status,
    shipping_details: {
      address: {
        city: checkout_session_info.shipping_details.address.city,
        country: checkout_session_info.shipping_details.address.country,
        line1: checkout_session_info.shipping_details.address.line1,
        line2: checkout_session_info.shipping_details.address.line2,
        postal_code: checkout_session_info.shipping_details.address.postal_code,
        state: checkout_session_info.shipping_details.address.state
      }
    },
    total_details: {
      amount_discount: checkout_session_info.total_details.amount_discount,
      amount_shipping: checkout_session_info.total_details.amount_shipping,
      amount_tax: checkout_session_info.total_details.amount_tax,
      amount_subtotal: Math.round(items_total * 100), // Store in cents
      amount_total: Math.round(order_total * 100) // Store in cents
    },
    shipping_rate_id: checkout_session_info.shipping_rate_id,
    cart: {
      cart_id: cart.cart_id,
      files: cart.files.map(file => ({
        fileid: file.fileid,
        quantity: file.quantity,
        quality: file.quality,
        filament_color: file.filament_color,
        dimensions: file.dimensions,
        stripe_product_id: file.stripe_product_id,
        filename: file.filename,
        file_status: file.file_status,
        utfile_id: file.utfile_id,
        utfile_url: file.utfile_url,
        price_override: file.price_override,
        dateCreated: file.dateCreated,
        file_deletion_date: file.file_deletion_date,
        mass_in_grams: file.mass_in_grams,
        file_sale_cost: parseFloat(pricing_obj[file.fileid])
      })),
      cart_addons: cart.cart_addons.map(addon => ({
        addon_name: addon.addon_name,
        addon_id: addon.addon_id,
        addon_price: parseFloat(addon.addon_price).toFixed(2)
      })),
      dateCreated: cart.dateCreated,
      livemode: checkout_session_info.metadata.test_mode === 'false'
    }
  });
  await order.save();
  return order;
}


// #endregion ORDER MANAGEMENT

// #region QUOTE MANAGEMENT

app.post('/api/quote/mgmt', requireLogin, async (req, res) => {
  const { quote_comments, quote_files, action, quote_id } = req.body;
  switch (action) {
    case 'create':
      var quote = new Quote({
        quote_id: "quote_" + uuidv4(),
        quote_comments,
        quote_files
      });
      await quote.save();
      res.json({ status: 'success', message: 'Quote created successfully', quote });
      break;
    case 'update':
      var quote = await Quote.findOne({ quote_id: quote_id });
      if (!quote) {
        return res.status(404).json({ status: 'error', message: 'Quote not found' });
      }
      quote.quote_comments = quote_comments;
      quote.quote_files = quote_files;
      await quote.save();
      res.json({ status: 'success', message: 'Quote updated successfully', quote });
      break;
    case 'list':
      var quotes = await Quote.find();
      res.json({ status: 'success', message: 'Quotes fetched successfully', quotes });
      break;
    case 'delete':
      var quote = await Quote.findOne({ quote_id: quote_id });
      if (!quote) {
        return res.status(404).json({ status: 'error', message: 'Quote not found' });
      }
      await quote.delete();
      res.json({ status: 'success', message: 'Quote deleted successfully' });
      break;
  }
});

app.get('/api/quote/get/:quote_id', async (req, res) => {
  const { quote_id } = req.params;
  var quote = await Quote.findOne({ quote_id: quote_id });
  if (!quote) {
    return res.status(404).json({ status: 'error', message: 'Quote not found' });
  }
  res.json({ status: 'success', message: 'Quote fetched successfully', quote });
});


// #endregion QUOTE MANAGEMENT

// #region CONTACT AND CUSTOM ORDER MANAGEMENT

app.post('/api/contact/fileissue', async (req, res) => {
  const { fileid, email } = req.body;
  try {
    const file = await File.findOne({ fileid });
    if (!file) {
      return res.status(404).json({ status: 'error', message: 'File not found' });
    }
    return res.status(200).json({ status: 'success', message: 'File forwarded for review successfully.' });
  } catch (error) {
    console.error('Error forwarding file for review:', error);
    return res.status(500).json({ status: 'error', message: 'An error occurred while forwarding the file. Please try again.' });
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080')
  console.log('CORS is enabled for: ', process.env.FRONTEND_URL)
})