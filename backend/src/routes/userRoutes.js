import { Router } from 'express';
import { UserModel } from '../models/db.js';
import { getRecommendations } from '../services/recommendService.js';
import { generateNotifications } from '../services/notificationService.js';

const router = Router();

// POST /api/users/register
router.post('/register', (req, res) => {
  try {
    const { name, phone, email, profile } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and phone number are required' 
      });
    }

    // Check if user already exists
    const existing = UserModel.findByPhone(phone);
    if (existing) {
      return res.json({ success: true, user: existing, message: 'Welcome back!' });
    }

    const user = UserModel.create({ name, phone, email, profile: profile || {} });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/login (simplified - phone based)
router.post('/login', (req, res) => {
  try {
    const { phone } = req.body;
    const user = UserModel.findByPhone(phone);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found. Please register first.' 
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', (req, res) => {
  try {
    const { userId, ...updates } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }

    const user = UserModel.update(userId, updates);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/notifications
router.get('/notifications', (req, res) => {
  try {
    const { userId } = req.query;
    
    // If no user, generate general notifications
    const allSchemes = getRecommendations({});
    const notifications = generateNotifications(allSchemes.slice(0, 20), {});

    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
