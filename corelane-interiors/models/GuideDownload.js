import mongoose from 'mongoose';

const GuideDownloadSchema = new mongoose.Schema({
  name:      { type: String },
  email:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GuideDownload ||
  mongoose.model('GuideDownload', GuideDownloadSchema);