import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

const router = express.Router();

// @route   GET /api/leaderboard/streak
// @desc    Get top users by current streak
// @access  Private
router.get('/streak', protect, async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('username stats.currentStreak stats.longestStreak')
      .sort({ 'stats.currentStreak': -1 })
      .limit(10);

    res.json({
      success: true,
      data: topUsers.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        isCurrentUser: user._id.toString() === req.user._id.toString()
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/sessions
// @desc    Get top users by session count (with time filter)
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const { range = 'all' } = req.query;

    // Calculate date range
    let startDate;
    const now = new Date();

    switch (range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'all':
      default:
        startDate = null;
        break;
    }

    // Build aggregation pipeline
    const matchStage = {
      status: 'COMPLETED'
    };

    if (startDate) {
      matchStage.startTime = { $gte: startDate };
    }

    const leaderboard = await Session.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          sessionCount: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { totalDuration: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          sessionCount: 1,
          totalDuration: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: leaderboard.map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        sessionCount: entry.sessionCount,
        totalDuration: entry.totalDuration,
        isCurrentUser: entry.userId.toString() === req.user._id.toString()
      })),
      range
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
