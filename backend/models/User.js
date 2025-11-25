import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  password: { 
    type: String, 
    required: true 
  },
  // RPG Hero System
  heroClass: {
    type: String,
    enum: ['Mage', 'Warrior', 'Rogue', 'Healer'],
    default: 'Warrior'
  },
  level: {
    type: Number,
    default: 1
  },
  currentXP: {
    type: Number,
    default: 0
  },
  maxXP: {
    type: Number,
    default: 100
  },
  gold: {
    type: Number,
    default: 0
  },
  inventory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  equippedTheme: {
    type: String,
    default: 'default'
  },
  // Legacy Stats (Keep for streak system)
  stats: {
    currentStreak: { 
      type: Number, 
      default: 0 
    },
    longestStreak: { 
      type: Number, 
      default: 0 
    },
    lastEvidenceDate: { 
      type: Date 
    },
    dailyGoal: { 
      type: Number, 
      default: 4 
    },
    totalSessions: { 
      type: Number, 
      default: 0 
    },
    mostSessionsInDay: {
      type: Number,
      default: 0
    }
  },
  settings: {
    workDuration: {
      type: Number,
      default: 25 // minutes
    },
    shortBreak: {
      type: Number,
      default: 5 // minutes
    },
    minSessionDuration: {
      type: Number,
      default: 5 // minimum minutes before allowing end session
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);
