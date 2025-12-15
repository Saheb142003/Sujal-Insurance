const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  vehicleNo: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Policy", PolicySchema);
