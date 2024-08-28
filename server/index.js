import dotenv from 'dotenv';
import {
  createRouteHandler
} from "uploadthing/express";
import uploadRouter from "./uploadthing.js";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config({
  path: '.env.local'
});

const app = express();

app.use(cors());
app.use(express.json());

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

const File = mongoose.model('File', fileSchema);
const User = mongoose.model('User', userSchema);

// Functions for usermanagement

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

// Uploadthing routes

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      apiUrl: "/api/uploadthing",
    },
  }),
);


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