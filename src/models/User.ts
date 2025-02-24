import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  birthDate: {
    type: Date,
    default: null,
  },
  isOnboardingCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  categories: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: null,
  },
  contact: {
    phone: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isWorker: {
    type: Boolean,
    default: false,
  },
  documents: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
