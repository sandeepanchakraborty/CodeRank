const express = require('express');
const router = express.Router();

// Mock user database (in a real app, use a proper database)
const users = [
  { id: 1, username: 'demo', email: 'demo@example.com', password: 'demo123', score: 0 }
];
let nextUserId = 2;

// Register
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = {
      id: nextUserId++,
      username,
      email,
      password, // In a real app, hash the password
      score: 0
    };
    
    users.push(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, score: newUser.score }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email, score: user.score }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  // In a real app, verify JWT token and get user from database
  res.json({ message: 'Auth endpoint working' });
});

module.exports = router;