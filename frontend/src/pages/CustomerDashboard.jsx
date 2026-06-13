import { useState } from "react";
import {
  FaTicketAlt,
  FaPlusCircle,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const [activePage, setActivePage] =
    useState("dashboard");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
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
            color: "white",
            marginBottom: "35px",
          }}
        >
          Customer Portal
        </h2>

        <SidebarItem
          text="Dashboard"
          icon="🏠"
          active={activePage === "dashboard"}
          onClick={() =>
            setActivePage("dashboard")
          }
        />

        <SidebarItem
          text="Create Ticket"
          icon="➕"
          onClick={() =>
            setActivePage("create")
          }
        />

        <SidebarItem
          text="My Tickets"
          icon="🎫"
          onClick={() =>
            setActivePage("tickets")
          }
        />

        <SidebarItem
          text="Messages"
          icon="💬"
          onClick={() =>
            setActivePage("messages")
          }
        />

        <SidebarItem
          text="Profile"
          icon="👤"
          onClick={() =>
            setActivePage("profile")
          }
        />

        <button
          onClick={logout}
          style={{
            width: "100%",
            marginTop: "40px",
            background: "#ef4444",
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
            background: "#111827",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "20px",
            color: "white",
          }}
        >
          Welcome Back 👋
        </div>

        <h1
          style={{
            color: "white",
          }}
        >
          Customer Dashboard
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "25px",
          }}
        >
          Create and track support tickets.
        </p>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <StatCard
            title="Total Tickets"
            value="15"
            icon={<FaTicketAlt />}
          />

          <StatCard
            title="Open Tickets"
            value="4"
            icon={<FaClock />}
          />

          <StatCard
            title="Resolved"
            value="9"
            icon={<FaCheckCircle />}
          />

          <StatCard
            title="Messages"
            value="6"
            icon={<FaComments />}
          />
        </div>

        {/* Ticket Table */}
        <div
          className="agent-card"
          style={{
            marginTop: "25px",
          }}
        >
          <h3>Recent Tickets</h3>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              color: "white",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>T001</td>
                <td>Payment Failed</td>
                <td>High</td>
                <td>Open</td>
              </tr>

              <tr>
                <td>T002</td>
                <td>Login Issue</td>
                <td>Medium</td>
                <td>Resolved</td>
              </tr>

              <tr>
                <td>T003</td>
                <td>Account Update</td>
                <td>Low</td>
                <td>In Progress</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div className="agent-card">
            <h3>Create New Ticket</h3>

            <p>
              Submit a new support request.
            </p>

            <button
              style={{
                marginTop: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <FaPlusCircle />
              {" "}Create Ticket
            </button>
          </div>

          <div className="agent-card">
            <h3>Profile Summary</h3>

            <p>Name: Customer</p>
            <p>Email: customer@gmail.com</p>
            <p>Tickets Raised: 15</p>
          </div>
        </div>
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

export default CustomerDashboard;