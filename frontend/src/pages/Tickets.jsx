import React, {
  useEffect,
  useState,
} from "react";
import api from "../services/api";;
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(
  "http://localhost:5000"
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
      } catch (
        error
      ) {
        console.log(
          error
        );

        toast.error(
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
          ticket.customerName
  .toLowerCase()
  .includes(
    debouncedSearch.toLowerCase()
  ) ||
ticket.issue
  .toLowerCase()
  .includes(
    debouncedSearch.toLowerCase()
  );

        const matchesStatus =
          statusFilter ===
            "All" ||
          ticket.status ===
            statusFilter;

        const matchesPriority =
          priorityFilter ===
            "All" ||
          ticket.priority ===
            priorityFilter;

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
        <h1
          style={{
            color:
              "#0d47a1",
          }}
        >
          Tickets
        </h1>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }
          style={{
            background:
              "#1976d2",
            color:
              "white",
            border:
              "none",
            padding:
              "12px 20px",
            borderRadius:
              "10px",
            cursor:
              "pointer",
          }}
        >
          + Create Ticket
        </button>
      </div>

      {/* ANALYTICS */}
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap:
            "15px",
          marginBottom:
            "20px",
        }}
      >
        {[
          [
            "Total",
            totalTickets,
          ],
          [
            "Open",
            openTickets,
          ],
          [
            "Resolved",
            resolvedTickets,
          ],
          [
            "High Priority",
            highPriorityTickets,
          ],
        ].map(
          (
            item,
            index
          ) => (
            <div
              key={index}
              style={{
                background:
                  "white",
                padding:
                  "20px",
                borderRadius:
                  "15px",
              }}
            >
              <h4>
                {item[0]}
              </h4>

              <h2>
                {item[1]}
              </h2>
            </div>
          )
        )}
      </div>

      {/* SEARCH FILTER */}
      <div
        style={{
          display:
            "flex",
          gap: "10px",
          marginBottom:
            "20px",
          flexWrap:
            "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search customer or issue..."
          value={
            searchTerm
          }
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />

        <select
          value={
            statusFilter
          }
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option>
            All
          </option>
          <option>
            Open
          </option>
          <option>
            In Progress
          </option>
          <option>
            Resolved
          </option>
          <option>
            Closed
          </option>
        </select>

        <select
          value={
            priorityFilter
          }
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
            )
          }
        >
          <option>
            All
          </option>
          <option>
            High
          </option>
          <option>
            Medium
          </option>
          <option>
            Low
          </option>
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
              key={
                ticket._id
              }
              onClick={() =>
                setSelectedTicket(
                  ticket
                )
              }
              style={{
                background:
                  "white",
                padding:
                  "20px",
                borderRadius:
                  "18px",
                cursor:
                  "pointer",
              }}
            >
              <h2>
                {
                  ticket.customerName
                }
              </h2>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {
                  ticket.email
                }
              </p>

              <p>
                <strong>
                  Issue:
                </strong>{" "}
                {
                  ticket.issue
                }
              </p>

              <p>
                <strong>
                  Priority:
                </strong>{" "}
                {
                  ticket.priority
                }
              </p>

              <div>
                <strong>
                  Status:
                </strong>

                <select
                  value={
                    ticket.status
                  }
                  onClick={(
                    e
                  ) =>
                    e.stopPropagation()
                  }
                  onChange={(
                    e
                  ) =>
                    updateStatus(
                      ticket._id,
                      e.target
                        .value
                    )
                  }
                >
                  <option>
                    Open
                  </option>
                  <option>
                    In Progress
                  </option>
                  <option>
                    Resolved
                  </option>
                  <option>
                    Closed
                  </option>
                </select>
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
      {selectedTicket && (
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
                selectedTicket.customerName
              }
            </p>

            <p>
              <strong>
                Issue:
              </strong>{" "}
              {
                selectedTicket.issue
              }
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {
                selectedTicket.status
              }
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
                ?.department}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {selectedTicket
                ?.assignedAgent
                ?.email}
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
                      {new Date(
                        log.timestamp
                      ).toLocaleString()}
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
                conversation.message
              }
            </div>

            <div
              className="message-time"
            >
              {new Date(
                conversation.timestamp
              ).toLocaleTimeString()}
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
      )}
    </div>
  );
};

export default Tickets;