import { useState } from "react";
import axios from "axios";
import {
  FaTicketAlt,
  FaPlusCircle,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaHome,
  FaPlus,
  FaEnvelopeOpenText,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
 const user = JSON.parse(
  localStorage.getItem("user")
);

const customerName =
  user?.name || "";
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const createTicket = async () => {
  try {
    const token =
      localStorage.getItem("token");
      await axios.post(
  "https://customer-support-ticket-bot.onrender.com/tickets",
  {
    customerName,
    email,
    title,
    issue,
    description,
  },

    
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

   toast.success(
  "🎫 Ticket created successfully!"
);

    setCustomerName("");
setTitle("");
setDescription("");

   

    setActivePage("tickets");
  } catch (error) {
  console.log(error);

  alert(
    error.response?.data?.message ||
    error.message
  );
}
};

;

  return (
    <div className="customer-portal-layout">
      {/* Sidebar */}
      <aside className="customer-sidebar">
        <div className="customer-sidebar-brand">
          <div className="customer-sidebar-logo">
            <FaUser />
          </div>

          <div>
            <h2>Customer Portal</h2>
            <p>Support Center</p>
          </div>
        </div>

        <nav className="customer-sidebar-menu">
          <SidebarItem
            text="Dashboard"
            icon={<FaHome />}
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
          />

          <SidebarItem
            text="Create Ticket"
            icon={<FaPlusCircle />}
            active={activePage === "create"}
            onClick={() => setActivePage("create")}
          />

          <SidebarItem
            text="My Tickets"
            icon={<FaTicketAlt />}
            active={activePage === "tickets"}
            onClick={() => setActivePage("tickets")}
          />

          <SidebarItem
            text="Messages"
            icon={<FaComments />}
            active={activePage === "messages"}
            onClick={() => setActivePage("messages")}
          />

          <SidebarItem
            text="Profile"
            icon={<FaUser />}
            active={activePage === "profile"}
            onClick={() => setActivePage("profile")}
          />
        </nav>

        <button onClick={logout} className="customer-logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="customer-main">
        <div className="customer-page-shell">
            {activePage === "create" && (
  <section
    className="customer-card"
    style={{
      marginBottom: "25px",
    }}
  >
    <h2>Create Support Ticket</h2>
     <input
  type="text"
  placeholder="Your Name"
  value={customerName}
  onChange={(e) =>
    setCustomerName(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    marginBottom: "15px",
  }}
/>
    <input
      type="text"
      placeholder="Issue Title"
      value={title}
      onChange={(e) =>
        setTitle(e.target.value)
      }
      style={{
        width: "100%",
        padding: "12px",
        marginTop: "15px",
        marginBottom: "15px",
      }}
    />

    <textarea
      placeholder="Describe your issue"
      value={description}
      onChange={(e) =>
        setDescription(
          e.target.value
        )
      }
      style={{
        width: "100%",
        height: "150px",
        padding: "12px",
        marginBottom: "15px",
      }}
    />
    <button
      className="customer-primary-btn"
      onClick={createTicket}
    >
      Submit Ticket
    </button>
  </section>
)}
          {/* Top Bar */}
          <div className="customer-topbar">
            <div className="customer-search">
              <FaSearch />
              <input type="text" placeholder="Search tickets..." />
            </div>

            <div className="customer-topbar-actions">
              <button
  className="customer-primary-btn"
  onClick={() =>
    setActivePage("create")
  }
>
  <FaPlus />
  Create Ticket
</button>

              <div className="customer-profile-chip">
                <div className="customer-profile-avatar">
                  <FaUser />
                </div>

                <div>
                  <strong>Customer</strong>
                  <span>Portal User</span>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <section className="customer-welcome-banner">
            <div>
              <span className="customer-eyebrow">Support workspace</span>
              <h1>Welcome back 👋</h1>
              <p>
                Create support tickets, track issue progress, and stay updated
                on every conversation with the support team.
              </p>
            </div>

            <button className="customer-light-btn">
              <FaPlusCircle />
              New Request
            </button>
          </section>

          {/* Page Header */}
          <div className="customer-page-header">
            <div>
              <h2>Customer Dashboard</h2>
              <p>Create and track support tickets from one place.</p>
            </div>
          </div>

          {/* Cards */}
          <div className="customer-stats-grid">
            <StatCard
              title="Total Tickets"
              value="15"
              icon={<FaTicketAlt />}
              tone="blue"
              helper="All requests submitted"
            />

            <StatCard
              title="Open Tickets"
              value="4"
              icon={<FaClock />}
              tone="orange"
              helper="Waiting for resolution"
            />

            <StatCard
              title="Resolved"
              value="9"
              icon={<FaCheckCircle />}
              tone="green"
              helper="Successfully completed"
            />

            <StatCard
              title="Messages"
              value="6"
              icon={<FaComments />}
              tone="purple"
              helper="Support conversations"
            />
          </div>

          {/* Ticket Table */}
          <section className="customer-card customer-ticket-card">
            <div className="customer-card-header">
              <div>
                <h3>Recent Tickets</h3>
                <p>Your latest support requests and current status.</p>
              </div>

              <button className="customer-secondary-btn">View All</button>
            </div>

            <div className="customer-table-wrapper">
              <table className="customer-table">
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
                    <td>
                      <strong>T001</strong>
                    </td>
                    <td>Payment Failed</td>
                    <td>
                      <span className="customer-badge danger">High</span>
                    </td>
                    <td>
                      <span className="customer-badge open">Open</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>T002</strong>
                    </td>
                    <td>Login Issue</td>
                    <td>
                      <span className="customer-badge warning">Medium</span>
                    </td>
                    <td>
                      <span className="customer-badge success">Resolved</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>T003</strong>
                    </td>
                    <td>Account Update</td>
                    <td>
                      <span className="customer-badge neutral">Low</span>
                    </td>
                    <td>
                      <span className="customer-badge progress">
                        In Progress
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Grid */}
          <div className="customer-bottom-grid">
            <section className="customer-card">
              <div className="customer-card-icon blue">
                <FaEnvelopeOpenText />
              </div>

              <h3>Create New Ticket</h3>
              <p>
                Submit a new support request and our team will follow up with
                you.
              </p>

              <button
  className="customer-primary-btn customer-card-action"
  onClick={() =>
    setActivePage("create")
  }
>
  <FaPlusCircle />
  Create Ticket
</button>
            </section>

            <section className="customer-card">
              <div className="customer-card-icon green">
                <FaUser />
              </div>

              <h3>Profile Summary</h3>

              <div className="customer-profile-summary">
                <p>
                  <span>Name</span>
                  <strong>Customer</strong>
                </p>

                <p>
                  <span>Email</span>
                  <strong>customer@gmail.com</strong>
                </p>

                <p>
                  <span>Tickets Raised</span>
                  <strong>15</strong>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ text, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`customer-sidebar-item ${active ? "active" : ""}`}
  >
    <span className="customer-sidebar-item-icon">{icon}</span>
    <span>{text}</span>
  </button>
);

const StatCard = ({ title, value, icon, tone, helper }) => (
  <div className="customer-stat-card">
    <div className={`customer-stat-icon ${tone}`}>{icon}</div>

    <div>
      <h3>{title}</h3>
      <h2>{value}</h2>
      <p>{helper}</p>
    </div>
  </div>
);

export default CustomerDashboard;