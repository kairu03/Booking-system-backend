import mongoose from "mongoose";

export const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  resource: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Resource'
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: [ 'pending', 'approved', 'cancelled', 'rejected' ],
    default: 'pending'
  }
}, { timestamps: true });

bookingSchema.index({ resource: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;