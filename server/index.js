import dotenv from 'dotenv';
dotenv.config({ 'path': '.env.local' });
import { createUploadthing, createRouteHandler } from "uploadthing/express";
import { UTApi } from "uploadthing/server";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import stripePackage from 'stripe';

const utapi = new UTApi();



const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// First, ensure your session middleware is set up correctly
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false, // Change this to false
  store: MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  autoRemove: 'interval',
  autoRemoveInterval: 10,// In minutes. Default
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// #region STRIPE

const stripe = stripePackage(process.env.STRIPE_API_KEY);

const createNewProduct = async (file_name, file_id, file_image = "https://cdn.discordapp.com/attachments/1165771547223543990/1279816538295107625/3d_model.jpg?ex=66d5d188&is=66d48008&hm=409c22a2b80eaee0ef74c55020ea84511efd9d050f5acd948180d1ae13ac89ce&") => {
    const product = await stripe.products.create({
        name: file_name || "Untitled",
        images: [file_image],
        metadata: {
            file_id: file_id,
        },
    });
    return product;
}

const deleteProduct = async (product_id) => {
    await stripe.products.del(product_id);
}

// #endregion STRIPE

const fileSchema = new mongoose.Schema({
  fileid: String,
  stripe_product_id: String,
  filename: String,
  file_status: String,
  file_error: String,
  mass_in_grams: {
    type: Number,
    required: false
  },
  dimensions: {
    x: {
      type: Number,
      required: false
    },
    y: {
      type: Number,
      required: false
    },
    z: {
      type: Number,
      required: false
    }
  },
  utfile_id: String, // UploadThing file id
  utfile_url: String, // UploadThing file url
  stripe_product_id: String, // Stripe product id
  price_override: {
    type: Number,
    required: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  }
});

const cartSchema = new mongoose.Schema({
  cart_id: String,
  files: [{
    type: String,
    ref: 'File'
  }]
});

const productSchema = new mongoose.Schema({
  product_id: String,
  product_title: String,
  product_description: String,
  product_features: [String],
  product_image_url: String,
  product_fileid: String,
  product_author: String,
  product_author_url: String,
  product_license: String,
  product_filament_id: String
});

const Cart = mongoose.model('Cart', cartSchema);
const File = mongoose.model('File', fileSchema);
const User = mongoose.model('User', userSchema);

// Config schema
const configSchema = new mongoose.Schema({
  dimensionConfig: {
    x: Number,
    y: Number,
    z: Number,
  },
  // Add more config sections here
});

const Config = mongoose.model('Config', configSchema);



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



// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
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
    req.user = user; // Attach the user object to the request
    next();
  } catch (err) {
    console.log("Failed to authenticate token");
    return res.status(401).json({
      message: 'Failed to authenticate token'
    });
  }
};

// #endregion LOGIN AND AUTHENTICATION

// #region USER MANAGEMENT

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

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    console.log(`User {username: ${req.user?.username}, role: ${req.user?.role}} is not an admin`);
    return res.status(403).json({ status: 'error', message: 'Access denied. Admin only.' });
  }
  next();
};

// Users routes
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ status: 'success', users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

app.post('/api/users', verifyToken, isAdmin, async (req, res) => {
  const { action, userId, username, fullName, password, profilePic } = req.body;

  try {
    switch (action) {
      case 'add':
        if (req.user.username === username) {
          return res.status(400).json({ status: 'error', message: 'Cannot add yourself' });
        }
        await addUser(username, password, 'user', '', profilePic, fullName);
        res.json({ status: 'success', message: 'User added successfully' });
        break;

      case 'edit':
        // if (req.user.id === userId) {
        //   return res.status(400).json({ status: 'error', message: 'Cannot edit your own profile' });
        // }
        await updateUser(username, password, '', profilePic, fullName);
        res.json({ status: 'success', message: 'User updated successfully' });
        break;

      case 'delete':
        if (req.user.id === userId) {
          return res.status(400).json({ status: 'error', message: 'Cannot delete your own profile' });
        }
        await deleteUser(username);
        res.json({ status: 'success', message: 'User deleted successfully' });
        break;

      default:
        res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// #endregion USER MANAGEMENT

// #region FILE MANAGEMENT

const reSliceFile = async (fileid) => {
  const file = await File.findOne({ fileid });
  if (!file) {
    return null;
  }
  file.file_status = "unsliced";
  await file.save();
  sliceFile(fileid);
  return {"status": "success", "message": "File resliced successfully"};
}


const sliceFile = async (fileid) => {
  const file = await File.findOne({ fileid });
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
  return {"status": "success", "message": "File sliced successfully"};
}

const createNewFile = async (filename, utfile_id, utfile_url, price_override = null) => {
  const fileid = "file_" + uuidv4();
  const stripeProduct = await createNewProduct(filename, fileid, utfile_id, utfile_url);
  const newFile = new File({ fileid, stripe_product_id: stripeProduct.id, utfile_id, utfile_url, filename, price_override, file_status: "unsliced" });
  await newFile.save();
  // Post to https://api.mandarin3d.com/v2/api/slice
  console.log("Posting to https://api.mandarin3d.com/v2/api/slice");
  sliceFile(fileid);
  return newFile;
}

const deleteFile = async (fileid) => {
  // this requires a user to be an admin
  const file = await File.findOne({ fileid });
  if (!file) {
    return null;
  }
  const stripeid = file.stripe_product_id;
  const utid = file.utfile_id;
  await File.deleteOne({ fileid });
  await deleteProduct(stripeid);
  await utapi.deleteFiles(utid); // Delete the file from UploadThing
  return file;
}

const getFile = async (fileid) => {
  const file = await File.findOne({ fileid });
  return file;
}

const getAllFiles = async () => {
  const files = await File.find();
  return files;
}

app.post('/api/file', verifyToken, isAdmin, async (req, res) => {
  const { action, fileid, filename, utfile_id, utfile_url, price_override } = req.body;
  let result;
  try {
    switch (action) {
      case 'create':
        result = await createNewFile(filename, utfile_id, utfile_url, price_override);
        break;
      case 'get':
        result = await getFile(fileid);
        break;
      case 'list':
        result = await getAllFiles();
        break;
      case 'slice':
        result = await reSliceFile(fileid);
        break;
      default:
        return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Error handling file action:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.delete('/api/file', verifyToken, isAdmin, async (req, res) => {
  const { fileid } = req.body;
  try {
    const result = await deleteFile(fileid);
    if (result) {
      res.json({ status: 'success', message: 'File deleted successfully' });
    } else {
      res.status(404).json({ status: 'error', message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Create an UploadThing instance
const f = createUploadthing();

const ourFileRouter = {
  modelUploader: f({ "model/stl": {
    maxFileSize: "128MB",
    maxFileCount: 20
  } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded: ", file.name);
      
      const newFile = await createNewFile(file.name, file.key, file.url);
      console.log("File saved: ", newFile.fileid);
      return {
        status: "success",
        message: "File uploaded successfully",
        fileid: newFile.fileid
      }
    }),
    imageUploader: f({ image: {
      maxFileSize: "8MB",
      maxFileCount: 1
    } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded: ", file.name);
    })

};

// Create the UploadThing route handler
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: ourFileRouter,
    config: {
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
      isDev: process.env.NODE_ENV === "dev",
    },
  })
);

// Add this endpoint to get the status of all files
app.get('/api/file-status', async (req, res) => {
  try {
    const files = await File.find();
    res.json({ status: 'success', files });
  } catch (error) {
    console.error('Error fetching file statuses:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// #endregion FILE MANAGEMENT

// #region CART MANAGEMENT


async function getCart(req) {
  if (!req.session) {
    console.error('Session is not initialized');
    return createCart(req);
  }

  if (!req.session.cart_id) {
    const existingCart = await Cart.findOne().sort({ _id: -1 }).limit(1);
    if (existingCart) {
      req.session.cart_id = existingCart.cart_id;
      await req.session.save();
    } else {
      return createCart(req);
    }
  }
  const cart = await Cart.findOne({ cart_id: req.session.cart_id });
  if (!cart) {
    return createCart(req);
  }
  return cart;
}

async function createCart(req) {
  const cart_id = "cart_" + uuidv4();
  const newCart = new Cart({ cart_id, files: [] });
  await newCart.save();
  if (req.session) {
    req.session.cart_id = cart_id;
    await req.session.save();
  }
  console.log("New cart created: ", cart_id);
  return newCart;
}

async function addFileToCart(req, fileid) {
  const cart = await getCart(req);
  console.log("Updating cartid: ", cart.cart_id, " with fileid: ", fileid);
  if (!cart.files.includes(fileid)) {
    cart.files.push(fileid);
    await cart.save();
    console.log("Cart updated successfully");
    return {"status": "success", "message": "File added to cart successfully"};
  }
  return {"status": "error", "message": "File already in cart"};
}

app.post('/api/cart/add', async (req, res) => {
  const { fileid } = req.body;
  if (!fileid) {
    return res.json({ status: 'error', message: 'No fileid provided' });
  }
  const result = await addFileToCart(req, fileid);
  res.json(result);
});

app.post('/api/cart/remove', async (req, res) => {
  const { fileid } = req.body;
  const cart = await getCart(req);
  cart.files = cart.files.filter(id => id !== fileid);
  await Cart.findOneAndUpdate(
    { cart_id: cart.cart_id },
    { $pull: { files: fileid } }
  );
  res.json({ status: 'success', message: 'File removed from cart successfully' });
});

app.get('/api/cart', async (req, res) => {
  const cart = await getCart(req);
  for (const fileid of cart.files) {
    const file = await getFile(fileid);
    if (!file){
      cart.files = cart.files.filter(id => id !== fileid);
      await cart.save();
    }
  }
  res.json({ status: 'success', cart_id: cart.cart_id, files: cart.files });
});

app.delete('/api/cart', async (req, res) => {
  if (req.session.cart_id) {
    await Cart.findOneAndDelete({ cart_id: req.session.cart_id });
    req.session.cart_id = null;
    await req.session.save();
  }
  res.json({ status: 'success', message: 'Cart deleted successfully' });
});

// #endregion CART MANAGEMENT

// #region ADMIN MANAGEMENT

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
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
app.get('/user-role', verifyToken, async (req, res) => {
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
app.get('/user-data', verifyToken, isAdmin, async (req, res) => {
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

const filamentSchema = new mongoose.Schema({
  filament_id: String,
  filament_brand: String,
  filament_name: String,
  filament_color: String,
  filament_unit_price: Number,
  filament_image_url: String,
  filament_mass_in_grams: Number,
  filament_link: String
});

const Filament = mongoose.model('Filament', filamentSchema);

const getFilament = async (filament_id) => {
  const filament = await Filament.findOne({ filament_id });
  return filament;
}

const getFilamentList = async () => {
  const filaments = await Filament.find();
  return filaments;
}

const addFilament = async (filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link) => {
  const filament_id = "filament_" + uuidv4();
  const newFilament = new Filament({ filament_id, filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link });
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
  const { action, filament_id, filament_brand, filament_name, filament_color, filament_unit_price, filament_image_url, filament_mass_in_grams, filament_link } = req.body;
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

const createProduct = async (product_title, product_description, product_features=[], product_image_url, product_fileid, product_author="Mandarin 3D Prints", product_author_url="https://mandarin3d.com", product_license="CC BY-SA 4.0", product_filament_id) => {
  // First, check if the product already exists
  const existingProduct = await Product.findOne({ product_title });
  if (existingProduct) {
    return existingProduct;
  }

  // Make sure the product_fileid and product_filament_id are valid
  const file = await File.findOne({ fileid: product_fileid });
  if (!file) {
    return null;
  }
  const filament = await Filament.findOne({ filament_id: product_filament_id });
  if (!filament) {
    return null;
  }
  const product_id = "product_" + uuidv4();
  const newProduct = new Product({ product_id, product_title, product_description, product_features, product_image_url, product_fileid, product_author, product_author_url, product_license, product_filament_id });
  await newProduct.save();
  return newProduct;
}

// #endregion PRODUCT MANAGEMENT

// #region SETTINGS MANAGEMENT

app.get('/api/configs', verifyToken, isAdmin, async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config || {});
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching configs' });
  }
});

// Update configs
app.post('/api/configs', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedConfig = await Config.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ status: 'success', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating configs' });
  }
});

// #endregion SETTINGS MANAGEMENT



app.listen(8080, () => {
  console.log('Server is running on port 8080')
})