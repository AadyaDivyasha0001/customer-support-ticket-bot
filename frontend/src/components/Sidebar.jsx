import {
  FaTachometerAlt,
  FaTicketAlt,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaSignOutAlt,
  FaHeadset,
  FaPlus,
} from "react-icons/fa";

function Sidebar({ activePage, setActivePage }) {
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
<div className="quick-actions">
  <h4>Quick Actions</h4>

  <button
    onClick={() => setActivePage("tickets")}
  >
    <FaPlus />
    Create Ticket
  </button>

  <button
    onClick={() => setActivePage("customers")}
  >
    <FaPlus />
    Add Customer
  </button>

  <button
    onClick={() => setActivePage("agents")}
  >
    <FaPlus />
    Add Agent
  </button>
</div>

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

        <button className="contact-btn">Contact Agent</button>
      </div>

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;