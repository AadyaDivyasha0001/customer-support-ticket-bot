const mongoose =
  require("mongoose");

const ticketSchema =
  new mongoose.Schema(
    {
      customerName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      issue: {
        type: String,
        required: true,
      },

      title: String,

description: String,

      priority: {
        type: String,
        default: "Medium",
      },

      category: {
        type: String,
        default: "General Support",
      },

      aiSummary: {
        type: String,
        default: "",
      },

      aiSuggestedReply: {
        type: String,
        default: "",
      },
      aiConfidence: {
  type: String,
  default: "",
},
 department: {
  type: String,
  default: "Support",
},

customerSentiment: {
  type: String,
  default: "Neutral",
},

      status: {
        type: String,
        default: "Open",
      },

      messages: [
  {
    sender: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
],

feedback: String,

rating: Number,
      

      assignedAgent: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        default: null,
      },

      slaDeadline: {
  type: Date,
},

isEscalated: {
  type: Boolean,
  default: false,
},

      // ACTIVITY TIMELINE
      activityLogs: [
        {
          message: {
            type: String,
          },

          timestamp: {
            type: Date,
            default:
              Date.now,
          },
        },
      ],

      // CONVERSATION HISTORY
      conversationHistory: [
        {
          sender: {
            type: String,
          },

          message: {
            type: String,
          },

          timestamp: {
            type: Date,
            default:
              Date.now,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Ticket",
    ticketSchema
  );