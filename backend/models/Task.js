import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
    default: 'TODO' 
  },
  
  // Planning vs Actual
  estimatedSessions: { 
    type: Number, 
    default: 1,
    min: 1
  },
  completedSessions: { 
    type: Number, 
    default: 0 
  },
  
  // Evidence (Required for DONE status)
  evidenceImage: { 
    type: String 
  },
  completedAt: { 
    type: Date 
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', TaskSchema);
