import mongoose from 'mongoose';

const EstimateSchema = new mongoose.Schema({
  name:         { type: String },
  phone:        { type: String },
  roomType:     { type: String },
  size:         { type: Number },
  quality:      { type: String },
  city:         { type: String },
  workTypes:    [{ type: String }],
  estimateLow:  { type: Number },
  estimateHigh: { type: Number },
  createdAt:    { type: Date, default: Date.now },
});

export default mongoose.models.EstimateRequest ||
  mongoose.model('EstimateRequest', EstimateSchema);