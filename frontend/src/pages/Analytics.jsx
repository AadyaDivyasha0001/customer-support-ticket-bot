import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const [tickets, setTickets] = useState([]);

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

  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;

  const highPriority = tickets.filter((t) => t.priority === "High").length;
  const mediumPriority = tickets.filter((t) => t.priority === "Medium").length;
  const lowPriority = tickets.filter((t) => t.priority === "Low").length;

  const totalTickets = tickets.length;

  const resolutionRate =
    totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  const statusData = [
    {
      name: "Open",
      value: openTickets,
    },
    {
      name: "Resolved",
      value: resolvedTickets,
    },
    {
      name: "Closed",
      value: closedTickets,
    },
  ];

  const priorityData = [
    {
      name: "High",
      value: highPriority,
    },
    {
      name: "Medium",
      value: mediumPriority,
    },
    {
      name: "Low",
      value: lowPriority,
    },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#64748b"];
  const PRIORITY_COLORS = ["#dc2626", "#f97316", "#16a34a"];

  return (
    <div className="analytics-page page-shell">
      <div className="page-header">
        <div className="page-title-block">
          <span className="eyebrow">Executive analytics</span>
          <h1>Analytics</h1>
          <p>
            Track ticket volume, resolution performance, priority distribution,
            and operational health.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn">Download CSV</button>
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>

      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <h3>Total Tickets</h3>
          <h2>{totalTickets}</h2>
          <p>All tickets in the current dataset</p>
        </div>

        <div className="analytics-kpi-card">
          <h3>Open Tickets</h3>
          <h2>{openTickets}</h2>
          <p>Currently awaiting support action</p>
        </div>

        <div className="analytics-kpi-card">
          <h3>Resolved Tickets</h3>
          <h2>{resolvedTickets}</h2>
          <p>Successfully resolved customer issues</p>
        </div>

        <div className="analytics-kpi-card">
          <h3>Resolution Rate</h3>
          <h2>{resolutionRate}%</h2>
          <p>Resolved tickets compared to total volume</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Ticket Status</h2>
              <p>Open, resolved, and closed ticket distribution.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={310}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                innerRadius={62}
                paddingAngle={4}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-legend">
            {statusData.map((item, index) => (
              <div key={item.name}>
                <span style={{ backgroundColor: COLORS[index] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Priority Distribution</h2>
              <p>Breakdown of ticket severity across the queue.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={priorityData} barSize={42}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={PRIORITY_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;