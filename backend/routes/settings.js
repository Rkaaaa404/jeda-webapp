import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    
    res.json({
      success: true,
      data: user.settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { workDuration, shortBreak, minSessionDuration } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (workDuration !== undefined) user.settings.workDuration = workDuration;
    if (shortBreak !== undefined) user.settings.shortBreak = shortBreak;
    if (minSessionDuration !== undefined) user.settings.minSessionDuration = minSessionDuration;
    
    await user.save();
    
    res.json({
      success: true,
      data: user.settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;
