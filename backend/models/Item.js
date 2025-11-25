import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['cosmetic', 'theme'],
    default: 'theme'
  },
  themeId: {
    type: String,
    unique: true,
    sparse: true
  },
  assetUrl: {
    type: String
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Item', ItemSchema);
