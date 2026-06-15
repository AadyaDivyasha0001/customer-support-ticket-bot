import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
const [role, setRole] = useState("Customer");
  const handleRegister = async () => {
    try {
      await axios.post(
        "https://customer-support-ticket-bot.onrender.com/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      toast.success(
  "Registration successful!"
);
       setTimeout(() => {
      window.location.href = "/";
    },1500);
}
    catch (error) {

  const message =
    error.response?.data?.message;

  if (
    message?.includes(
      "enum value"
    )
  ) {
    toast.error(
      "Selected account type is invalid."
    );
  }

  else if (
    message?.includes(
      "already exists"
    )
  ) {
    toast.warning(
      "Email already registered."
    );
  }

  else {
    toast.error(
      "Registration failed. Please try again."
    );
  }
}
  };

  return (
    <div className="auth-page">

      {/* Floating Icons */}
      

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
        <select
  value={role}
  onChange={(e) =>
    setRole(e.target.value)
  }
  className="auth-input"
>
  <option value="Customer">
    Customer
  </option>

  <option value="Agent">
    Agent
  </option>

  <option value="Admin">
    Admin
  </option>
</select>

        <button
          onClick={handleRegister}
          className="auth-primary-btn"
        >
          Register
        </button>

        <button
  type="button"
  className="auth-secondary-btn"
  onClick={() => setIsLogin(true)}
>
  Back to Login
</button>
      </div>
    </div>
  );
};

export default Register;