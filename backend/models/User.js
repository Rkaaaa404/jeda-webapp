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
    longBreak: {
      type: Number,
      default: 15 // minutes
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
