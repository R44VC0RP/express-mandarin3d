import dotenv from 'dotenv';
import { createUploadthing, createRouteHandler } from "uploadthing/express";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';

dotenv.config({
  path: '.env.local'
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// MongoDB connection string - replace with your actual connection string
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const fileSchema = new mongoose.Schema({
  fileid: String,
  filename: String,
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
  fileurl: String,
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

const Cart = mongoose.model('Cart', cartSchema);
const File = mongoose.model('File', fileSchema);
const User = mongoose.model('User', userSchema);

// #region USER MANAGEMENT

async function addUser(username, password, role, email = "", profilePicture = "") {
  console.log("Adding user: ", username, password, role, email, profilePicture);
  // Check if the username already exists
  const existingUser = await User.findOne({
    username
  });
  if (existingUser) {
    console.log('Username already exists');
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    password: hashedPassword,
    role,
    email,
    profilePicture
  });
  await user.save();
  console.log("User added successfully");
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
  await User.deleteOne({
    username
  });
}

async function updateUser(username, newPassword, newEmail, newProfilePicture) {
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
  await user.save();
  return user;
}

// #endregion USER MANAGEMENT

// #region FILE MANAGEMENT

// Create an UploadThing instance
const f = createUploadthing();

const ourFileRouter = {
  imageUploader: f({ blob: {
    maxFileSize: "128MB",
    maxFileCount: 20
  } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
};

// Create the UploadThing route handler
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: ourFileRouter,
    config: {
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
  })
);

// #endregion FILE MANAGEMENT

// #region CART MANAGEMENT

async function getCart(req) {
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.cart_id) {
    const existingCart = await Cart.findOne().sort({ _id: -1 }).limit(1);
    if (existingCart) {
      req.session.cart_id = existingCart.cart_id;
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

function createCart(req) {
  const cart_id = "cart_" + uuidv4();
  const newCart = new Cart({ cart_id, files: [] });
  newCart.save();
  req.session.cart_id = cart_id;
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
  const result = await addFileToCart(req, fileid);
  res.json(result);
});

app.post('/api/cart/remove', async (req, res) => {
  const { fileid } = req.body;
  const cart = getCart(req);
  cart.files = cart.files.filter(id => id !== fileid);
  await Cart.findOneAndUpdate(
    { cart_id: cart.cart_id },
    { $pull: { files: fileid } }
  );
  res.json({ status: 'success', message: 'File removed from cart successfully' });
});


app.get('/api/cart', async (req, res) => {
  const cart = await getCart(req);
  res.json({ status: 'success', cart_id: cart.cart_id, files: cart.files });
});

app.delete('/api/cart', async (req, res) => {
  req.session.cart_id = null;
  await Cart.findOneAndDelete({ cart_id: req.session.cart_id });
  res.json({ status: 'success', message: 'Cart deleted successfully' });
});

// #endregion CART MANAGEMENT


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
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({
    message: 'No token provided'
  });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({
      message: 'Failed to authenticate token'
    });
    req.userId = decoded.userId;
    next();
  });
};

// #endregion LOGIN AND AUTHENTICATION



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
app.get('/user-data', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
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

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})