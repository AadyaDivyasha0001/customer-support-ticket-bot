import { useState, useEffect } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

function Header({
  activePage,
  setActivePage,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
  const socket = io(
    "http://localhost:5000"
  );

  socket.on(
    "newNotification",
    (data) => {
      setNotifications(
        (prev) => [
          data,
          ...prev,
        ]
      );
    }
  );

  return () => {
    socket.disconnect();
  };
}, []);

  const fetchNotifications =
    async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/notifications"
          );

        setNotifications(
          response.data
        );
      } catch (error) {
        console.error(
          "Error fetching notifications:",
          error
        );
      }
    };

  const handleSearch = (value) => {
    setSearchTerm(value);

    const search =
      value.toLowerCase();

    if (
      search.includes("ticket")
    ) {
      setActivePage("tickets");
    } else if (
      search.includes("customer")
    ) {
      setActivePage("customers");
    } else if (
      search.includes("agent")
    ) {
      setActivePage("agents");
    } else if (
      search.includes("analytics")
    ) {
      setActivePage("analytics");
    } else if (
      search.includes("dashboard")
    ) {
      setActivePage("dashboard");
    }
  };

  return (
    <div className="header enterprise-header">
      {/* Search */}
      <div className="search-container enterprise-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search tickets, customers, agents..."
          value={searchTerm}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* Right Side */}
      <div className="header-right">
        {/* Notifications */}
        <div className="notification-wrapper">
          <div
            className="notification"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            <FaBell />

            <span className="notification-badge">
              {notifications.length}
            </span>
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                Notifications
              </div>

              {notifications.length >
              0 ? (
                notifications.map(
                  (
                    notification,
                    index
                  ) => (
                    <div
                      key={index}
                      className="notification-item"
                    >
                      {notification.message ||
                        notification.text ||
                        notification}
                    </div>
                  )
                )
              ) : (
                <div
                  className="notification-item"
                >
                  No notifications
                </div>
              )}
            </div>
          )}
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