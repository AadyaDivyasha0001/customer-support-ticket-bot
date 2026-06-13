import React from "react";

const CustomerDashboard = () => {
  return (
    <div
      style={{
        padding: "30px",
        color: "white",
      }}
    >
      <h1>Customer Dashboard</h1>

      <p>
        Welcome to your support portal.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div className="dashboard-card">
          <h3>My Tickets</h3>
          <p>
            View all your support tickets.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Create Ticket</h3>
          <p>
            Raise a new support request.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>
            Chat with support agents.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Profile</h3>
          <p>
            Manage your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;