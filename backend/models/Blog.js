import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  lastEditedBy: { type: String },
  isLocked: { type: Boolean, default: false },
  lockedBy: { type: String, default: null },
  lockedAt: { type: Date, default: null },
});

export default mongoose.model('Blog', blogSchema);
