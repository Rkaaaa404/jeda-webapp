import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task'
    // Optional - can be null for free focus sessions
  },
  
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  endTime: { 
    type: Date 
  },
  duration: { 
    type: Number, 
    default: 0 
  }, // Minutes
  
  status: { 
    type: String, 
    enum: ['ONGOING', 'COMPLETED'], 
    default: 'ONGOING' 
  }
}, {
  timestamps: true
});

export default mongoose.model('Session', SessionSchema);
