import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  FaPaperPlane,
  FaHeadset,
} from "react-icons/fa";

const API = "https://customer-support-ticket-bot.onrender.com";

const CustomerDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("user"));
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);
   const [profileImage,
setProfileImage] =
useState(
  user?.profileImage || ""
);
  // Chat state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatError, setChatError] = useState(null); // track API capability
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const loadTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const u = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API}/tickets/customer/${u.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const createTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const u = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `${API}/tickets`,
        { customerName, email: u.email, title, issue: description, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🎫 Ticket created successfully!");
      setCustomerName(u?.name || "");
      setTitle("");
      setDescription("");
      await loadTickets();
      setActivePage("tickets");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create ticket");
    }
  };

  // ── Chat helpers ──────────────────────────────────────────────

  /**
   * Build a normalised message list from whatever the backend returns.
   * Handles three shapes:
   *  1. Array of message objects  { sender, message, createdAt, ... }
   *  2. A ticket object with a `messages` array inside
   *  3. Nothing / error → fall back to ticket description as seed message
   */
  const normaliseMessages = (data, ticket) => {
    // Shape 1: array of message objects from dedicated endpoint
    if (Array.isArray(data) && data.length > 0 && data[0].message !== undefined) {
      return data;
    }
    // Shape 2: ticket object with embedded messages array
    if (data && Array.isArray(data.messages) && data.messages.length > 0) {
      return data.messages;
    }
    // Fallback: synthesise a seed bubble from the ticket description (sent BY the customer)
    const text = ticket?.description || ticket?.issue;
    if (text) {
      return [
  {
    _id: "seed",
    sender: "customer",
    senderName:
      ticket.customerName ||
      user?.name ||
      "You",
    message: text,
    createdAt:
      ticket.createdAt ||
      new Date(),
  },
];
    }
    return [];
  };

  const loadMessages = async (ticket) => {
    const token = localStorage.getItem("token");
    // Try dedicated messages endpoint first
    try {
      const res = await axios.get(`${API}/tickets/${ticket._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatError(null);
      setMessages(normaliseMessages(res.data, ticket));
      return;
    } catch (err) {
      // 404 → endpoint doesn't exist; fall through to ticket fetch
      if (err.response?.status !== 404) {
        console.log("Message fetch error:", err);
      }
    }
    // Fallback: fetch the ticket itself (messages may be embedded)
    try {
      const res = await axios.get(`${API}/tickets/${ticket._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatError(null);
      setMessages(normaliseMessages(res.data, ticket));
    } catch (err) {
      console.log("Ticket fetch error:", err);
      // Still show ticket description as a seed so the UI isn't empty
      setMessages(normaliseMessages(null, ticket));
    }
  };

  const selectTicketForChat = (ticket) => {
    if (pollRef.current) clearInterval(pollRef.current);
    setSelectedTicket(ticket);
    setMessages([]);
    setChatError(null);
    loadMessages(ticket);
    pollRef.current = setInterval(() => loadMessages(ticket), 4000);
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSendingMessage(true);
    const u = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const body = {
      sender: "customer",
      senderName: u?.name || "Customer",
      message: newMessage.trim(),
    };

    // Try POST /tickets/:id/messages
    let sent = false;
    try {
      await axios.post(`${API}/tickets/${selectedTicket._id}/messages`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sent = true;
    } catch (err) {
      // endpoint may not exist
    }

    // Fallback: try PATCH /tickets/:id (append to messages array)
    if (!sent) {
      try {
        await axios.patch(
          `${API}/tickets/${selectedTicket._id}`,
          { messages: body },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        sent = true;
      } catch (err) {
        console.log("Patch fallback error:", err);
      }
    }

    if (sent) {
      // Optimistic update so user sees the message immediately
      setMessages((prev) => [
        ...prev,
        { ...body, _id: Date.now().toString(), createdAt: new Date().toISOString() },
      ]);
      setNewMessage("");
      setChatError(null);
    } else {
      setChatError(
        "Your message couldn't be sent — the chat API isn't available yet. Ask your backend developer to add POST /tickets/:id/messages"
      );
    }
    setSendingMessage(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // ─────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .chat-page {
          display: flex;
          height: 640px;
          background: #f0f2f5;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.10);
          margin-bottom: 24px;
        }
        .chat-ticket-list {
          width: 320px; min-width: 260px;
          background: #fff;
          border-right: 1px solid #e9edef;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .chat-ticket-list-header {
          padding: 18px 16px 14px;
          border-bottom: 1px solid #e9edef;
          background: #f0f2f5;
        }
        .chat-ticket-list-header h3 { margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #111b21; }
        .chat-ticket-search {
          display: flex; align-items: center;
          background: #fff; border-radius: 8px; padding: 7px 12px;
          gap: 8px; color: #8696a0; font-size: 13px;
        }
        .chat-ticket-search input { border: none; outline: none; background: transparent; font-size: 13px; color: #111b21; width: 100%; }
        .chat-ticket-items { flex: 1; overflow-y: auto; }
        .chat-ticket-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px; cursor: pointer;
          border-bottom: 1px solid #f0f2f5; transition: background 0.15s;
        }
        .chat-ticket-item:hover { background: #f5f6f6; }
        .chat-ticket-item.active { background: #e9edef; }
        .chat-ticket-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #25d366, #128c7e);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; flex-shrink: 0;
        }
        .chat-ticket-meta { flex: 1; min-width: 0; }
        .chat-ticket-meta-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
        .chat-ticket-meta-top strong { font-size: 14px; color: #111b21; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
        .chat-ticket-meta-top span { font-size: 11px; color: #8696a0; flex-shrink: 0; }
        .chat-ticket-preview { font-size: 12px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-ticket-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dot-open { background: #25d366; }
        .dot-pending { background: #ffa500; }
        .dot-closed { background: #8696a0; }

        .chat-panel {
          flex: 1; display: flex; flex-direction: column;
          background: #efeae2; position: relative; overflow: hidden;
        }
        .chat-panel-bg {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9c3b8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .chat-header {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; background: #f0f2f5;
          border-bottom: 1px solid #e9edef; z-index: 1; position: relative;
        }
        .chat-header-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #1e88e5, #1565c0);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 16px;
        }
        .chat-header-info { flex: 1; }
        .chat-header-info strong { display: block; font-size: 15px; color: #111b21; }
        .chat-header-info span { font-size: 12px; color: #8696a0; }
        .chat-header-badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .badge-open { background: #d4edda; color: #155724; }
        .badge-pending { background: #fff3cd; color: #856404; }
        .badge-closed { background: #e2e3e5; color: #383d41; }

        .chat-api-warning {
          background: #fff3cd; border-bottom: 1px solid #ffc107;
          padding: 8px 16px; font-size: 12px; color: #856404;
          z-index: 1; position: relative; display: flex; align-items: flex-start; gap: 8px;
        }
        .chat-api-warning strong { display: block; margin-bottom: 2px; }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 6px;
          position: relative; z-index: 1;
        }
        .chat-date-divider { text-align: center; margin: 10px 0; }
        .chat-date-divider span { background: #d1f4cc; color: #54656f; font-size: 11px; padding: 4px 10px; border-radius: 8px; }

        .chat-bubble-wrap { display: flex; margin-bottom: 2px; }
        .chat-bubble-wrap.customer { justify-content: flex-end; }
        .chat-bubble-wrap.agent { justify-content: flex-start; }
        .chat-bubble {
          max-width: 65%; padding: 8px 12px 6px; border-radius: 8px;
          font-size: 14px; line-height: 1.45; position: relative;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .chat-bubble-wrap.customer .chat-bubble { background: #d9fdd3; border-top-right-radius: 2px; color: #111b21; }
        .chat-bubble-wrap.agent .chat-bubble { background: #fff; border-top-left-radius: 2px; color: #111b21; }
        .chat-bubble-sender { font-size: 11px; font-weight: 700; color: #1e88e5; margin-bottom: 3px; }
        .chat-bubble-time { font-size: 10px; color: #8696a0; float: right; margin-left: 8px; margin-top: 2px; }

        .chat-empty {
          flex: 1; display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 12px; color: #8696a0; position: relative; z-index: 1;
        }
        .chat-empty-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: #d1f4cc; display: flex; align-items: center; justify-content: center;
          font-size: 30px; color: #25d366;
        }
        .chat-empty h3 { font-size: 18px; color: #111b21; margin: 0; }
        .chat-empty p { margin: 0; font-size: 13px; text-align: center; max-width: 260px; }

        .chat-input-bar {
          display: flex; align-items: flex-end; gap: 10px;
          padding: 10px 16px; background: #f0f2f5;
          border-top: 1px solid #e9edef; position: relative; z-index: 1;
        }
        .chat-input-wrap {
          flex: 1; background: #fff; border-radius: 24px; padding: 10px 16px;
          display: flex; align-items: flex-end;
        }
        .chat-input-wrap textarea {
          border: none; outline: none; resize: none; font-size: 14px; color: #111b21;
          background: transparent; width: 100%; max-height: 100px; line-height: 1.4; font-family: inherit;
        }
        .chat-send-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: #25d366; border: none;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 16px; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
        }
        .chat-send-btn:hover { background: #1da851; }
        .chat-send-btn:disabled { background: #b2dfdb; cursor: not-allowed; }
        .chat-no-tickets { padding: 32px 16px; text-align: center; color: #8696a0; font-size: 13px; }
      `}</style>

      <div className="customer-portal-layout">
        <ToastContainer />

        {/* Sidebar */}
        <aside className="customer-sidebar">
          <div className="customer-sidebar-brand">
            <div className="customer-sidebar-logo"><FaUser /></div>
            <div><h2>Customer Portal</h2><p>Support Center</p></div>
          </div>
          <nav className="customer-sidebar-menu">
            <SidebarItem text="Dashboard" icon={<FaHome />} active={activePage === "dashboard"} onClick={() => setActivePage("dashboard")} />
            <SidebarItem text="Create Ticket" icon={<FaPlusCircle />} active={activePage === "create"} onClick={() => setActivePage("create")} />
            <SidebarItem text="My Tickets" icon={<FaTicketAlt />} active={activePage === "tickets"} onClick={() => { loadTickets(); setActivePage("tickets"); }} />
            <SidebarItem text="Messages" icon={<FaComments />} active={activePage === "messages"} onClick={() => { loadTickets(); setActivePage("messages"); }} />
            <SidebarItem text="Profile" icon={<FaUser />} active={activePage === "profile"} onClick={() => setActivePage("profile")} />
          </nav>
          <button onClick={logout} className="customer-logout-btn">
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="customer-main">
          <div className="customer-page-shell">

            {/* Top Bar */}
            <div className="customer-topbar">
              <div className="customer-search">
                <FaSearch />
                <input type="text" placeholder="Search tickets..." />
              </div>
              <div className="customer-topbar-actions">
                <button className="customer-primary-btn" onClick={() => setActivePage("create")}>
                  <FaPlus /> Create Ticket
                </button>
                <div className="customer-profile-chip">
                  <div className="customer-profile-avatar"><FaUser /></div>
                  <div><strong>Customer</strong><span>Portal User</span></div>
                </div>
              </div>
            </div>

            {/* Welcome Banner */}
            <section className="customer-welcome-banner">
              <div>
                <span className="customer-eyebrow">Support workspace</span>
                <h1>Welcome back 👋</h1>
                <p>Create support tickets, track issue progress, and stay updated on every conversation with the support team.</p>
              </div>
              <button className="customer-light-btn"><FaPlusCircle /> New Request</button>
            </section>

            {/* Page Header */}
            <div className="customer-page-header">
              <div><h2>Customer Dashboard</h2><p>Create and track support tickets from one place.</p></div>
            </div>

            {/* ── MESSAGES PAGE ── */}
            {activePage === "messages" && (
              <div className="chat-page">
                {/* Ticket list */}
                <div className="chat-ticket-list">
                  <div className="chat-ticket-list-header">
                    <h3>Your Tickets</h3>
                    <div className="chat-ticket-search">
                      <FaSearch />
                      <input type="text" placeholder="Search or start new chat" />
                    </div>
                  </div>
                  <div className="chat-ticket-items">
                    {tickets.length === 0 ? (
                      <div className="chat-no-tickets">
                        <FaTicketAlt style={{ fontSize: 36, color: "#d1d7db", display: "block", margin: "0 auto 8px" }} />
                        <p>No tickets yet. Create one to start chatting.</p>
                      </div>
                    ) : (
                      tickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className={`chat-ticket-item ${selectedTicket?._id === ticket._id ? "active" : ""}`}
                          onClick={() => selectTicketForChat(ticket)}
                        >
                          <div className="chat-ticket-avatar"><FaHeadset /></div>
                          <div className="chat-ticket-meta">
                            <div className="chat-ticket-meta-top">
                              <strong>{ticket.issue || ticket.title || "Support Ticket"}</strong>
                              <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                            <div className="chat-ticket-preview">
                              #{ticket._id.slice(-5)} · {ticket.assignedAgent?.name || "Awaiting agent"}
                            </div>
                          </div>
                          <div className={`chat-ticket-status-dot ${
                            ticket.status === "open" ? "dot-open" :
                            ticket.status === "closed" ? "dot-closed" : "dot-pending"
                          }`} />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat panel */}
                <div className="chat-panel">
                  <div className="chat-panel-bg" />

                  {!selectedTicket ? (
                    <div className="chat-empty">
                      <div className="chat-empty-icon"><FaComments /></div>
                      <h3>Select a ticket to chat</h3>
                      <p>Choose a ticket from the left to view your conversation with the support team.</p>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="chat-header">
                        <div className="chat-header-avatar"><FaHeadset /></div>
                        <div className="chat-header-info">
                          <strong>{selectedTicket.issue || selectedTicket.title || "Support Ticket"}</strong>
                          <span>{selectedTicket.assignedAgent?.name ? `Agent: ${selectedTicket.assignedAgent.name}` : "Awaiting agent assignment"}</span>
                        </div>
                        <span className={`chat-header-badge ${
                          selectedTicket.status === "open" ? "badge-open" :
                          selectedTicket.status === "closed" ? "badge-closed" : "badge-pending"
                        }`}>
                          {selectedTicket.status || "open"}
                        </span>
                      </div>

                      {/* API warning banner (only shows when send failed) */}
                      {chatError && (
                        <div className="chat-api-warning">
                          <span>⚠️</span>
                          <div>
                            <strong>Sending not available yet</strong>
                            {chatError}
                          </div>
                        </div>
                      )}

                      {/* Messages */}
                      <div className="chat-messages">
                        {messages.length === 0 && (
                          <div style={{ textAlign: "center", color: "#8696a0", fontSize: 13, marginTop: 24 }}>
                            No messages yet. Say hello to start the conversation!
                          </div>
                        )}
                        {messages.map((msg, idx) => {
                          // "customer" sender → right side (green). Anything else → left side (white, agent)
                          const isCustomer =
                            msg.sender === "customer" ||
                            msg.sender === user?.email ||
                            msg.sender === user?.name;
                          const showDate = idx === 0 || formatDate(messages[idx - 1]?.createdAt) !== formatDate(msg.createdAt);
                          return (
                            <div key={msg._id || idx}>
                              {showDate && (
                                <div className="chat-date-divider">
                                  <span>{formatDate(msg.createdAt)}</span>
                                </div>
                              )}
                              <div className={`chat-bubble-wrap ${isCustomer ? "customer" : "agent"}`}>
                                <div className="chat-bubble">
                                  {/* Agent bubbles show agent name; customer bubbles show nothing (it's you) */}
                                  {!isCustomer && (
                                    <div className="chat-bubble-sender">
                                      {msg.senderName || "Support Agent"}
                                    </div>
                                  )}
                                  <div>{msg.message}</div>
                                  <div className="chat-bubble-time">{formatTime(msg.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="chat-input-bar">
                        <div className="chat-input-wrap">
                          <textarea
                            rows={1}
                            placeholder="Type a message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                        <button
                          className="chat-send-btn"
                          onClick={sendMessage}
                          disabled={sendingMessage || !newMessage.trim()}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── CREATE TICKET PAGE ── */}
            {activePage === "create" && (
              <section className="customer-card" style={{ marginBottom: "25px" }}>
                <h2>Create Support Ticket</h2>
                <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: "100%", padding: "12px", marginTop: "15px", marginBottom: "15px" }} />
                <input type="text" placeholder="Issue Title" value={title} onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "12px", marginTop: "15px", marginBottom: "15px" }} />
                <textarea placeholder="Describe your issue" value={description} onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", height: "150px", padding: "12px", marginBottom: "15px" }} />
                <button className="customer-primary-btn" onClick={createTicket}>Submit Ticket</button>
              </section>
            )}

            {/* ── MY TICKETS PAGE ── */}
            {activePage === "tickets" && (
              <section className="customer-card">
                <h2>My Tickets</h2>
                <table className="customer-table">
                  <thead>
                    <tr><th>ID</th><th>Issue</th><th>Status</th><th>Agent</th></tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td>{ticket._id.slice(-5)}</td>
                        <td>{ticket.issue}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.assignedAgent?.name || "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {activePage === "profile" && (
  <section className="customer-card">

    <h2>My Profile</h2>

    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
      }}
    >

      <img
        src={
          profileImage ||
          `https://ui-avatars.com/api/?name=${user?.name}`
        }
        alt="Profile"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "4px solid #2563eb",
        }}
      />

      <br />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={uploadProfileImage}
      />

      <h3
        style={{
          marginTop: "20px",
        }}
      >
        {user?.name}
      </h3>

      <p>{user?.email}</p>

      <p>
        Total Tickets:
        <strong>
          {tickets.length}
        </strong>
      </p>

    </div>

  </section>
)}

            {/* ── DASHBOARD PAGE ── */}
            {activePage === "dashboard" && (
              <>
                <div className="customer-stats-grid">
                  <StatCard title="Total Tickets" value="15" icon={<FaTicketAlt />} tone="blue" helper="All requests submitted" />
                  <StatCard title="Open Tickets" value="4" icon={<FaClock />} tone="orange" helper="Waiting for resolution" />
                  <StatCard title="Resolved" value="9" icon={<FaCheckCircle />} tone="green" helper="Successfully completed" />
                  <StatCard title="Messages" value="6" icon={<FaComments />} tone="purple" helper="Support conversations" />
                </div>

                <section className="customer-card customer-ticket-card">
                  <div className="customer-card-header">
                    <div><h3>Recent Tickets</h3><p>Your latest support requests and current status.</p></div>
                    <button className="customer-secondary-btn">View All</button>
                  </div>
                  <div className="customer-table-wrapper">
                    <table className="customer-table">
                      <thead>
                        <tr><th>ID</th><th>Issue</th><th>Priority</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket._id}>
                            <td>{ticket._id.slice(-5)}</td>
                            <td>{ticket.issue}</td>
                            <td><span className="customer-badge warning">{ticket.priority}</span></td>
                            <td><span className="customer-badge open">{ticket.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="customer-bottom-grid">
                  <section className="customer-card">
                    <div className="customer-card-icon blue"><FaEnvelopeOpenText /></div>
                    <h3>Create New Ticket</h3>
                    <p>Submit a new support request and our team will follow up with you.</p>
                    <button className="customer-primary-btn customer-card-action" onClick={() => setActivePage("create")}>
                      <FaPlusCircle /> Create Ticket
                    </button>
                  </section>
                  <section className="customer-card">
                    <div className="customer-card-icon green"><FaUser /></div>
                    <h3>Profile Summary</h3>
                    <div className="customer-profile-summary">
                      <p><span>Name</span><strong>Customer</strong></p>
                      <p><span>Email</span><strong>customer@gmail.com</strong></p>
                      <p><span>Tickets Raised</span><strong>15</strong></p>
                    </div>
                  </section>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

const SidebarItem = ({ text, icon, active, onClick }) => (
  <button type="button" onClick={onClick} className={`customer-sidebar-item ${active ? "active" : ""}`}>
    <span className="customer-sidebar-item-icon">{icon}</span>
    <span>{text}</span>
  </button>
);

const StatCard = ({ title, value, icon, tone, helper }) => (
  <div className="customer-stat-card">
    <div className={`customer-stat-icon ${tone}`}>{icon}</div>
    <div><h3>{title}</h3><h2>{value}</h2><p>{helper}</p></div>
  </div>
);

export default CustomerDashboard;
