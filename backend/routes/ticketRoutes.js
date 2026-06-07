const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );
const Ticket =
  require("../models/Ticket");

const express =
  require("express");

const axios =
  require("axios");

const router =
  express.Router();


// CREATE TICKET
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
        const {
  customerName,
  email,
  issue,
  priority,
} = req.body;

// CUSTOMER NAME
if (
  !customerName ||
  customerName.trim()
    .length < 3
) {
  return res
    .status(400)
    .json({
      message:
        "Customer name must be at least 3 characters",
    });
}

// EMAIL
const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !emailRegex.test(
    email
  )
) {
  return res
    .status(400)
    .json({
      message:
        "Invalid email address",
    });
}

// ISSUE
if (
  !issue ||
  issue.trim()
    .length < 10
) {
  return res
    .status(400)
    .json({
      message:
        "Issue description must be at least 10 characters",
    });
}

// PRIORITY
if (
  ![
    "Low",
    "Medium",
    "High",
  ].includes(
    priority
  )
) {
  return res
    .status(400)
    .json({
      message:
        "Invalid priority selected",
    });
}
      // AUTO ASSIGN AGENT
      let assignedAgent =
        {
          name:
            "Support Team",

          department:
            "General Support",

          email:
            "support@company.com",
        };

      

      // SMART ASSIGNMENT
      if (
        issue.includes(
          "payment"
        )
      ) {
        assignedAgent =
          {
            name:
              "Rahul Verma",

            department:
              "Payments Team",

            email:
              "rahul@supportdesk.com",
          };
      } else if (
        issue.includes(
          "login"
        ) ||
        issue.includes(
          "password"
        )
      ) {
        assignedAgent =
          {
            name:
              "Priya Sharma",

            department:
              "Authentication Team",

            email:
              "priya@supportdesk.com",
          };
      } else if (
        issue.includes(
          "refund"
        )
      ) {
        assignedAgent =
          {
            name:
              "Amit Kumar",

            department:
              "Refund Team",

            email:
              "amit@supportdesk.com",
          };
      } else if (
        issue.includes(
          "bug"
        ) ||
        issue.includes(
          "technical"
        )
      ) {
        assignedAgent =
          {
            name:
              "Suresh Patel",

            department:
              "Technical Team",

            email:
              "suresh@supportdesk.com",
          };
      }
      const newTicket =
  new Ticket({
    ...req.body,

    assignedAgent,

    activityLogs: [
      {
        message:
          "Ticket Created",

        timestamp:
          new Date(),
      },

      {
        message: `Assigned to ${assignedAgent.name}`,

        timestamp:
          new Date(),
      },
    ],

    conversationHistory: [
      {
        sender:
          "Customer",

        message:
          req.body.issue,

        timestamp:
          new Date(),
      },
    ],
  });

     
               

              

      const savedTicket =
        await newTicket.save();

      // SOCKET.IO EVENT
      const io =
        req.app.get(
          "io"
        );

      io.emit(
        "ticketCreated",
        savedTicket
      );

      // SEND TO N8N
      try {
        await axios.post(
          "http://localhost:5678/webhook/ticket-created",
          {
            customerName:
              savedTicket.customerName,

            email:
              savedTicket.email,

            issue:
              savedTicket.issue,

            priority:
              savedTicket.priority,
          }
        );
      } catch (
        webhookError
      ) {
        console.log(
          "n8n webhook error:",
          webhookError.message
        );
      }

      res.status(201).json(
        savedTicket
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);


// GET ALL TICKETS
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const tickets =
        await Ticket.find();

      res.status(200).json(
        tickets
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);


// UPDATE TICKET STATUS
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedTicket =
        await Ticket.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,

           $push: {
  activityLogs: {
    message: `Status changed to ${req.body.status}`,
    timestamp: new Date(),
  },

  conversationHistory: {
    sender: "System",
    message: `Ticket status changed to ${req.body.status}`,
    timestamp: new Date(),
  },
},
          },
          {
            new: true,
            runValidators:
              false,
          }
        );

      if (
        !updatedTicket
      ) {
        return res
          .status(404)
          .json({
            message:
              "Ticket not found",
          });
      }

      const io =
        req.app.get(
          "io"
        );

      console.log(
        "Emitting socket update..."
      );

      io.emit(
        "ticketUpdated",
        updatedTicket
      );

      res.status(200).json(
        updatedTicket
      );
    } catch (error) {
      console.log(
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);
// ADD REPLY TO CONVERSATION
router.post(
  "/:id/reply",
  async (req, res) => {
    try {
      const { sender, message } =
        req.body;

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      if (!ticket) {
        return res
          .status(404)
          .json({
            message:
              "Ticket not found",
          });
      }

      ticket.conversationHistory.push(
        {
          sender,
          message,
          timestamp:
            new Date(),
        }
      );

      await ticket.save();
      const io = req.app.get("io");

io.emit(
  "ticketUpdated",
  ticket
);


      res.json(ticket);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports =
  router;