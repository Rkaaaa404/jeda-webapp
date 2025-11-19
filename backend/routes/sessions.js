import express from 'express';
import { protect } from '../middleware/auth.js';
import Session from '../models/Session.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/sessions/start
// @desc    Start a new session
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { taskId, source = 'WEB' } = req.body;

    // Check if user already has an active session
    const activeSession = await Session.findOne({
      userId: req.user._id,
      status: 'ONGOING'
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active session'
      });
    }

    // If taskId provided, verify it exists and belongs to user
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      // Update task status to IN_PROGRESS if it's TODO
      if (task.status === 'TODO') {
        task.status = 'IN_PROGRESS';
        await task.save();
      }
    }

    // Create new session
    const session = await Session.create({
      userId: req.user._id,
      taskId: taskId || null,
      source,
      startTime: new Date(),
      status: 'ONGOING'
    });

    const populatedSession = await Session.findById(session._id).populate('taskId', 'title');

    res.status(201).json({
      success: true,
      data: populatedSession
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/sessions/stop
// @desc    Stop active session
// @access  Private
router.post('/stop', protect, async (req, res) => {
  try {
    // Find active session
    const session = await Session.findOne({
      userId: req.user._id,
      status: 'ONGOING'
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'No active session found'
      });
    }

    // Get user settings for minimum duration
    const user = await User.findById(req.user._id);
    const minDurationMinutes = user.settings?.minSessionDuration || 5;

    // Calculate elapsed time in minutes
    const elapsedMinutes = Math.floor((new Date() - new Date(session.startTime)) / (1000 * 60));

    // Enforce minimum duration
    if (elapsedMinutes < minDurationMinutes) {
      return res.status(400).json({
        success: false,
        message: `Session must be at least ${minDurationMinutes} minutes. Current: ${elapsedMinutes} minutes.`,
        remainingMinutes: minDurationMinutes - elapsedMinutes
      });
    }

    // Update session
    session.endTime = new Date();
    session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60)); // Minutes
    session.status = 'COMPLETED';
    await session.save();

    // Update task progress if linked to a task
    if (session.taskId) {
      const task = await Task.findById(session.taskId);
      if (task) {
        task.completedSessions += 1;
        await task.save();
      }
    }

    // Update user's total session count
    user.stats.totalSessions += 1;
    await user.save();

    const populatedSession = await Session.findById(session._id).populate('taskId', 'title');

    res.json({
      success: true,
      data: {
        session: populatedSession,
        stats: user.stats
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

// @route   GET /api/sessions/active
// @desc    Get active session
// @access  Private
router.get('/active', protect, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.user._id,
      status: 'ONGOING'
    }).populate('taskId', 'title');

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sessions
// @desc    Get user's session history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const sessions = await Session.find({
      userId: req.user._id,
      status: 'COMPLETED'
    })
      .populate('taskId', 'title')
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Session.countDocuments({
      userId: req.user._id,
      status: 'COMPLETED'
    });

    res.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
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
