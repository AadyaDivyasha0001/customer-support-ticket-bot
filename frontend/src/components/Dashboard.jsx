import {
  FaTicketAlt,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaChartLine,
  FaUserTie,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { exportDashboardReport } from "../utils/exportReport";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showCriticalModal, setShowCriticalModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets");
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "High"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const resolvedPercent =
    totalTickets > 0
      ? Math.round((resolvedTickets / totalTickets) * 100)
      : 0;

  const recentActivities = useMemo(() => {
    return tickets
      .flatMap((ticket) => ticket.activityLogs || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 4);
  }, [tickets]);

  const urgentTickets = tickets.filter(
    (ticket) => ticket.priority === "High" && ticket.status !== "Resolved"
  );

  const today = new Date();

const angryTickets =
  tickets.filter(
    ticket =>
      ticket.customerSentiment ===
      "Angry"
  ).length;
  
  return (
    <div className="dashboard page-shell">
      {/* Page Header */}
<div className="page-header">
  <div className="page-title-block">
    <span className="eyebrow">Support operations</span>
    <h1>Dashboard</h1>
    <p>
      Monitor ticket volume, urgent issues, recent activity, and support
      team performance.
    </p>
  </div>

  <div className="page-actions">
    <button
      className="btn"
      onClick={() =>
        exportDashboardReport({
          totalTickets,
          openTickets,
          criticalIssues: criticalTickets,
          resolutionRate: resolvedPercent,
          recentActivities: recentActivities.map(
            (activity) => activity.message
          ),
          topAgent: {
            name: "Rahul Verma",
            role: "Senior Support Agent",
          },
        })
      }
    >
      Export Report
    </button>

    </div>
</div>
     
    
      {/* Welcome / Operations Summary */}
      <div className="welcome-card dashboard-summary">
        <div>
          <h1>Good morning, Admin 👋</h1>
          <p>
            Here&apos;s what&apos;s happening across your support queue today.
          </p>
        </div>

        <div className="date-box">
          <p>📅 {today.toLocaleDateString()}</p>
          <p>🕒 {today.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid kpi-grid">
        <div className="stats-card kpi-card">
          <div className="kpi-card-top">
            <div className="card-icon blue">
              <FaTicketAlt />
            </div>
            <span className="badge badge-neutral">All queues</span>
          </div>

          <div>
            <h3>Total Tickets</h3>
            <h2>{totalTickets}</h2>
            <p className="kpi-copy">Total tickets in the system</p>
          </div>
        </div>

        <div className="stats-card kpi-card">
          <div className="kpi-card-top">
            <div className="card-icon green-bg">
              <FaEnvelopeOpenText />
            </div>
            <span className="badge badge-open">Live</span>
          </div>

          <div>
            <h3>Open Tickets</h3>
            <h2>{openTickets}</h2>
            <p className="kpi-copy">Tickets waiting for action</p>
          </div>
        </div>

        <div className="stats-card kpi-card">
          <div className="kpi-card-top">
            <div className="card-icon orange">
              <FaExclamationTriangle />
            </div>
            <span className="badge badge-critical">High priority</span>
          </div>

          

          <div>
            <h3>Critical Issues</h3>
            <h2>{criticalTickets}</h2>
            <p className="kpi-copy">High-priority customer issues</p>
          </div>
        </div>

        <div className="stats-card kpi-card">
          <div className="kpi-card-top">
            <div className="card-icon purple">
              <FaChartLine />
            </div>
            <span className="badge badge-resolved">Resolved</span>
          </div>

          <div>
            <h3>Resolution Rate</h3>
            <h2>{resolvedPercent}%</h2>
            <p className="kpi-copy">{resolvedTickets} tickets resolved</p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-grid dashboard-ops-grid">
        {/* Recent Activity */}
        <div className="activity-card operations-card">
          <div className="card-header-row">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest updates from ticket activity logs.</p>
            </div>
            <span className="badge badge-neutral">Last updates</span>
          </div>

          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <p>{activity.message}</p>
                    {activity.timestamp && (
                      <span>
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No recent activity</h3>
                <p>Ticket updates will appear here once agents take action.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-side-column">
          {/* Urgent Alerts */}
          <div className="alert-card operations-card urgent-card">
            <div className="card-header-row">
              <div>
                <h2>Urgent Alerts</h2>
                <p>High-priority tickets that are still unresolved.</p>
              </div>
              <span className="badge badge-critical">
                {urgentTickets.length}
              </span>
            </div>
             <div>
    <h3>Angry Customers</h3>
    <h2>{angryTickets}</h2>
    <p className="kpi-copy">
      Customers requiring urgent attention
    </p>
  </div>


            <div className="urgent-count-row">
              <strong>{urgentTickets.length}</strong>
              <span>critical tickets need immediate attention.</span>
            </div>

            <button
              className="btn btn-danger full-width"
              onClick={() => setShowCriticalModal(true)}
            >
              View Critical Tickets
            </button>
          </div>

          {/* Top Agent */}
          <div className="top-agent-card operations-card">
            <div className="card-header-row">
              <div>
                <h2>Top Performing Agent</h2>
                <p>Performance snapshot for the current queue.</p>
              </div>
            </div>

            <div className="top-agent-info">
              <div className="agent-avatar">
                <FaUserTie />
              </div>

              <div>
                <h3>Rahul Verma</h3>
                <p>Senior Support Agent</p>
              </div>
            </div>

            <div className="agent-stats">
              <div>
                <h2>{resolvedTickets}</h2>
                <p>Tickets Resolved</p>
              </div>

              <div>
                <h2>{resolvedPercent}%</h2>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Tickets Modal */}
      {showCriticalModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCriticalModal(false)}
        >
          <div
            className="critical-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">Urgent queue</span>
                <h2>Critical Tickets</h2>
                <p>
                  High-priority tickets that are still open or waiting for
                  resolution.
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setShowCriticalModal(false)}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              {urgentTickets.length === 0 ? (
                <div className="empty-state">
                  <h3>No critical tickets found</h3>
                  <p>Your high-priority queue is clear right now.</p>
                </div>
              ) : (
                <div className="critical-ticket-list">
                  {urgentTickets.map((ticket) => (
                    <div key={ticket._id} className="critical-ticket-card">
                      <div className="critical-ticket-header">
                        <div>
                          <h3>{ticket.customerName}</h3>
                          <p>{ticket.email}</p>
                        </div>

                        <span className="badge badge-critical">
                          {ticket.priority}
                        </span>
                      </div>

                      <div className="critical-ticket-body">
                        <p>
                          <strong>Issue</strong>
                          <span>{ticket.issue}</span>
                        </p>

                        <p>
                          <strong>Status</strong>
                          <span>{ticket.status}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
                        <div className="modal-footer">
              <button
                className="btn"
                onClick={() => setShowCriticalModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;

            