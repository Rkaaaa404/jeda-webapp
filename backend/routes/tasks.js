import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import upload from '../config/multer.js';
import { awardRewards, getRandomMonster } from '../utils/rpgLogic.js';

const router = express.Router();

// Helper function to check and update streak
const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEvidence = user.stats.lastEvidenceDate 
    ? new Date(user.stats.lastEvidenceDate) 
    : null;
  
  if (lastEvidence) {
    lastEvidence.setHours(0, 0, 0, 0);
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Calculate streak
  if (!lastEvidence) {
    // First evidence ever
    user.stats.currentStreak = 1;
    user.stats.longestStreak = Math.max(1, user.stats.longestStreak);
  } else if (lastEvidence.getTime() === today.getTime()) {
    // Already uploaded today - no change to streak
    return user;
  } else if (lastEvidence.getTime() === yesterday.getTime()) {
    // Consecutive day - increment streak
    user.stats.currentStreak += 1;
    user.stats.longestStreak = Math.max(user.stats.currentStreak, user.stats.longestStreak);
  } else {
    // Streak broken - reset to 1
    user.stats.currentStreak = 1;
  }

  user.stats.lastEvidenceDate = new Date();
  await user.save();
  return user;
};

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, estimatedSessions, difficulty } = req.body;

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    const questDifficulty = difficulty || 'Medium';
    const task = await Task.create({
      userId: req.user._id,
      title,
      estimatedSessions: estimatedSessions || 1,
      difficulty: questDifficulty,
      monsterType: getRandomMonster(questDifficulty)
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/tasks/:id/complete
// @desc    Complete task with evidence upload
// @access  Private
router.put('/:id/complete', protect, upload.single('evidence'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Verify evidence was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Evidence image is required' 
      });
    }

    // Update task
    task.status = 'DONE';
    task.evidenceImage = `/uploads/${req.file.filename}`;
    task.completedAt = new Date();
    await task.save();

    // Update streak
    const updatedUser = await updateStreak(req.user._id);

    // Calculate total session time for this task
    const Session = (await import('../models/Session.js')).default;
    const taskSessions = await Session.find({
      taskId: task._id,
      status: 'COMPLETED'
    });
    const totalSessionMinutes = taskSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Award RPG Rewards (XP & Gold) based on total session time
    const rewardResult = await awardRewards(updatedUser, totalSessionMinutes, task.difficulty);

    res.json({
      success: true,
      message: `Quest Completed! You defeated the ${task.monsterType}!`,
      data: {
        task,
        stats: updatedUser.stats,
        rpgRewards: {
          xpGained: rewardResult.rewards.xp,
          goldGained: rewardResult.rewards.gold,
          leveledUp: rewardResult.leveledUp,
          levelsGained: rewardResult.levelsGained,
          newLevel: rewardResult.newLevel,
          currentStats: rewardResult.currentStats
        }
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

// @route   PUT /api/tasks/:id
// @desc    Update task (for status changes like starting work)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Update allowed fields
    if (req.body.status && req.body.status !== 'DONE') {
      task.status = req.body.status;
    }
    if (req.body.title) {
      task.title = req.body.title;
    }
    if (req.body.estimatedSessions) {
      task.estimatedSessions = req.body.estimatedSessions;
    }

    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted'
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
