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

  const sendEmail =
  require("../utils/sendEmail");
  console.log("sendEmail:", sendEmail);

const router =
  express.Router();

  const Agent =
  require("../models/Agent");

  const Customer =
  require("../models/Customer");



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
    "Critical"
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
      // AUTO ASSIGN AGENT FROM DATABASE

const issueText =
  issue.toLowerCase();


/* PRIORITY PREDICTION */
console.log("EMAIL:", email);
console.log("ISSUE:", issue);

const existingTicket = await Ticket.findOne({
  email,
  issue,
  status: { $ne: "Resolved" },
});

console.log("EXISTING:", existingTicket);


if (existingTicket) {
  return res.status(400).json({
    message:
      "Similar ticket already exists",
  });
}



      const newTicket =
  new Ticket({
    ...req.body,
    category: "Pending AI Analysis",

     department:
      "Pending AI Analysis",

    priority:
       priority,

    assignedAgent: null,
    activityLogs: [
      {
        message:
          "Ticket Created",

        timestamp:
          new Date(),
      },

      {
        message: "Waiting for AI assignment",

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
const savedTicket = await newTicket.save();

// SEND SUCCESS TO FRONTEND IMMEDIATELY
res.status(201).json(savedTicket);

// CUSTOMER UPDATE
try {
  let customer = await Customer.findOne({ email });

  if (customer) {
    customer.totalTickets += 1;

    if (savedTicket.status === "Open") {
      customer.openTickets += 1;
    }

    if (savedTicket.status === "Resolved") {
      customer.resolvedTickets += 1;
    }

    await customer.save();
  } else {
    await Customer.create({
      customerName,
      email,
      totalTickets: 1,
      openTickets:
        savedTicket.status === "Open" ? 1 : 0,
      resolvedTickets:
        savedTicket.status === "Resolved" ? 1 : 0,
    });
  }
} catch (err) {
  console.log("CUSTOMER UPDATE ERROR:", err);
}

// SOCKET EVENTS
try {
  const io = req.app.get("io");

  io.emit("ticketCreated", savedTicket);

  io.emit("newNotification", {
    message: `🎫 New Ticket Created - ${savedTicket.customerName}`,
  });
} catch (err) {
  console.log("SOCKET ERROR:", err);
}

// EMAIL
sendEmail(
  savedTicket.email,
  "Ticket Created Successfully",
  `Hello ${savedTicket.customerName},

Your support ticket has been created successfully.

Issue:
${savedTicket.issue}

Priority:
${savedTicket.priority}

Current Status:
${savedTicket.status}

Support Team`
).catch((err) => {
  console.log("EMAIL ERROR:", err);
});

// N8N WEBHOOK
(async () => {
  try {
    console.log("Sending webhook to n8n...");

    const response = await axios.post(
      "https://n8n-workflow-wquh.onrender.com/webhook-test/ticket-created",
      {
        _id: savedTicket._id,
        customerName: savedTicket.customerName,
        email: savedTicket.email,
        issue: savedTicket.issue,
        priority: savedTicket.priority,
      }
    );

    console.log("N8N RESPONSE:", response.data);
  } catch (err) {
    console.log(
      "N8N ERROR:",
      err.response?.data || err.message
    );
  }
})();
 
    res.status(201).json(savedTicket);

} catch (error) {
  res.status(500).json({
    message: error.message,
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
  await Ticket.find()
    .populate(
      "assignedAgent"
    );
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
// UPDATE TICKET STATUS
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

const populatedTicket =
  await Ticket.findById(
    ticket._id
  ).populate(
    "assignedAgent"
  );

const io =
  req.app.get("io");

io.emit(
  "ticketUpdated",
  populatedTicket
);

res.json(
  populatedTicket
);


     
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);
router.put(
  "/:id/ai-analysis",
  async (req, res) => {
    try {
        let slaHours = 24;

if (req.body.priority === "Low")
  slaHours = 72;

if (req.body.priority === "Medium")
  slaHours = 24;

if (req.body.priority === "High")
  slaHours = 8;

if (req.body.priority === "Critical")
  slaHours = 2;

const slaDeadline =
  new Date(
    Date.now() +
      slaHours *
      60 *
      60 *
      1000
  );
      const ticket =
        await Ticket.findByIdAndUpdate(
          req.params.id,
          {
            
  category:
    req.body.category ||
    "General",

  department:
    req.body.department ||
    "Support",

  priority:
    req.body.priority ||
    "Medium",

  customerSentiment:
    req.body.sentiment ||
    "Neutral",

  aiSummary:
    req.body.summary ||
    "AI summary unavailable",

  aiSuggestedReply:
    req.body.suggestedReply ||
    "Thank you for contacting support. We will review your issue shortly.",

  aiConfidence:
    req.body.confidence ||
    "0",

  slaDeadline:
    slaDeadline,
},
        
        { new: true }
        );
    

      res.json(ticket);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
router.put(
  "/:id/assign-agent",
  async (req, res) => {
    try {

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      const agent =
        await Agent.findOne({
          department:
            ticket.department,
        }).sort({
          tickets: 1,
        });

      // NO AGENT FOUND
      if (!agent) {

        ticket.activityLogs.push({
          message:
            "No suitable agent found",
          timestamp:
            new Date(),
        });

        await ticket.save();
        

        return res.json(ticket);
      }

      // ASSIGN AGENT
      ticket.assignedAgent =
        agent._id;

      agent.tickets += 1;

      await agent.save();
      ticket.activityLogs.push({
  message: `Assigned to ${agent.name}`,
  timestamp: new Date(),
});

await ticket.save();


      await sendEmail(
  ticket.email,

  "Agent Assigned",

  `Hello ${ticket.customerName},

Your ticket has been assigned.

Agent:
${agent.name}

Department:
${agent.department}

We are reviewing your issue.

Support Team`
);

      ticket.activityLogs.push({
        message:
          `Assigned to ${agent.name}`,
        timestamp:
          new Date(),
      });

      await ticket.save();

      res.json(ticket);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);
  router.put("/check-sla", async (req, res) => {
  console.log("CHECK SLA ROUTE HIT");

  const totalTickets = await Ticket.countDocuments();

console.log("TOTAL TICKETS:", totalTickets);

const sampleTicket = await Ticket.findOne();

console.log("SAMPLE TICKET:", sampleTicket);
   const slaTest = await Ticket.findOne({
    customerName: "SLA Test User",
  });

  console.log("SLA TEST:", slaTest);

  console.log("NOW:", new Date());

  const overdueTickets = await Ticket.find({
    status: { $ne: "Resolved" },
    slaDeadline: { $lt: new Date() },
    isEscalated: false,
  });

  console.log(
    "Overdue tickets:",
    overdueTickets.map(t => ({
      id: t._id,
      status: t.status,
      isEscalated: t.isEscalated,
      slaDeadline: t.slaDeadline,
    }))
  );

for (const ticket of overdueTickets) {

  ticket.isEscalated = true;

  ticket.status = "Escalated";

  ticket.activityLogs.push({
    message:
      "Ticket escalated due to SLA breach",
    timestamp:
      new Date(),
  });

  await ticket.save();

  await sendEmail(
    ticket.email,

    "SLA Escalation Alert",

    `Hello ${ticket.customerName},

Your support ticket has been escalated due to SLA breach.

Issue:
${ticket.issue}

Current Status:
Escalated

Support Team`
  );

  }

  res.json({
    escalated: overdueTickets.length,
  });
});
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
       const ticket =
  await Ticket.findById(req.params.id);

if (!ticket) {
  return res.status(404).json({
    message: "Ticket not found",
  });
}

const oldStatus =
  ticket.status;

const updatedTicket =
  await Ticket.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,

            $push: {
              activityLogs: {
                message: `Status changed to ${req.body.status}`,
                timestamp:
                  new Date(),
              },

              conversationHistory: {
                sender:
                  "System",

                message: `Ticket status changed to ${req.body.status}`,

                timestamp:
                  new Date(),
              },
            },
          },
          {
            new: true,
            runValidators:
              false,
          }
        ).populate(
          "assignedAgent"
        );
        if (
  req.body.status ===
  "Resolved" &&
  updatedTicket.assignedAgent
) {
  await Agent.findByIdAndUpdate(
    updatedTicket.assignedAgent,
    {
      $inc: {
        tickets: -1,
      },
    }
  );
}

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

io.emit(
  "newNotification",
  {
    message: `✅ Ticket ${updatedTicket.status} - ${updatedTicket.customerName}`,
  }
);
if (
  oldStatus !==
  updatedTicket.status
) {
    console.log("ABOUT TO SEND EMAIL");
console.log(typeof sendEmail);
  await sendEmail(
    updatedTicket.email,

    "Ticket Status Updated",

    `Hello ${updatedTicket.customerName},

Your support ticket has been updated.

Issue:
${updatedTicket.issue}

Previous Status:
${oldStatus}

Current Status:
${updatedTicket.status}

Thank you,
Support Team`
  );
}
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
   
module.exports =
  router;