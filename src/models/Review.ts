import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
