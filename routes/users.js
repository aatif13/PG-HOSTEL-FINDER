const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// Get all users
router.get('/', (req, res) => {
  const users = userModel.getAllUsers();
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = userModel.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Create new user
router.post('/', (req, res) => {
  const newUser = userModel.createUser(req.body);
  res.status(201).json(newUser);
});

// Update user
router.put('/:id', (req, res) => {
  const updatedUser = userModel.updateUser(req.params.id, req.body);
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  const deletedUser = userModel.deleteUser(req.params.id);
  if (deletedUser) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = userModel.getUserByEmail(email);
  
  if (user && user.password === password) {
    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get roommate matches for a user
router.get('/:id/matches', (req, res) => {
  const matches = userModel.findMatches(req.params.id);
  res.json(matches);
});

// Calculate match score between two users
router.get('/:id1/match/:id2', (req, res) => {
  const score = userModel.calculateMatchScore(req.params.id1, req.params.id2);
  res.json({ matchScore: score });
});

module.exports = router;
