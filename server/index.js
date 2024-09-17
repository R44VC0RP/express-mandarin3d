import dotenv from 'dotenv';
dotenv.config({
  'path': '.env.local'
});
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
    getShippingOptions
} from './modules/stripeConn.js';
import {
    UTApi
} from "uploadthing/server";
import {
    calculatePrice
} from './modules/calculatingPrice.js';

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
  collectionSchema
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
    addon.addon_price = (addon.addon_price / 100).toFixed(2);
  }
  res.json({ status: 'success', addons });
});


async function getCart(cart_id) {
  const cart = await Cart.findOne({ cart_id }).populate('cart_addons');
  return cart;
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
  if (files_not_sliced.length > 0) {
    return res.status(201).json({ status: 'success', message: 'Files are not sliced', files_not_sliced: true, files: files_not_sliced });
  } else {
    res.json({ status: 'success', message: 'Cart is valid', cart_valid: true });
  }
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
    } else {
      product.product_price = 1;
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

const updateCollection = async (collection_id, collection_name, collection_description, collection_image_url) => {
  const collection = await Collection.findOne({ collection_id });
  if (!collection) {
    return null;
  }
  if (collection_name) collection.collection_name = collection_name;
  if (collection_description) collection.collection_description = collection_description;
  if (collection_image_url) collection.collection_image_url = collection_image_url;
  await collection.save();
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
    collection_image_url
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
        result = await updateCollection(collection_id, collection_name, collection_description, collection_image_url);
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



app.listen(8080, () => {
  console.log('Server is running on port 8080')
  console.log('CORS is enabled for: ', process.env.FRONTEND_URL)
})