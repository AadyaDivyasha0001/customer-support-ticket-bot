import React, { useState } from "react";
import axios from "axios";
import {
  FaTicketAlt,
  FaHeadset,
  FaRobot,
  FaEnvelope,
  FaChartLine,
} from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(
        "Registration Successful! Please Login."
      );

      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

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

      {/* Register Card */}
      <div className="auth-card">

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "white",
              marginBottom: "10px",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "30px",
            }}
          >
            Join SupportDesk AI and start managing
            customer support intelligently.
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="auth-input"
        />

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
          onClick={handleRegister}
          className="auth-btn"
        >
          Register
        </button>

        <p
          className="register-link"
          onClick={() =>
            window.location.reload()
          }
        >
          Back to Login
        </p>

      </div>
    </div>
  );
};

export default Register;