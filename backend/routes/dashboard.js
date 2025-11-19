import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Session from '../models/Session.js';

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard data for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get user stats
    const user = await User.findById(req.user._id).select('username stats');

    // Get active task (IN_PROGRESS)
    const activeTask = await Task.findOne({
      userId: req.user._id,
      status: 'IN_PROGRESS'
    }).sort({ updatedAt: -1 });

    // Get active session
    const activeSession = await Session.findOne({
      userId: req.user._id,
      status: 'ONGOING'
    }).populate('taskId', 'title');

    // Get today's progress
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todaySessions = await Session.countDocuments({
      userId: req.user._id,
      status: 'COMPLETED',
      startTime: { $gte: todayStart }
    });

    // Check streak status (Pending vs Active)
    const lastEvidence = user.stats.lastEvidenceDate 
      ? new Date(user.stats.lastEvidenceDate)
      : null;
    
    let streakStatus = 'INACTIVE'; // ⚪ (no activity or broken)
    
    if (lastEvidence) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const evidenceDate = new Date(lastEvidence);
      evidenceDate.setHours(0, 0, 0, 0);
      
      if (evidenceDate.getTime() === today.getTime()) {
        streakStatus = 'ACTIVE'; // 🔥 (uploaded evidence today)
      } else if (todaySessions > 0) {
        streakStatus = 'PENDING'; // ⚪ (active today but no evidence yet)
      }
    } else if (todaySessions > 0) {
      streakStatus = 'PENDING';
    }

    // Get recent tasks
    const recentTasks = await Task.find({
      userId: req.user._id
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          stats: user.stats
        },
        activeTask,
        activeSession,
        todayProgress: {
          sessionsCompleted: todaySessions,
          dailyGoal: user.stats.dailyGoal,
          percentage: Math.min(100, Math.round((todaySessions / user.stats.dailyGoal) * 100))
        },
        streakStatus,
        recentTasks
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
