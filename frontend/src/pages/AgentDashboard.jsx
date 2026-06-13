import React from "react";

const AgentDashboard = () => {
  return (
    <div
      style={{
        padding: "30px",
        color: "white",
      }}
    >
      <h1>Agent Dashboard</h1>

      <p>
        Manage assigned tickets and
        customer communication.
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
          <h3>Assigned Tickets</h3>
          <p>
            View assigned tickets.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Open Tickets</h3>
          <p>
            Track active issues.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>
            Communicate with customers.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Performance</h3>
          <p>
            Review ticket statistics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;