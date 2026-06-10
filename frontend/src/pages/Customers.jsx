import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);

const [newCustomer, setNewCustomer] = useState({
  customerName: "",
  email: "",
});

  useEffect(() => {
    fetchCustomers();
  }, []);
const fetchCustomers = async () => {
  try {
    const response = await api.get(
      "/api/customers"
    );

    setCustomers(response.data);
  } catch (error) {
    console.log(error);
  }
};
  
         
  const exportCustomersPDF = () => {
  const doc = new jsPDF();

  doc.text("Customer Report", 14, 15);

  autoTable(doc, {
    head: [["Customer", "Email", "Total Tickets"]],
    body: customers.map((customer) => [
      customer.customerName,
      customer.email,
      customer.totalTickets,
    ]),
  });

  doc.save("customer-report.pdf");
};
const handleAddCustomer = async () => {
  try {
    if (
      !newCustomer.customerName ||
      !newCustomer.email
    ) {
      alert("Please fill all fields");
      return;
    }

    await api.post(
      "/api/customers",
      {
        customerName:
          newCustomer.customerName,
        email: newCustomer.email,
      }
    );

    fetchCustomers();

    setNewCustomer({
      customerName: "",
      email: "",
    });

    setShowCustomerModal(false);
  } catch (error) {
    console.log(error);

    alert(
      "Failed to add customer"
    );
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
const filteredCustomers = customers.filter(
  (customer) =>
    customer.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    customer.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
  <button
    className="btn"
    onClick={exportCustomersPDF}
  >
    Export
  </button>

  <button
    className="btn btn-primary"
    onClick={() =>
      setShowCustomerModal(true)
    }
  >
    Add Customer
  </button>
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
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
/>
        </div>

       {filteredCustomers.length === 0 ? (
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
                {filteredCustomers.map((customer, index) => {
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
      {showCustomerModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        width: "400px",
      }}
    >
      <h2>Add Customer</h2>

      <input
        type="text"
        placeholder="Customer Name"
        value={
          newCustomer.customerName
        }
        onChange={(e) =>
          setNewCustomer({
            ...newCustomer,
            customerName:
              e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={newCustomer.email}
        onChange={(e) =>
          setNewCustomer({
            ...newCustomer,
            email: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={
            handleAddCustomer
          }
        >
          Save
        </button>

        <button
          className="btn"
          onClick={() =>
            setShowCustomerModal(
              false
            )
          }
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Customers;