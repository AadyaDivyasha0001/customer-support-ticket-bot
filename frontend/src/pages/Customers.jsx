import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  FaEnvelope,
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/tickets");
      const tickets = response.data;

      const groupedCustomers = Object.values(
        tickets.reduce((acc, ticket) => {
          if (!acc[ticket.email]) {
            acc[ticket.email] = {
              customerName: ticket.customerName,
              email: ticket.email,
              totalTickets: 0,
              openTickets: 0,
              resolvedTickets: 0,
            };
          }

          acc[ticket.email].totalTickets++;

          if (ticket.status === "Open") {
            acc[ticket.email].openTickets++;
          }

          if (ticket.status === "Resolved") {
            acc[ticket.email].resolvedTickets++;
          }

          return acc;
        }, {})
      );

      setCustomers(groupedCustomers);
    } catch (error) {
      console.log(error);
    }
  };

  const totalCustomers = customers.length;

  const totalTickets = customers.reduce(
    (sum, customer) => sum + customer.totalTickets,
    0
  );

  const totalOpenTickets = customers.reduce(
    (sum, customer) => sum + customer.openTickets,
    0
  );

  const totalResolvedTickets = customers.reduce(
    (sum, customer) => sum + customer.resolvedTickets,
    0
  );

  return (
    <div className="customers-page page-shell">
      <div className="page-header">
        <div className="page-title-block">
          <span className="eyebrow">Customer 360</span>
          <h1>Customers</h1>
          <p>
            View customer-level ticket history, open issues, and resolution
            performance.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn">Export</button>
          <button className="btn btn-primary">Add Customer</button>
        </div>
      </div>

      <div className="customer-summary-grid">
        <div className="summary-card">
          <div className="summary-icon blue">
            <FaUsers />
          </div>
          <div>
            <h3>Total Customers</h3>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">
            <FaTicketAlt />
          </div>
          <div>
            <h3>Total Tickets</h3>
            <h2>{totalTickets}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <FaExclamationCircle />
          </div>
          <div>
            <h3>Open Tickets</h3>
            <h2>{totalOpenTickets}</h2>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green-bg">
            <FaCheckCircle />
          </div>
          <div>
            <h3>Resolved</h3>
            <h2>{totalResolvedTickets}</h2>
          </div>
        </div>
      </div>

      <div className="customers-panel">
        <div className="panel-header">
          <div>
            <h2>Customer Directory</h2>
            <p>Grouped from your support ticket history.</p>
          </div>

          <input
            className="panel-search"
            type="text"
            placeholder="Search customers..."
          />
        </div>

        {customers.length === 0 ? (
          <div className="empty-state">
            <h3>No customers found</h3>
            <p>Customer records will appear once tickets are created.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total Tickets</th>
                  <th>Open</th>
                  <th>Resolved</th>
                  <th>Health</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer, index) => {
                  const initials = customer.customerName
                    ? customer.customerName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "CU";

                  const hasOpenTickets = customer.openTickets > 0;

                  return (
                    <tr key={index}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{initials}</div>
                          <div>
                            <strong>{customer.customerName}</strong>
                            <span>Customer profile</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="email-cell">
                          <FaEnvelope />
                          {customer.email}
                        </div>
                      </td>

                      <td>{customer.totalTickets}</td>

                      <td>
                        <span
                          className={
                            hasOpenTickets
                              ? "badge badge-pending"
                              : "badge badge-neutral"
                          }
                        >
                          {customer.openTickets}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-resolved">
                          {customer.resolvedTickets}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            hasOpenTickets
                              ? "badge badge-open"
                              : "badge badge-resolved"
                          }
                        >
                          {hasOpenTickets ? "Active" : "Healthy"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;