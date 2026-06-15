import React, {
  useEffect,
  useState,
} from "react";
import api from "../services/api";;
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(
  "https://customer-support-ticket-bot.onrender.com"
);

const Tickets = () => {
  const [tickets, setTickets] =
    useState([]);
    const [
  aiReply,
  setAiReply,
] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    selectedTicket,
    setSelectedTicket,
  ] = useState(null);
  const [replyMessage,
  setReplyMessage] =
  useState("");

  const [searchTerm,
    setSearchTerm] =
    useState("");
    const [
  debouncedSearch,
  setDebouncedSearch,
] = useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [formData, setFormData] =
    useState({
      customerName: "",
      email: "",
      issue: "",
      priority:
        "Medium",
      status:
        "Open",
    });

  useEffect(() => {
    fetchTickets();
    const generateAIReply =
  async () => {
    try {
      const response =
        await api.post(
          "/ai/generate-reply",
          {
            issue:
              selectedTicket.issue,
          }
        );

      setReplyMessage(
        response.data.reply
      );

      toast.success(
        "AI Reply Generated"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to generate AI reply"
      );
    }
  };

    socket.on(
      "ticketCreated",
      (newTicket) => {
        setTickets(
          (prevTickets) => [
            newTicket,
            ...prevTickets,
          ]
        );

        toast.success(
          `🎫 New Ticket: ${newTicket.customerName}`
          
        );
      }
    );

    socket.on(
      "ticketUpdated",
      (
        updatedTicket
      ) => {
        setTickets(
          (
            prevTickets
          ) =>
            prevTickets.map(
              (
                ticket
              ) =>
                ticket._id ===
                updatedTicket._id
                  ? updatedTicket
                  : ticket
            )
        );

        toast.info(
          `Status Updated → ${updatedTicket.status}`
        );
      }
    );

    return () => {
      socket.off(
        "ticketCreated"
      );

      socket.off(
        "ticketUpdated"
      );
    };
  }, []);
 useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);

    console.log(
      "Debounced Search:",
      searchTerm,
      new Date().toLocaleTimeString()
    );
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);


  const fetchTickets =
    async () => {
      try {
        const response =
  await api.get(
    "/tickets"
  );

        setTickets(
          response.data
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const createTicket =
    async () => {
      // VALIDATIONS

    if (
      formData.customerName
        .trim()
        .length < 3
    ) {
      toast.error(
        "Customer name must be at least 3 characters"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email
      )
    ) {
      toast.error(
        "Enter a valid email"
      );
      return;
    }

    if (
      formData.issue
        .trim()
        .length < 10
    ) {
      toast.error(
        "Issue must be at least 10 characters"
      );
      return;
    }
      try {
        await api.post(
  "/tickets",
  formData
);
          
          


        

        toast.success(
          "Ticket Created"
        );

        setShowModal(
          false
        );

        setFormData({
          customerName:
            "",
          email: "",
          issue: "",
          priority:
            "Medium",
          status:
            "Open",
        });
      } catch (error) {

  console.log(error);

  toast.error(
    error.response?.data?.message ||
    "Failed to create ticket"
  );
}
    };

  const updateStatus =
    async (
      ticketId,
      newStatus
    ) => {
      try {
        await api.put(
  `/tickets/${ticketId}`,
  {
    status:
      newStatus,
  }
);
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };
   const sendReply =
  async () => {
    try {

      if (
        !replyMessage.trim()
      ) {
        return;
      }

      await api.post(
        `/tickets/${selectedTicket._id}/reply`,
        {
          sender:
            "Agent",

          message:
            replyMessage,
        }
      );

      const response =
        await api.get(
          "/tickets"
        );

      setTickets(
        response.data
      );

      const updatedTicket =
        response.data.find(
          (
            ticket
          ) =>
            ticket._id ===
            selectedTicket._id
        );

      setSelectedTicket(
        updatedTicket
      );

      setReplyMessage(
        ""
      );

      toast.success(
        "Reply Sent"
      );

    } catch (
      error
    ) {
      console.log(
        error
      );

      toast.error(
        "Failed to send reply"
      );
    }
  };

  // FILTERS
  const filteredTickets =
  tickets.filter(
    (ticket) => {
      const matchesSearch =
        (ticket.customerName || "")
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          ) ||

        (ticket.issue || "")
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    }
  );
  // ANALYTICS
  const totalTickets =
    tickets.length;

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "Open"
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "Resolved"
    ).length;

  const highPriorityTickets =
    tickets.filter(
      (ticket) =>
        ticket.priority ===
        "High"
    ).length;

  return (
    <div
      style={{
        padding:
          "30px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "20px",
        }}
      >
        <div className="tickets-header">
  <div>
    <span className="page-label">
      SUPPORT OPERATIONS
    </span>

    <h1>Tickets Management</h1>

    <p>
      Monitor, manage and resolve customer support requests.
    </p>
  </div>
</div>
</div>
       

        

      {/* ANALYTICS */}
      <div className="tickets-stats-grid">

  <div className="ticket-stat-card">
    <h4>Total Tickets</h4>
    <h2>{totalTickets}</h2>
  </div>

  <div className="ticket-stat-card open">
    <h4>Open Tickets</h4>
    <h2>{openTickets}</h2>
  </div>

  <div className="ticket-stat-card resolved">
    <h4>Resolved</h4>
    <h2>{resolvedTickets}</h2>
  </div>

  <div className="ticket-stat-card high">
    <h4>High Priority</h4>
    <h2>{highPriorityTickets}</h2>
  </div>

</div>

      {/* SEARCH FILTER */}
      <div className="tickets-toolbar">

  <input
    type="text"
    placeholder="Search customer or issue..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    className="search-input"
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="filter-select"
  >
    <option>All</option>
    <option>Open</option>
    <option>In Progress</option>
    <option>Resolved</option>
    <option>Closed</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) =>
      setPriorityFilter(e.target.value)
    }
    className="filter-select"
  >
    <option>All</option>
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>

</div>
      {/* TICKETS */}
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap:
            "20px",
        }}
      >
        {filteredTickets.map(
          (
            ticket
          ) => (
            <div
  key={ticket._id}
  className="modern-ticket-card"
  onClick={() =>
    setSelectedTicket(ticket)
  }
>
  <div className="ticket-top">

    <h2>
      {ticket.customerName}
    </h2>

    <span
      className={`priority-badge ${ticket.priority.toLowerCase()}`}
    >
      {ticket.priority}
    </span>

  </div>

  <p className="ticket-email">
    {ticket.email}
  </p>

  <div className="ticket-issue">
    {ticket.issue}
  </div>

  <div className="ticket-footer">

    <select
      value={ticket.status}
      onClick={(e) =>
        e.stopPropagation()
      }
      onChange={(e) =>
        updateStatus(
          ticket._id,
          e.target.value
        )
      }
    >
      <option>Open</option>
      <option>In Progress</option>
      <option>Resolved</option>
      <option>Closed</option>
    </select>

    <button
      className="view-ticket-btn"
    >
      View Details
    </button>

  </div>
</div>
            
          )
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div>
          <div
            style={{
              background:
                "white",
              padding:
                "20px",
              marginTop:
                "20px",
              borderRadius:
                "15px",
            }}
          >
            <input
              name="customerName"
              placeholder="Customer Name"
              value={
                formData.customerName
              }
              onChange={
                handleChange
              }
            />

            <input
              name="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />
            <input
  name="issue"
  placeholder="Issue"
  value={formData.issue}
  onChange={handleChange}
/>

<select
  name="priority"
  value={formData.priority}
  onChange={handleChange}
>
  <option value="Low">
    Low
  </option>

  <option value="Medium">
    Medium
  </option>

  <option value="High">
    High
  </option>
</select>

<button
  onClick={createTicket}
>
  Submit
</button>

            
             
          </div>
        </div>
      )}  
      

      {/* DETAILS MODAL */}
      {selectedTicket ? ( 
        <div
          onClick={() =>
            setSelectedTicket(
              null
            )
          }
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              background:
                "white",
              padding:
                "25px",
              borderRadius:
                "15px",
              marginTop:
                "20px",
            }}
          >
            <h2>
              Ticket
              Details
            </h2>

            <p>
              <strong>
                Customer:
              </strong>{" "}
              {
                  selectedTicket?.customerName ||
    "N/A"
              }
            </p>

            <p>
              <strong>
                Issue:
              </strong>{" "}
              {
                
          selectedTicket?.issue ||
           "N/A"
}
              
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {
                selectedTicket.status || "Unknown"
              }
            </p>
            <p>
  <strong>Sentiment:</strong>{" "}
  {selectedTicket?.customerSentiment || "Neutral"}
</p>

            <hr />

            <h3>
              👨‍💼 Worker
              Assigned
            </h3>

            <p>
              <strong>
                Name:
              </strong>{" "}
              {selectedTicket
                ?.assignedAgent
                ?.name ||
                "Unassigned"}
            </p>

            <p>
              <strong>
                Department:
              </strong>{" "}
              {selectedTicket
                ?.assignedAgent
                ?.department || "N/A"}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {selectedTicket
                ?.assignedAgent
                ?.email || "N/A"
        }
            </p>

            <hr />

            <h3>
              Activity
              Timeline
            </h3>

            {selectedTicket
              ?.activityLogs
              ?.length >
            0 ? (
              selectedTicket.activityLogs.map(
                (
                  log,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                  >
                    <strong>
                      {
                        log.message
                      }
                    </strong>

                    <br />

                    <small>
                      {log?.timestamp
  ? new Date(
      log.timestamp
    ).toLocaleString()
  : "Unknown Time"}
                    </small>
                  </div>
                )
              )
            ) : (
              <p>
                No activity
                yet
              </p>
            )}
            <hr />
          <div className="chat-container">

  <div className="chat-header">
    <div>
      <h3>
        💬 Customer Support Chat
      </h3>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        Online
      </p>
    </div>
  </div>

  <div className="chat-body">

    {selectedTicket
      ?.conversationHistory
      ?.length > 0 ? (

      selectedTicket.conversationHistory.map(
        (
          conversation,
          index
        ) => (

          <div
            key={index}
            className={
              conversation.sender ===
              "Agent"
                ? "agent-message"
                : "customer-message"
            }
          >

            <div>
              {
                conversation.message ||"Empty Message"
              }
            </div>

            <div
              className="message-time"
            >
              {conversation?.timestamp
  ? new Date(
      conversation.timestamp
    ).toLocaleTimeString()
  : "--:--" }
            </div>

          </div>
        )
      )

    ) : (

      <div
        style={{
          color: "#94a3b8",
          textAlign:
            "center",
          marginTop:
            "50px",
        }}
      >
        No conversation
        history
      </div>

    )}

  </div>

  <div className="chat-footer">

    <input
      type="text"
      value={
        replyMessage
      }
      onChange={(e) =>
        setReplyMessage(
          e.target.value
        )
      }
      placeholder="Type a message..."
    />

    <button
      onClick={
        sendReply
      }
    >
      Send
    </button>
   

  </div>

</div>

          </div>
        </div>
            ) : (
        <p>
          Ticket data unavailable
        </p>
      )}
    </div>
  );
};

export default Tickets;