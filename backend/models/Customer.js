const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    profileImage: {
  type: String,
  default: "",
},
phone: {
  type: String,
  default: "",
},

    totalTickets: {
      type: Number,
      default: 0,
    },

    openTickets: {
      type: Number,
      default: 0,
    },

    resolvedTickets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Customer",
  CustomerSchema
);