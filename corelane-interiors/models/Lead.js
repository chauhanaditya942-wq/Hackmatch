import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  email:    { type: String },
  message:  { type: String },
  source:   { type: String, default: 'Contact Form' },
  status:   { type: String, default: 'New' },
  createdAt:{ type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);