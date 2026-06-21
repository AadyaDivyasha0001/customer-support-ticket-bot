import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import { FaPaperPlane } from "react-icons/fa";
import {
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaHome,
  FaChartBar,
  FaHeadset,
} from "react-icons/fa";

const AgentDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
   const [tickets, setTickets] = useState([]);
const [selectedTicket, setSelectedTicket] = useState(null);
const [messages, setMessages] = useState([]);
const [replyText, setReplyText] = useState("");
const [profileImage, setProfileImage] =
  useState(
    localStorage.getItem("agentProfileImage") || ""
  );
    const agent = JSON.parse(
    localStorage.getItem("user")
  );
const messagesEndRef = useRef(null);
console.log(
  "Logged Agent:",
  JSON.stringify(agent, null, 2)
);
console.log("Tickets:", tickets);
const assignedTickets = tickets;
const API =
  "https://customer-support-ticket-bot.onrender.com";
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const loadMessages = async (
  ticketId
) => {
  try {

    const token =
      localStorage.getItem("token");

    const res =
      await axios.get(
        `${API}/tickets/${ticketId}/messages`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    setMessages(res.data);

  } catch (err) {
    console.log(err);
  }
};
const uploadProfileImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const imageUrl =
    URL.createObjectURL(file);

  setProfileImage(imageUrl);

  localStorage.setItem(
    "agentProfileImage",
    imageUrl
  );
};

const openChat = (ticket) => {
  setSelectedTicket(ticket);

  loadMessages(ticket._id);
};

const sendReply = async () => {
  if (
    !replyText.trim() ||
    !selectedTicket
  )
    return;

  try {
    await axios.post(
      `${API}/tickets/${selectedTicket._id}/reply`,
      {
        sender: "Agent",
        message: replyText,
      }
    );
     setMessages(prev => [
  ...prev,
  {
    sender: "Agent",
    message: replyText,
  }
]);
    setReplyText("");

    loadMessages(
      selectedTicket._id
    );
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (!selectedTicket) return;

  const interval =
    setInterval(() => {
      loadMessages(
        selectedTicket._id
      );
    }, 3000);

  return () =>
    clearInterval(interval);
}, [selectedTicket]);
 const loadTickets = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const res = await axios.get(
      `${API}/tickets/agent/email/${agent.email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
     console.log("API RESPONSE:", res.data);
    setTickets(res.data);

  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadTickets();

  socket.on(
    "ticketUpdated",
    () => {
      loadTickets();
    }
  );

  socket.on(
    "ticketCreated",
    () => {
      loadTickets();
    }
  );

  return () => {
    socket.off("ticketUpdated");
    socket.off("ticketCreated");
  };
}, []);

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const DashboardContent = () => (
    <>
      {/* Stat Cards */}
      <div className="agent-stats-grid">
        <StatCard
          title="Assigned Tickets"
          value="12"
          icon={<FaTicketAlt />}
          tone="blue"
          helper="Allocated to you"
        />
        <StatCard
          title="Open Tickets"
          value="7"
          icon={<FaClock />}
          tone="orange"
          helper="Awaiting resolution"
        />
        <StatCard
          title="Resolved Today"
          value="8"
          icon={<FaCheckCircle />}
          tone="green"
          helper="Successfully closed"
        />
        <StatCard
          title="SLA Alerts"
          value="2"
          icon={<FaExclamationTriangle />}
          tone="purple"
          helper="Urgent attention needed"
        />
      </div>

      {/* Recent Tickets Card */}
      <section className="agent-card agent-ticket-card">
        <div className="agent-card-header">
          <div>
            <h3>Recent Assigned Tickets</h3>
            <p>Your current active workspace and customer tickets.</p>
          </div>
          <button className="agent-secondary-btn">View All</button>
        </div>
        <div className="agent-table-wrapper">
          <table className="agent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T001</td>
                <td>Nikhil</td>
                <td><span className="agent-badge danger">High</span></td>
                <td><span className="agent-badge open">Open</span></td>
              </tr>
              <tr>
                <td>T002</td>
                <td>Rajat</td>
                <td><span className="agent-badge warning">Medium</span></td>
                <td><span className="agent-badge pending">In Progress</span></td>
              </tr>
              <tr>
                <td>T003</td>
                <td>Shyamal</td>
                <td><span className="agent-badge low">Low</span></td>
                <td><span className="agent-badge closed">Resolved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights Row Split */}
      <div className="agent-bottom-grid">
        <section className="agent-card">
          <div className="agent-card-icon green">
            <FaRobot />
          </div>
          <h3>AI Copilot Suggestions</h3>
          <div className="agent-profile-summary" style={{ marginTop: "12px" }}>
            <p><span>Suggested Dept.</span><strong>Billing & Refunds</strong></p>
            <p><span>Priority Route</span><strong>High Priority Match</strong></p>
            <p><span>User Sentiment</span><strong>Neutral / Direct</strong></p>
            <p><span>Model Confidence</span><strong>95% Precision</strong></p>
          </div>
        </section>

        <section className="agent-card">
          <div className="agent-card-icon blue">
            <FaChartBar />
          </div>
          <h3>Performance Insights</h3>
          <div className="agent-profile-summary" style={{ marginTop: "12px" }}>
            <p><span>Total Resolved</span><strong>35 Issues</strong></p>
            <p><span>Avg Response Time</span><strong>12 minutes</strong></p>
            <p><span>CSAT Score</span><strong>92% Positive</strong></p>
          </div>
        </section>
      </div>
    </>
  );

  return (
    <>
      <style>{`
      .agent-card p,
.agent-card strong,
.agent-card h2,
.agent-card h3,
.agent-card h4,
.agent-card span{
  color:#1e293b !important;
}
.agent-profile-card,
.agent-profile-details,
.agent-performance-card,
.agent-stats-card{
  color:#1e293b;
}

.agent-profile-card p,
.agent-profile-details p,
.agent-performance-card p,
.agent-stats-card p{
  color:#475569;
}

.agent-profile-card h2,
.agent-profile-card h3,
.agent-profile-details h3,
.agent-performance-card h3{
  color:#0f172a;
}
.agent-chat-page{
  display:flex;
  height:640px;
  background:#f0f2f5;
  border-radius:14px;
  overflow:hidden;
  box-shadow:0 2px 12px rgba(0,0,0,0.08);
}

.agent-chat-sidebar{
  width:320px;
  background:#fff;
  border-right:1px solid #e5e7eb;
  overflow-y:auto;
}

.agent-chat-ticket{
  display:flex;
  flex-direction:column;
  padding:16px;
  cursor:pointer;
  border-bottom:1px solid #f1f5f9;
  transition:.2s;
}

.agent-chat-ticket:hover{
  background:#f8fafc;
}

.agent-chat-ticket.active{
  background:#e9edef;
}

.agent-chat-ticket strong{
  font-size:14px;
  color:#111827;
}

.agent-chat-ticket p{
  font-size:13px;
  color:#64748b;
  margin-top:4px;
}

.agent-chat-window{
  flex:1;
  display:flex;
  flex-direction:column;
  background:#efeae2;
}

.agent-chat-header{
  padding:14px 18px;
  background:#f0f2f5;
  border-bottom:1px solid #e5e7eb;
  font-weight:600;
  display:flex;
  align-items:center;
  gap:12px;
}

.agent-chat-messages{
  flex:1;
  overflow-y:auto;
  padding:20px;
  background:#efeae2;
}

.agent-msg{
  max-width:65%;
  padding:10px 14px;
  border-radius:10px;
  margin-bottom:10px;
  font-size:14px;
  line-height:1.5;
  box-shadow:0 1px 2px rgba(0,0,0,0.08);
}

.agent-msg.customer{
  background:white;
}

.agent-msg.agent{
  background:#d9fdd3;
  margin-left:auto;
}

.agent-chat-input{
  padding:12px 16px;
  background:#f0f2f5;
  border-top:1px solid #e5e7eb;
  display:flex;
  gap:10px;
}

.agent-chat-input textarea{
  flex:1;
  border:none;
  outline:none;
  resize:none;
  background:white;
  border-radius:25px;
  padding:12px 18px;
  font-size:14px;
}

.agent-chat-input button{
  width:52px;
  height:52px;
  border:none;
  border-radius:50%;
  background:#22c55e;
  color:white;
  cursor:pointer;
  font-weight:600;
}
 .agent-upload-btn{
  display:inline-block;
  padding:12px 20px;
  background:#2563eb;
  color:white;
  border-radius:10px;
  cursor:pointer;
  font-weight:600;
  margin-top:12px;
}

.agent-upload-btn:hover{
  background:#1d4ed8;
}

.agent-remove-btn{
  display:block;
  width:100%;
  margin-top:12px;
  padding:12px;
  border:none;
  border-radius:10px;
  background:#ef4444;
  color:white;
  cursor:pointer;
  font-weight:600;
}

.agent-remove-btn:hover{
  background:#dc2626;
}
 .agent-performance-grid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:20px;
margin-top:20px;
}

.agent-performance-box{
background:#f8fafc;
padding:20px;
border-radius:12px;
border:1px solid #e2e8f0;
}

.agent-performance-box h4{
margin-bottom:15px;
color:#334155;
}

.performance-value{
font-size:28px;
font-weight:700;
color:#1e293b;
margin-bottom:15px;
}

.performance-bar{
height:10px;
background:#e2e8f0;
border-radius:999px;
overflow:hidden;
}

.performance-fill{
height:100%;
border-radius:999px;
}

.performance-fill.green{
background:#22c55e;
}

.performance-fill.blue{
background:#2563eb;
}
.agent-ticket-board{
display:grid;
grid-template-columns:1fr 1fr 1fr;
gap:20px;
margin-top:20px;
}

.ticket-column{
background:white;
padding:20px;
border-radius:16px;
box-shadow:0 2px 12px rgba(0,0,0,0.08);
min-height:500px;
}

.ticket-column h3{
margin-bottom:20px;
color:#1e293b;
}

.ticket-card{
background:#f8fafc;
padding:15px;
border-radius:12px;
margin-bottom:12px;
cursor:pointer;
border:1px solid #e2e8f0;
transition:0.2s;
}

.ticket-card:hover{
transform:translateY(-2px);
background:#eff6ff;
}

.ticket-card h4{
margin:0 0 8px;
font-size:14px;
color:#1e293b;
}

.ticket-card p{
margin:0;
font-size:13px;
color:#64748b;
}











































        .agent-portal-layout {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .agent-sidebar {
          width: 260px;
          background: #0f172a;
          padding: 24px;
          display: flex;
          flex-direction: column;
          color: #fff;
          flex-shrink: 0;
        }
        .agent-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .agent-sidebar-logo {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .agent-sidebar-brand h2 { font-size: 16px; margin: 0; font-weight: 600; color: #fff; }
        .agent-sidebar-brand p { font-size: 12px; margin: 2px 0 0; color: #94a3b8; }
        .agent-sidebar-menu { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        
        .agent-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          width: 100%;
        }
        .agent-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .agent-sidebar-item.active { background: #fff; color: #0f172a; font-weight: 600; }
        .agent-sidebar-item-icon { display: flex; align-items: center; font-size: 16px; }
        
        .agent-logout-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
          text-align: left;
        }
        .agent-main { flex: 1; overflow-y: auto; padding: 32px; }
        .agent-page-shell { max-width: 1140px; margin: 0 auto; }
        
        /* Topbar styling matching original screenshot */
        .agent-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        .agent-search {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 24px;
          padding: 10px 18px;
          gap: 10px;
          color: #94a3b8;
          width: 320px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .agent-search input { border: none; outline: none; width: 100%; font-size: 14px; color: #1e293b; }
        .agent-topbar-actions { display: flex; align-items: center; gap: 20px; }
        
        .agent-profile-chip { display: flex; align-items: center; gap: 10px; }
        .agent-profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #dbeafe;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .agent-profile-chip strong { display: block; font-size: 14px; color: #1e293b; }
        .agent-profile-chip span { display: block; font-size: 11px; color: #64748b; }
        
        /* Banner matching original photo */
        .agent-welcome-banner {
          background: linear-gradient(135deg, #1e40af, #2563eb);
          border-radius: 16px;
          padding: 28px 32px;
          color: #fff;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
        }
        .agent-eyebrow { font-size: 11px; text-transform: uppercase; tracking-letter: 0.05em; color: #93c5fd; font-weight: 600; display: block; margin-bottom: 6px; }
        .agent-welcome-banner h1 { font-size: 24px; margin: 0 0 8px; font-weight: 700; }
        .agent-welcome-banner p { font-size: 14px; margin: 0; color: #dbeafe; max-width: 600px; line-height: 1.5; }
        
        /* Light-theme structural grid layouts */
        .agent-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }
        .agent-stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.01);
        }
        .agent-stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .agent-stat-icon.blue { background: #dbeafe; color: #2563eb; }
        .agent-stat-icon.orange { background: #ffedd5; color: #f97316; }
        .agent-stat-icon.green { background: #dcfce7; color: #22c55e; }
        .agent-stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        
        .agent-stat-card h3 { margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .agent-stat-card h2 { margin: 4px 0 2px; font-size: 24px; font-weight: 700; color: #1e293b; }
        .agent-stat-card p { margin: 0; font-size: 11px; color: #94a3b8; }
        
        .agent-card {
          background: #fff;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.01);
          margin-bottom: 24px;
        }
        .agent-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .agent-card-header h3 { margin: 0 0 4px; font-size: 16px; color: #1e293b; font-weight: 600; }
        .agent-card-header p { margin: 0; font-size: 13px; color: #64748b; }
        
        .agent-secondary-btn {
          background: #f8fafc; border: 1px solid #e2e8f0; color: #475569;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
        }
        .agent-secondary-btn:hover { background: #f1f5f9; }
        
        /* Table layout styles */
        .agent-table-wrapper { overflow-x: auto; }
        .agent-table { width: 100%; border-collapse: collapse; text-align: left; }
        .agent-table th { padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 12px; font-weight: 600; color: #718096; text-transform: uppercase; }
        .agent-table td { padding: 14px 16px; border-bottom: 1px solid #f7fafc; font-size: 14px; color: #2d3748; font-weight: 500; }
        .agent-table tbody tr:hover { background: #f8fafc; }
        
        /* Badges styles */
        .agent-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .agent-badge.open { background: #dcfce7; color: #15803d; }
        .agent-badge.pending { background: #dbeafe; color: #1d4ed8; }
        .agent-badge.closed { background: #f3f4f6; color: #4b5563; }
        .agent-badge.danger { background: #fee2e2; color: #b91c1c; }
        .agent-badge.warning { background: #ffedd5; color: #c2410c; }
        .agent-badge.low { background: #f1f5f9; color: #475569; }
        
        .agent-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .agent-card-icon {
          width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 14px;
        }
        .agent-card-icon.blue { background: #e0f2fe; color: #0369a1; }
        .agent-card-icon.green { background: #dcfce7; color: #15803d; }
        .agent-card h3 { margin: 0 0 12px; font-size: 15px; color: #1e293b; }
        
        .agent-profile-summary p { display: flex; justify-content: space-between; margin: 0; padding: 10px 0; border-bottom: 1px dashed #f1f5f9; font-size: 13px; }
        .agent-profile-summary p:last-child { border-bottom: none; }
        .agent-profile-summary span { color: #64748b; }
        .agent-profile-summary strong { color: #1e293b; font-weight: 600; }
      `}</style>

      <div className="agent-portal-layout">
        {/* Sidebar */}
        <aside className="agent-sidebar">
          <div className="agent-sidebar-brand">
            <div className="agent-sidebar-logo"><FaHeadset /></div>
            <div>
              <h2>Agent Panel</h2>
              <p>Support Workspace</p>
            </div>
          </div>
          <nav className="agent-sidebar-menu">
            <SidebarItem
              text="Dashboard"
              icon={<FaHome />}
              active={activePage === "dashboard"}
              onClick={() => setActivePage("dashboard")}
            />
            <SidebarItem
              text="Assigned Tickets"
              icon={<FaTicketAlt />}
              active={activePage === "assigned"}
              onClick={() => setActivePage("assigned")}
            />
            <SidebarItem
              text="Open Tickets"
              icon={<FaClock />}
              active={activePage === "open"}
              onClick={() => setActivePage("open")}
            />
            <SidebarItem
              text="Messages"
              icon={<FaComments />}
              active={activePage === "messages"}
              onClick={() => setActivePage("messages")}
            />
            <SidebarItem
              text="Performance"
              icon={<FaChartBar />}
              active={activePage === "performance"}
              onClick={() => setActivePage("performance")}
            />
            <SidebarItem
              text="Profile"
              icon={<FaUser />}
              active={activePage === "profile"}
              onClick={() => setActivePage("profile")}
            />
          </nav>
          <button onClick={logout} className="agent-logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Workspace Frame */}
        <main className="agent-main">
          <div className="agent-page-shell">
            {/* Top Bar Layout */}
            <div className="agent-topbar">
              <div className="agent-search">
                <FaSearch />
                <input type="text" placeholder="Search parameters or ticket IDs..." />
              </div>
              <div className="agent-topbar-actions">
                <div className="agent-profile-chip">
                  <div className="agent-profile-avatar"><FaUser /></div>
                  <div>
                    <strong>{agent?.name}</strong>
                    <span>Agent Workspace</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient Header Box */}
            <section className="agent-welcome-banner">
              <span className="agent-eyebrow">Enterprise Support Engine</span>
              <h1>Welcome back 👋</h1>
              <p>Review customer workflows, chat streams, resolve outstanding issues, and monitor real-time automated AI assistant classifications.</p>
            </section>

            {/* Subpage Router View Container */}
            {activePage === "dashboard" && (
  <DashboardContent />
)}
           {activePage === "messages" && (
<div className="agent-chat-page">

<div className="agent-chat-sidebar">

{assignedTickets.map((ticket)=>(

<div
key={ticket._id}
onClick={() => openChat(ticket)}
className={`agent-chat-ticket ${
selectedTicket?._id === ticket._id
? "active"
: ""
}`}
>

<strong>
{ticket.customerName}
</strong>

<p>
#{ticket._id.slice(-5)} · {ticket.issue}
</p>

</div>

))}

</div>

<div className="agent-chat-window">

{selectedTicket ? (
<>

<div className="agent-chat-header">

<div
style={{
width:"40px",
height:"40px",
borderRadius:"50%",
background:"#2563eb",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"#fff"
}}
>
<FaHeadset />
</div>

<div>
<strong>
{selectedTicket.customerName}
</strong>

<div
style={{
fontSize:"12px",
color:"#64748b"
}}
>
{selectedTicket.issue}
</div>
</div>

</div>

<div className="agent-chat-messages">

{messages.map((msg,index)=>(

<div
key={index}
style={{
display:"flex",
justifyContent:
msg.sender === "Agent"
? "flex-end"
: "flex-start"
}}
>

<div
className={`agent-msg ${
msg.sender === "Agent"
? "agent"
: "customer"
}`}
>

<div
style={{
fontSize:"11px",
fontWeight:"600",
marginBottom:"4px",
color:"#2563eb"
}}
>
{msg.sender}
</div>

{msg.message}

</div>

</div>

))}

<div ref={messagesEndRef}/>

</div>

<div className="agent-chat-input">

<textarea
placeholder="Type reply..."
value={replyText}
onChange={(e)=>
setReplyText(
e.target.value
)
}
/>

<button onClick={sendReply}>
<FaPaperPlane />
</button>

</div>

</>

) : (

<div
style={{
display:"flex",
height:"100%",
justifyContent:"center",
alignItems:"center"
}}
>
Select a customer chat
</div>

)}

</div>

</div>
)}
{activePage === "assigned" && (
  <section className="agent-card">

    <div className="agent-card-header">
      <div>
        <h3>Assigned Tickets</h3>
        <p>Tickets currently assigned to you.</p>
      </div>
    </div>

    <div className="agent-table-wrapper">

      <table className="agent-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {assignedTickets.map((ticket) => (

            <tr key={ticket._id}>

              <td>{ticket._id.slice(-5)}</td>

              <td>
                {ticket.customerName}
              </td>

              <td>
                {ticket.issue}
              </td>

              <td>
                <span className="agent-badge warning">
                  {ticket.priority || "Medium"}
                </span>
              </td>

              <td>
                <span className="agent-badge pending">
                  {ticket.status}
                </span>
              </td>

              <td>

                <button
                  className="agent-secondary-btn"
                  onClick={() => {
                    setActivePage("messages");
                    openChat(ticket);
                  }}
                >
                  Chat
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </section>
)}

{activePage === "open" && (

<div className="agent-ticket-board">

  <div className="ticket-column">

    <h3>Open</h3>

    {assignedTickets
      .filter(
        (ticket) =>
          ticket.status === "Open"
      )
      .map((ticket) => (

      <div
        key={ticket._id}
        className="ticket-card"
      >

        <h4>{ticket.issue}</h4>

        <p>
          {ticket.customerName}
        </p>

      </div>

    ))}

  </div>

  <div className="ticket-column">

    <h3>In Progress</h3>

    {assignedTickets
      .filter(
        (ticket) =>
          ticket.status ===
          "In Progress"
      )
      .map((ticket) => (

      <div
        key={ticket._id}
        className="ticket-card"
      >

        <h4>{ticket.issue}</h4>

        <p>
          {ticket.customerName}
        </p>

      </div>

    ))}

  </div>

  <div className="ticket-column">

    <h3>Resolved</h3>

    {assignedTickets
      .filter(
        (ticket) =>
          ticket.status ===
          "Resolved"
      )
      .map((ticket) => (

      <div
           key={ticket._id}
          className="ticket-card"
         onClick={() => {
        setActivePage("messages");
       openChat(ticket);
}}
>

        <h4>{ticket.issue}</h4>

        <p>
          {ticket.customerName}
        </p>

      </div>

    ))}

  </div>

</div>

)}


{activePage === "profile" && (

  <section className="agent-card">

    <h2>My Profile</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "30px",
        marginTop: "25px",
      }}
    >

      {/* LEFT PROFILE CARD */}

      <div
        style={{
          textAlign: "center",
          padding: "25px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
       <img
  src={
  profileImage ||
  `https://ui-avatars.com/api/?name=${agent?.name}`
}
  alt="Agent"
  style={{
    width:"160px",
    height:"160px",
    borderRadius:"50%",
    objectFit:"cover",
    border:"4px solid #2563eb"
  }}
/>
<br />
<br />

<label
  htmlFor="agent-profile-upload"
  className="agent-upload-btn"
>
  Upload Profile Picture
</label>

<input
  id="agent-profile-upload"
  type="file"
  accept="image/*"
  style={{ display:"none" }}
  onChange={uploadProfileImage}
/>
   <button
  className="agent-remove-btn"
  onClick={() => {
    setProfileImage("");
    localStorage.removeItem(
      "agentProfileImage"
    );
  }}
>
  Remove Picture
</button>    
        <h3 style={{ marginTop: "20px" }}>
  {agent?.name}
</h3>

        <p
          style={{
            color: "#64748b",
            marginBottom: "15px",
          }}
        >
         {agent?.email}
        </p>

        <span
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Active Agent
        </span>

      </div>

      {/* RIGHT SECTION */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        {/* Agent Details */}

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >

          <h3>👤 Agent Details</h3>

          <p>
            <strong>Name:</strong> {agent?.name}
          </p>

          <p>
            <strong>Email:</strong> {agent?.email}
          </p>

          <p>
            <strong>Phone:</strong>{agent?.phone || "-"}
          </p>

          <p>
            <strong>Department:</strong>{agent?.department || "-"}
          </p>

          <p>
            <strong>Employee ID:</strong> {agent?._id?.slice(-5) || "-"}
          </p>

          <p>
            <strong>Role:</strong> Support Executive
          </p>

          <p>
            <strong>Joined:</strong> Jan 2026
          </p>

        </div>

        {/* Performance Overview */}

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >

          <h3>📊 Performance Overview</h3>

          <p>
            <strong>Total Tickets Handled:</strong> 248
          </p>

          <p>
            <strong>Resolved Tickets:</strong> 220
          </p>

          <p>
            <strong>Pending Tickets:</strong> 18
          </p>

          <p>
            <strong>Open Tickets:</strong> 10
          </p>

          <p>
            <strong>Average Response Time:</strong> 12 mins
          </p>

          <p>
            <strong>Customer Satisfaction:</strong> 94%
          </p>

          <p>
            <strong>Rating:</strong> ⭐ 4.8 / 5
          </p>

        </div>

      </div>

    </div>

    {/* TICKET STATISTICS */}

    <div
      style={{
        marginTop: "40px",
      }}
    >

      <h3
        style={{
          marginBottom: "20px",
          fontSize: "24px",
        }}
      >
        📈 Ticket Statistics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <FaTicketAlt
            style={{
              fontSize: "30px",
              color: "#2563eb",
              marginBottom: "10px",
            }}
          />
          <h2>248</h2>
          <p>Total Tickets</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: "30px",
              color: "#16a34a",
              marginBottom: "10px",
            }}
          />
          <h2>220</h2>
          <p>Resolved</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <FaClock
            style={{
              fontSize: "30px",
              color: "#f59e0b",
              marginBottom: "10px",
            }}
          />
          <h2>18</h2>
          <p>Pending</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <FaUser
            style={{
              fontSize: "30px",
              color: "#9333ea",
              marginBottom: "10px",
            }}
          />
          <h2>94%</h2>
          <p>Customer Satisfaction</p>
        </div>

      </div>

    </div>

  </section>
)}
    {activePage === "performance" && (
  <>
    <div className="agent-stats-grid">

      <div className="agent-stat-card">
        <div className="agent-stat-icon blue">
          <FaTicketAlt />
        </div>
        <div>
          <h3>Total Tickets</h3>
          <h2>248</h2>
          <p>Handled this year</p>
        </div>
      </div>

      <div className="agent-stat-card">
        <div className="agent-stat-icon green">
          <FaCheckCircle />
        </div>
        <div>
          <h3>Resolved</h3>
          <h2>220</h2>
          <p>Successfully closed</p>
        </div>
      </div>

      <div className="agent-stat-card">
        <div className="agent-stat-icon orange">
          <FaClock />
        </div>
        <div>
          <h3>Avg Response</h3>
          <h2>12m</h2>
          <p>Average response time</p>
        </div>
      </div>

      <div className="agent-stat-card">
        <div className="agent-stat-icon purple">
          <FaUser />
        </div>
        <div>
          <h3>CSAT Score</h3>
          <h2>94%</h2>
          <p>Customer satisfaction</p>
        </div>
      </div>

    </div>

    <section className="agent-card">
      <h3>📊 Performance Overview</h3>

      <div className="agent-performance-grid">

        <div className="agent-performance-box">
          <h4>Resolution Rate</h4>
          <div className="performance-value">89%</div>

          <div className="performance-bar">
            <div
              className="performance-fill green"
              style={{ width: "89%" }}
            />
          </div>
        </div>

        <div className="agent-performance-box">
          <h4>Response Efficiency</h4>
          <div className="performance-value">92%</div>

          <div className="performance-bar">
            <div
              className="performance-fill blue"
              style={{ width: "92%" }}
            />
          </div>
        </div>

        <div className="agent-performance-box">
          <h4>Customer Rating</h4>
          <div className="performance-value">
            ⭐ 4.8 / 5
          </div>
        </div>

        <div className="agent-performance-box">
          <h4>Pending Workload</h4>
          <div className="performance-value">
            18 Tickets
          </div>
        </div>

      </div>
    </section>

    <section className="agent-card">
      <h3>📅 Monthly Performance</h3>

      <table className="agent-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Handled</th>
            <th>Resolved</th>
            <th>Response Time</th>
            <th>CSAT</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Jan</td>
            <td>42</td>
            <td>39</td>
            <td>13 min</td>
            <td>93%</td>
          </tr>

          <tr>
            <td>Feb</td>
            <td>38</td>
            <td>35</td>
            <td>11 min</td>
            <td>95%</td>
          </tr>

          <tr>
            <td>Mar</td>
            <td>44</td>
            <td>41</td>
            <td>12 min</td>
            <td>94%</td>
          </tr>

          <tr>
            <td>Apr</td>
            <td>51</td>
            <td>47</td>
            <td>10 min</td>
            <td>96%</td>
          </tr>
        </tbody>
      </table>
    </section>
  </>
)}
            
          </div>
        </main>
      </div>
    </>
  );
};

const SidebarItem = ({ text, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`agent-sidebar-item ${active ? "active" : ""}`}
  >
    <span className="agent-sidebar-item-icon">{icon}</span>
    <span>{text}</span>
  </button>
);

const StatCard = ({ title, value, icon, tone, helper }) => (
  <div className="agent-stat-card">
    <div className={`agent-stat-icon ${tone}`}>{icon}</div>
    <div>
      <h3>{title}</h3>
      <h2>{value}</h2>
      <p>{helper}</p>
    </div>
  </div>
);

export default AgentDashboard;