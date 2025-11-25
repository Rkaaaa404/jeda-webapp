import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings stats.dailyGoal');
    
    res.json({
      success: true,
      data: {
        ...user.settings.toObject(),
        dailyGoal: user.stats.dailyGoal
      }
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
    const { workDuration, shortBreak, minSessionDuration, dailyGoal } = req.body;
    
    const user = await User.findById(req.user._id);
    // Validation rules:
    // - workDuration and shortBreak must be positive integers
    // - shortBreak cannot exceed workDuration
    // - (workDuration + shortBreak) must be at least 5 minutes
    // - minSessionDuration remains fixed (not user adjustable here)

    if (workDuration !== undefined) {
      if (!Number.isInteger(workDuration) || workDuration < 1 || workDuration > 300) {
        return res.status(400).json({
          success: false,
          message: 'Invalid workDuration. Must be an integer between 1 and 300.'
        });
      }
    }
    if (shortBreak !== undefined) {
      if (!Number.isInteger(shortBreak) || shortBreak < 1 || shortBreak > 120) {
        return res.status(400).json({
          success: false,
          message: 'Invalid shortBreak. Must be an integer between 1 and 120.'
        });
      }
    }

    const newWork = workDuration !== undefined ? workDuration : user.settings.workDuration;
    const newBreak = shortBreak !== undefined ? shortBreak : user.settings.shortBreak;

    if (newBreak > newWork) {
      return res.status(400).json({
        success: false,
        message: 'Break duration cannot be greater than work duration.'
      });
    }
    if ((newWork + newBreak) < 5) {
      return res.status(400).json({
        success: false,
        message: 'Combined work + break duration must be at least 5 minutes.'
      });
    }
    
    if (workDuration !== undefined) user.settings.workDuration = workDuration;
    if (shortBreak !== undefined) user.settings.shortBreak = shortBreak;
    if (minSessionDuration !== undefined) user.settings.minSessionDuration = minSessionDuration;
    if (dailyGoal !== undefined) user.stats.dailyGoal = dailyGoal;

    // Ensure minimum session duration does not exceed planned work duration
    if (user.settings.minSessionDuration > user.settings.workDuration) {
      user.settings.minSessionDuration = user.settings.workDuration;
    }
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        ...user.settings.toObject(),
        dailyGoal: user.stats.dailyGoal
      }
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
