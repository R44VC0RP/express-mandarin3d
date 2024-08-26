require('dotenv').config({ path: '.env.local' });
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

// MongoDB connection string - replace with your actual connection string
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for the 'files' collection
const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
  // Add more fields as needed
});

// Create a model based on the schema
const File = mongoose.model('files', fileSchema);

// User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.get('/test', (req, res) => {
      res.send({"status": "success", "message": "Hello from our test route!"})
})

app.listen(8080, () => {
      console.log('Server is running on port 8080')
})