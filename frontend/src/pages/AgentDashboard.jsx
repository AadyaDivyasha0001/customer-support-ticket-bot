import {
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot,
  FaComments,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const AgentDashboard = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#111827",
          padding: "25px",
          borderRight: "1px solid #1e293b",
        }}
      >
        <h2
          style={{
            marginBottom: "40px",
          }}
        >
          Agent Panel
        </h2>

        <div className="menu-item">
          🏠 Dashboard
        </div>

        <div className="menu-item">
          🎫 Assigned Tickets
        </div>

        <div className="menu-item">
          📂 Open Tickets
        </div>

        <div className="menu-item">
          🤖 AI Suggestions
        </div>

        <div className="menu-item">
          💬 Messages
        </div>

        <div className="menu-item">
          📊 Performance
        </div>

        <div className="menu-item">
          👤 Profile
        </div>

        <button
          onClick={logout}
          style={{
            width: "100%",
            marginTop: "40px",
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt />
          {" "}Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1>Agent Dashboard</h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Manage assigned tickets and customer communication.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <StatCard
            icon={<FaTicketAlt />}
            title="Assigned Tickets"
            value="12"
          />

          <StatCard
            icon={<FaClock />}
            title="Open Tickets"
            value="7"
          />

          <StatCard
            icon={<FaCheckCircle />}
            title="Resolved Today"
            value="8"
          />

          <StatCard
            icon={<FaExclamationTriangle />}
            title="SLA Alerts"
            value="2"
          />
        </div>

        {/* Sections */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Tickets */}
          <div className="agent-card">
            <h3>
              Assigned Tickets
            </h3>

            <table
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>T001</td>
                  <td>Nikhil</td>
                  <td>Open</td>
                </tr>

                <tr>
                  <td>T002</td>
                  <td>Rajat</td>
                  <td>In Progress</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Panel */}
          <div className="agent-card">
            <h3>
              <FaRobot />
              {" "}AI Suggestions
            </h3>

            <p
              style={{
                marginTop: "15px",
              }}
            >
              Suggested Department:
              Billing
            </p>

            <p>
              Suggested Priority:
              High
            </p>

            <p>
              Confidence:
              95%
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div className="agent-card">
            <h3>SLA Monitor</h3>

            <p>
              ⚠ Ticket #T004
              - 2 Hours Left
            </p>

            <p>
              ⚠ Ticket #T009
              - 45 Minutes Left
            </p>
          </div>

          <div className="agent-card">
            <h3>Performance</h3>

            <p>
              Tickets Resolved:
              35
            </p>

            <p>
              Avg Response:
              12 min
            </p>

            <p>
              Satisfaction:
              92%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}) => (
  <div
    className="agent-card"
  >
    <div
      style={{
        fontSize: "28px",
        marginBottom: "10px",
      }}
    >
      {icon}
    </div>

    <h3>{value}</h3>

    <p>{title}</p>
  </div>
);

export default AgentDashboard;