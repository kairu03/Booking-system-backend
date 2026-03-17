
import mongoose from "mongoose";

export const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  capacity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  pricingType: {
    type: String,
    required: true,
    enum: [ 'day', 'hourly' ]
  },

  amenities: [{
    type: String,
    trim: true
  }],

  images: [{
    type: String
  }],

  isActive: {
    type: Boolean,
    default: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  }
}, { timestamps: true });

resourceSchema.index({ category: 1 });
resourceSchema.index({ isActive: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;