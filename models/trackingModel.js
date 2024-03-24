

const mongoose = require('mongoose');

const shippingTrackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId,
     required: true },
  trackingNumber: { type: String, 
    required: true },
  carrier: { type: String,
     required: true },
  status: { type: String,
     // Possible values: Pending, In Transit, Delivered, etc.
     default: 'Pending' },
  lastUpdated: { type: Date, default: Date.now },
});

const ShippingTracking = mongoose.model('ShippingTracking', shippingTrackingSchema);

module.exports = ShippingTracking;
