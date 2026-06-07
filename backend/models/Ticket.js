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

      priority: {
        type: String,
        default: "Medium",
      },

      status: {
        type: String,
        default: "Open",
      },

      // ASSIGNED SUPPORT AGENT
      assignedAgent: {
        name: {
          type: String,
          default:
            "Unassigned",
        },

        department: {
          type: String,
          default:
            "Support",
        },

        email: {
          type: String,
          default:
            "supportdesk@email.com",
        },
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