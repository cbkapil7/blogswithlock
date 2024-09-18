import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Auth from '../Auth/Auth.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
   
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    user = new User({
      username,
      password, 
    });

    await user.save();

   
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
     
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ token, username: user.username });
    } catch (err) {
      console.error('Login error:', err); 
      res.status(500).json({ message: 'Server error' });
    }
  });
  


router.get('/getUserInfo', Auth, (req, res) => {
  const { username } = req.user;
  res.json({ username });
});

router.get('/verify', Auth, (req, res) => {
 
  res.status(200).json({ message: 'Token is valid' });
});

export default router;
