import { useState } from "react";
import {
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";

const AgentDashboard = () => {
  const [activePage, setActivePage] =
    useState("dashboard");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const DashboardContent = () => (
    <>
      <h1
        style={{
          color: "white",
          marginBottom: "10px",
        }}
      >
        Agent Dashboard
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "25px",
        }}
      >
        Manage tickets, customers and AI-assisted support.
      </p>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Assigned Tickets"
          value="12"
          icon={<FaTicketAlt />}
        />

        <StatCard
          title="Open Tickets"
          value="7"
          icon={<FaClock />}
        />

        <StatCard
          title="Resolved Today"
          value="8"
          icon={<FaCheckCircle />}
        />

        <StatCard
          title="SLA Alerts"
          value="2"
          icon={<FaExclamationTriangle />}
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        {/* Tickets Table */}
        <div className="agent-card">
          <h3>
            Recent Assigned Tickets
          </h3>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              color: "white",
            }}
          >
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>T001</td>
                <td>Nikhil</td>
                <td>High</td>
                <td>Open</td>
              </tr>

              <tr>
                <td>T002</td>
                <td>Rajat</td>
                <td>Medium</td>
                <td>In Progress</td>
              </tr>

              <tr>
                <td>T003</td>
                <td>Shyamal</td>
                <td>Low</td>
                <td>Resolved</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Suggestions */}
        <div className="agent-card">
          <h3>
            <FaRobot />
            {" "}AI Suggestions
          </h3>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <p>
              Department:
              <strong>
                {" "}Billing
              </strong>
            </p>

            <p>
              Priority:
              <strong>
                {" "}High
              </strong>
            </p>

            <p>
              Sentiment:
              <strong>
                {" "}Neutral
              </strong>
            </p>

            <p>
              Confidence:
              <strong>
                {" "}95%
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <div className="agent-card">
          <h3>
            SLA Monitor
          </h3>

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
          <h3>
            Performance Overview
          </h3>

          <p>
            Tickets Resolved:
            35
          </p>

          <p>
            Average Response:
            12 min
          </p>

          <p>
            Customer Satisfaction:
            92%
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#0f172a",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background:
            "#111827",
          padding: "25px",
          borderRight:
            "1px solid #1e293b",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "35px",
          }}
        >
          Agent Panel
        </h2>

        <SidebarItem
          text="Dashboard"
          icon="🏠"
          active={
            activePage ===
            "dashboard"
          }
          onClick={() =>
            setActivePage(
              "dashboard"
            )
          }
        />

        <SidebarItem
          text="Assigned Tickets"
          icon="🎫"
          onClick={() =>
            setActivePage(
              "assigned"
            )
          }
        />

        <SidebarItem
          text="Open Tickets"
          icon="📂"
          onClick={() =>
            setActivePage(
              "open"
            )
          }
        />

        <SidebarItem
          text="AI Suggestions"
          icon="🤖"
          onClick={() =>
            setActivePage(
              "ai"
            )
          }
        />

        <SidebarItem
          text="Messages"
          icon="💬"
          onClick={() =>
            setActivePage(
              "messages"
            )
          }
        />

        <SidebarItem
          text="Performance"
          icon="📊"
          onClick={() =>
            setActivePage(
              "performance"
            )
          }
        />

        <SidebarItem
          text="Profile"
          icon="👤"
          onClick={() =>
            setActivePage(
              "profile"
            )
          }
        />

        <button
          onClick={logout}
          style={{
            width: "100%",
            marginTop: "40px",
            background:
              "#ef4444",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "12px",
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
        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "20px",
            color: "white",
          }}
        >
          Welcome Back Agent 👋
        </div>

        <DashboardContent />
      </div>
    </div>
  );
};

const SidebarItem = ({
  text,
  icon,
  active,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      padding: "14px",
      marginBottom: "10px",
      borderRadius: "12px",
      cursor: "pointer",
      color: "white",
      background: active
        ? "#2563eb"
        : "transparent",
    }}
  >
    {icon} {text}
  </div>
);

const StatCard = ({
  title,
  value,
  icon,
}) => (
  <div className="agent-card">
    <div
      style={{
        fontSize: "28px",
        marginBottom: "10px",
      }}
    >
      {icon}
    </div>

    <h2>{value}</h2>

    <p>{title}</p>
  </div>
);

export default AgentDashboard;