import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Item from '../models/Item.js';

const router = express.Router();

// @route   GET /api/shop/items
// @desc    Get all available shop items
// @access  Private
router.get('/items', protect, async (req, res) => {
  try {
    const items = await Item.find().sort({ cost: 1 });
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/shop/purchase/:itemId
// @desc    Purchase an item with gold
// @access  Private
router.post('/purchase/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    const user = await User.findById(req.user._id);

    // Check if user already owns this item
    if (user.inventory.includes(item._id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already own this item' 
      });
    }

    // Check if user has enough gold
    if (user.gold < item.cost) {
      return res.status(400).json({ 
        success: false, 
        message: `Not enough gold! Need ${item.cost}g, you have ${user.gold}g` 
      });
    }

    // Process purchase
    user.gold -= item.cost;
    user.inventory.push(item._id);
    
    // Auto-equip if it's a theme
    if (item.type === 'theme') {
      user.equippedTheme = item.themeId;
    }

    await user.save();

    res.json({
      success: true,
      message: `You purchased ${item.name}!`,
      data: {
        item,
        remainingGold: user.gold,
        equippedTheme: user.equippedTheme
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

// @route   PUT /api/shop/equip/:itemId
// @desc    Equip a purchased theme
// @access  Private
router.put('/equip/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    if (item.type !== 'theme') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only themes can be equipped' 
      });
    }

    const user = await User.findById(req.user._id);

    // Check if user owns this item
    if (!user.inventory.includes(item._id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not own this item' 
      });
    }

    user.equippedTheme = item.themeId;
    await user.save();

    res.json({
      success: true,
      message: `${item.name} theme equipped!`,
      data: {
        equippedTheme: user.equippedTheme
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

// @route   GET /api/shop/inventory
// @desc    Get user's inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('inventory');
    
    res.json({
      success: true,
      data: {
        inventory: user.inventory,
        equippedTheme: user.equippedTheme,
        gold: user.gold
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
