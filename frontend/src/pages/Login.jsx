import Register from "./Register";
import React, {
  useState,
} from "react";
import {
  FaTicketAlt,
  FaHeadset,
  FaRobot,
  FaEnvelope,
  FaChartLine,
} from "react-icons/fa";

import axios from "axios";

const Login = () => {
  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");
  const [
  showRegister,
  setShowRegister,
] = useState(false);

  const handleLogin =
    async () => {
      try {
        const response =
          await axios.post(
            "https://customer-support-ticket-bot.onrender.com/auth/login",
            {
              email,
              password,
            }
          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        window.location.href =
          "/";
      } catch (error) {
        alert(
          "Invalid Credentials"
        );
      }
    };
if (showRegister) {
  return <Register />;
}

return (
  <div className="auth-page">

    {/* Floating Icons */}
    <FaTicketAlt
      className="floating-icon"
      style={{
        left: "10%",
        fontSize: "45px",
        animationDelay: "0s",
      }}
    />

    <FaHeadset
      className="floating-icon"
      style={{
        left: "25%",
        fontSize: "55px",
        animationDelay: "2s",
      }}
    />

    <FaRobot
      className="floating-icon"
      style={{
        left: "45%",
        fontSize: "65px",
        animationDelay: "4s",
      }}
    />

    <FaEnvelope
      className="floating-icon"
      style={{
        left: "70%",
        fontSize: "50px",
        animationDelay: "6s",
      }}
    />

    <FaChartLine
      className="floating-icon"
      style={{
        left: "90%",
        fontSize: "55px",
        animationDelay: "8s",
      }}
    />

    {/* Login Card */}
    <div className="auth-card">

      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            color: "white",
            marginBottom: "10px",
          }}
        >
          AI Support Operations Center
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Automating customer support with AI,
          analytics and workflow automation.
        </p>
      </div>

      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="auth-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="auth-input"
      />

      <button
        onClick={handleLogin}
        className="auth-btn"
      >
        Login
      </button>

      <p
        className="register-link"
        onClick={() =>
          setShowRegister(true)
        }
      >
        Create New Account
      </p>
    </div>
  </div>
);
};

  
export default Login;