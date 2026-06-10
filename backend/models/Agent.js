const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    status: {
      type: String,
      default: "Online",
    },

    tickets: {
      type: Number,
      default: 0,
    },

    experience: {
      type: String,
      default: "New",
    },

    resolutionRate: {
      type: String,
      default: "0%",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Agent",
  AgentSchema
);