import React, { useState } from "react";
import { FaUserTie, FaTicketAlt } from "react-icons/fa";

const agents = [
  {
    name: "Rahul Verma",
    department: "Technical",
    status: "Online",
    tickets: 12,
    email: "rahul@supportdesk.com",
    experience: "5 Years",
    resolutionRate: "96%",
    phone: "+91 9876543210",
  },
  {
    name: "Priya Sharma",
    department: "Billing",
    status: "Busy",
    tickets: 8,
    email: "priya@supportdesk.com",
    experience: "4 Years",
    resolutionRate: "92%",
    phone: "+91 9876543211",
  },
  {
    name: "Amit Kumar",
    department: "Support",
    status: "Online",
    tickets: 15,
    email: "amit@supportdesk.com",
    experience: "6 Years",
    resolutionRate: "98%",
    phone: "+91 9876543212",
  },
];

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ marginBottom: "35px" }}>
        <span
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Support Operations
        </span>

        <h1
          style={{
            color: "#111827",
            fontSize: "42px",
            fontWeight: "700",
            marginTop: "10px",
          }}
        >
          Support Agents
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "10px",
          }}
        >
          Monitor agent availability, workload and performance.
        </p>
      </div>

      <div className="agents-grid">
        {agents.map((agent, index) => (
          <div key={index} className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                <FaUserTie />
              </div>

              <div>
                <h2>{agent.name}</h2>

                <span
                  className={
                    agent.status === "Online"
                      ? "status-online"
                      : "status-busy"
                  }
                >
                  ● {agent.status}
                </span>
              </div>
            </div>

            <div className="agent-info">
              <p>
                <strong>Department:</strong>{" "}
                {agent.department}
              </p>

              <p>
                <FaTicketAlt
                  style={{
                    marginRight: "8px",
                  }}
                />
                <strong>Assigned Tickets:</strong>{" "}
                {agent.tickets}
              </p>
            </div>

            <button
              className="contact-agent-btn"
              onClick={() => setSelectedAgent(agent)}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div
          className="profile-modal-overlay"
          onClick={() => setSelectedAgent(null)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedAgent(null)}
            >
              ✕
            </button>

            <div className="profile-header">
              <div className="profile-avatar">
                <FaUserTie />
              </div>

              <div>
                <h2>{selectedAgent.name}</h2>
                <p>
                  {selectedAgent.department} Department
                </p>
              </div>
            </div>

            <div className="profile-details">
              <p>
                <strong>Status:</strong>{" "}
                {selectedAgent.status}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedAgent.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedAgent.phone}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {selectedAgent.experience}
              </p>

              <p>
                <strong>Assigned Tickets:</strong>{" "}
                {selectedAgent.tickets}
              </p>

              <p>
                <strong>Resolution Rate:</strong>{" "}
                {selectedAgent.resolutionRate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;