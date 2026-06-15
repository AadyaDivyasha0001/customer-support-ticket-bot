import { useState, useEffect, useRef } from "react";
import axios from "axios";
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

const messagesEndRef = useRef(null);

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
      `${API}/tickets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTickets(res.data);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadTickets();
}, []);

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
      .agent-chat-page{
display:flex;
height:650px;
background:#fff;
border-radius:16px;
overflow:hidden;
}

.agent-chat-sidebar{
width:350px;
border-right:1px solid #e5e7eb;
overflow-y:auto;
}

.agent-chat-ticket{
padding:15px;
cursor:pointer;
border-bottom:1px solid #f1f5f9;
}

.agent-chat-ticket:hover{
background:#f8fafc;
}

.agent-chat-ticket.active{
background:#dbeafe;
}

.agent-chat-window{
flex:1;
display:flex;
flex-direction:column;
}

.agent-chat-header{
padding:18px;
border-bottom:1px solid #e5e7eb;
font-weight:600;
}

.agent-chat-messages{
flex:1;
padding:20px;
overflow-y:auto;
background:#f8fafc;
}

.agent-msg{
max-width:70%;
padding:12px;
border-radius:12px;
margin-bottom:10px;
}

.agent-msg.customer{
background:white;
}

.agent-msg.agent{
background:#dcfce7;
margin-left:auto;
}

.agent-chat-input{
display:flex;
padding:15px;
border-top:1px solid #e5e7eb;
gap:10px;
}

.agent-chat-input textarea{
flex:1;
padding:10px;
border:1px solid #d1d5db;
border-radius:10px;
}

.agent-chat-input button{
background:#2563eb;
color:white;
border:none;
padding:10px 20px;
border-radius:10px;
cursor:pointer;
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
              text="AI Suggestions"
              icon={<FaRobot />}
              active={activePage === "ai"}
              onClick={() => setActivePage("ai")}
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
                    <strong>Support Agent</strong>
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

{tickets.map((ticket)=>(

<div
key={ticket._id}
onClick={() => openChat(ticket)}
className={`agent-chat-ticket ${
selectedTicket?._id===ticket._id
? "active"
: ""
}`}
>

<strong>
{ticket.customerName}
</strong>

<p>
{ticket.issue}
</p>

</div>

))}

</div>

<div className="agent-chat-window">

{selectedTicket ? (
<>

<div className="agent-chat-header">

{selectedTicket.customerName}

</div>

<div className="agent-chat-messages">

{messages.map((msg,index)=>(

<div
key={index}
className={`agent-msg ${
msg.sender==="Agent"
? "agent"
: "customer"
}`}
>

{msg.message}

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

<button
onClick={sendReply}
>
Send
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
{activePage !== "dashboard" &&
 activePage !== "messages" && (
  <section className="agent-card">
    <h3>
      {activePage.charAt(0).toUpperCase() +
       activePage.slice(1)} Channel
    </h3>

    <p>
      This interface view module is currently rendering active data buffers.
    </p>
  </section>
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