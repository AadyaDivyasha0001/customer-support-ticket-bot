import "./App.css";
import { useState } from "react";
import AgentDashboard from "./pages/AgentDashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Tickets from "./pages/Tickets";
import Customers from "./pages/Customers";
import Agents from "./pages/Agents";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import WelcomeScreen from "./components/WelcomeScreen";

import {
  FaTicketAlt,
  FaHeadset,
  FaEnvelope,
  FaRobot,
  FaComments,
} from "react-icons/fa";

function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const token =
    localStorage.getItem(
      "token"
    );
    const user = JSON.parse(
  localStorage.getItem("user")
);

const role = user?.role;
    const [showWelcome, setShowWelcome] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case "tickets":
        return <Tickets />;

      case "customers":
        return <Customers />;

      case "agents":
        return <Agents />;

      case "analytics":
        return <Analytics />;

      default:
        return <Dashboard />;
    }
  };

  if (!token) {
    return <Login />;
  }
  if (role === "Customer") {
  return <CustomerDashboard />;

  if (role === "Agent") {
  return <AgentDashboard />;
  }
}
  if (showWelcome) {
  return (
    <WelcomeScreen
      onFinish={() => setShowWelcome(false)}
    />
  );
}

  return (
    <>
      {/* Floating Background Icons */}
      <div className="floating-bg">

        <FaTicketAlt
          className="float-icon icon1"
        />

        <FaHeadset
          className="float-icon icon2"
        />

        <FaEnvelope
          className="float-icon icon3"
        />

        <FaRobot
          className="float-icon icon4"
        />

        <FaComments
          className="float-icon icon5"
        />

      </div>

      {/* Main Layout */}
      <div className="app-layout">

        <Sidebar
          activePage={activePage}
          setActivePage={
            setActivePage
          }
        />

        <div className="main-section">

          <Header
  activePage={activePage}
  setActivePage={setActivePage}
/>

          <div className="page-content">
            {renderPage()}
          </div>

        </div>

      </div>
      <ToastContainer
  position="top-right"
  autoClose={3000}
  theme="dark"
/>
    </>
  );
}

export default App;