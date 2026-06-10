import React, {
  useState,
  useEffect,
} from "react";
import { FaUserTie, FaTicketAlt, FaPlus } from "react-icons/fa";
import api from "../services/api";
const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [newAgent, setNewAgent] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    status: "Online",
  });
  useEffect(() => {
  fetchAgents();
}, []);

const fetchAgents = async () => {
  try {
    const response =
      await api.get("/api/agents");

    setAgents(response.data);
  } catch (error) {
    console.log(error);
  }
};
const handleAddAgent =
  async () => {
    if (
      !newAgent.name ||
      !newAgent.department ||
      !newAgent.email
    ) {
      alert(
        "Please fill all required fields"
      );
      return;
    }

    try {
      await api.post(
        "/api/agents",
        {
          ...newAgent,
          tickets: 0,
          experience: "New",
          resolutionRate: "0%",
        }
      );

      fetchAgents();

      setNewAgent({
        name: "",
        department: "",
        email: "",
        phone: "",
        status: "Online",
      });

      setShowModal(false);

    } catch (error) {
      console.log(error);

      alert(
        "Failed to add agent"
      );
    }
  };

  

    
  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          marginBottom: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
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

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus />
          Add Agent
        </button>
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
  <strong>Workload:</strong>{" "}
  {agent.tickets <= 2
    ? "🟢 Low"
    : agent.tickets <= 5
    ? "🟡 Medium"
    : "🔴 High"}
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

      {showModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Agent</h2>

            <input
              type="text"
              placeholder="Agent Name"
              value={newAgent.name}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Department"
              value={newAgent.department}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  department: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newAgent.email}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  email: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={newAgent.phone}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  phone: e.target.value,
                })
              }
            />

            <select
              value={newAgent.status}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  status: e.target.value,
                })
              }
            >
              <option>Online</option>
              <option>Busy</option>
            </select>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className="contact-agent-btn"
                onClick={handleAddAgent}
              >
                Save Agent
              </button>

              <button
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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