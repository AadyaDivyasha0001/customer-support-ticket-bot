import {
  FaBell,
  FaUserCircle,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

function Header() {
  return (
    <div className="header enterprise-header">
      {/* Search */}
      <div className="search-container enterprise-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search tickets, customers, agents..."
        />
      </div>

      {/* Right Side */}
      <div className="header-right">
        <button className="create-ticket-btn">
          <FaPlus />
          Create Ticket
        </button>

        {/* Notification */}
        <div className="notification">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>

        {/* Admin Profile */}
        <div className="admin-profile">
          <FaUserCircle className="admin-avatar" />
          <div className="admin-profile-text">
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;