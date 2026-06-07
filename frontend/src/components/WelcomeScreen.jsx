import { useEffect, useState } from "react";

function WelcomeScreen({ onFinish }) {
  const [showAbout, setShowAbout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 18000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">
          SupportDesk AI
        </h1>

        <p className="welcome-tagline">
          Where AI Meets Customer Experience.
        </p>

        {/* Stats */}
        <div className="welcome-stats">
          <div className="stat-card">
            <h2>1,247</h2>
            <p>Tickets Processed</p>
          </div>

          <div className="stat-card">
            <h2>96%</h2>
            <p>Resolution Rate</p>
          </div>

          <div className="stat-card">
            <h2>12</h2>
            <p>Support Agents</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>AI Monitoring</p>
          </div>
        </div>
        <div className="about-button-container">
  <button
    className="about-btn"
    onClick={() => setShowAbout(true)}
  >
    Learn More About SupportDesk AI
  </button>
</div>   
        {/* Loading */}
        <div className="loading-section">
          <h3>Preparing Workspace...</h3>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <p>Loading customer insights...</p>
        </div>
        {showAbout && (
  <div
    className="about-modal-overlay"
    onClick={() => setShowAbout(false)}
  >
    <div
      className="about-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setShowAbout(false)}
      >
        ✕
      </button>

      <h2>About SupportDesk AI</h2>

      <p>
        SupportDesk AI is an intelligent customer support automation
        platform designed to transform how organizations manage
        customer interactions.
      </p>

      <h3>Our Mission</h3>

      <p>
        To simplify customer support operations through intelligent
        automation while enabling support teams to focus on what
        matters most—delivering outstanding customer experiences.
      </p>

      <h3>Core Capabilities</h3>

      <ul>
        <li>✓ AI Ticket Classification</li>
        <li>✓ Smart Agent Assignment</li>
        <li>✓ Priority Detection</li>
        <li>✓ Workflow Automation</li>
        <li>✓ Customer Analytics</li>
        <li>✓ Sentiment Analysis</li>
        <li>✓ Resolution Tracking</li>
        <li>✓ Real-Time Reporting</li>
      </ul>

      <h3>How Customer Support Ticket Automation Works</h3>

      <ol>
        <li>Customer submits a support request.</li>
        <li>AI analyzes and classifies the ticket.</li>
        <li>Priority is automatically detected.</li>
        <li>Ticket is assigned to the best available agent.</li>
        <li>Automated workflows handle repetitive tasks.</li>
        <li>Agents resolve customer issues faster.</li>
        <li>Analytics track performance and outcomes.</li>
      </ol>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default WelcomeScreen;