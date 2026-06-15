import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";


function Sidebar({ activePage, setActivePage }) {
  const [showContactModal, setShowContactModal] =
  useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="sidebar enterprise-sidebar">
      {/* Logo */}
      <div className="logo-section">
        <div className="logo-mark">
          <FaHeadset />
        </div>

        <div>
          <h2>SupportDesk</h2>
          <p>Support Operations</p>
        </div>
      </div>

      {/* Menu */}
      <ul className="menu">
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
          <span className="tooltip">
            View dashboard insights and ticket overview.
          </span>
        </li>

        <li
          className={activePage === "tickets" ? "active" : ""}
          onClick={() => setActivePage("tickets")}
        >
          <FaTicketAlt />
          <span>Tickets</span>
          <span className="menu-count">24</span>
          <span className="tooltip">View all customer support tickets.</span>
        </li>

        <li
          className={activePage === "customers" ? "active" : ""}
          onClick={() => setActivePage("customers")}
        >
          <FaUsers />
          <span>Customers</span>
          <span className="tooltip">Manage customers and subscriptions.</span>
        </li>

        <li
          className={activePage === "agents" ? "active" : ""}
          onClick={() => setActivePage("agents")}
        >
          <FaUserTie />
          <span>Agents</span>
          <span className="tooltip">View support agent performance.</span>
        </li>

        <li
          className={activePage === "analytics" ? "active" : ""}
          onClick={() => setActivePage("analytics")}
        >
          <FaChartBar />
          <span>Analytics</span>
          <span className="tooltip">View ticket analytics and reports.</span>
        </li>
      </ul>

      {/* Quick Actions */}


      {/* Help Card */}
      <div className="help-card">
        <div className="help-card-label">Support lead</div>

        <div className="agent-info">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="agent"
          />

          <div>
            <h4>Rahul Verma</h4>
            <p>Senior Support Agent</p>
          </div>
        </div>

        <p>
          Available for escalation review, queue health, and urgent ticket
          assistance.
        </p>

        <button
  className="contact-btn"
  onClick={() =>
    setShowContactModal(true)
  }
>
  Contact Agent
</button>
      </div>
      {showContactModal && (
  <div className="contact-popup">
    <div className="contact-popup-header">
      <h3>Support Lead</h3>

      <button
        className="close-popup-btn"
        onClick={() =>
          setShowContactModal(false)
        }
      >
        ✕
      </button>
    </div>

    <div className="contact-popup-body">
      <p><strong>👤 Name:</strong> Rahul Verma</p>

      <p><strong>🧑‍💼 Role:</strong> Senior Support Agent</p>

      <p><strong>📧 Email:</strong> rahul@supportdesk.com</p>

      <p><strong>📞 Phone:</strong> +91 9876543210</p>

      <p><strong>🏢 Department:</strong> Technical Support</p>

      <p><strong>🟢 Status:</strong> Online</p>
    </div>
  </div>
)}
      

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;