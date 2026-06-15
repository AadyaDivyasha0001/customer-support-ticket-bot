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
  const [loginRole, setLoginRole] =
  useState("Admin");
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

        if (
  response.data.user.role !==
  loginRole
) {
  alert(
    `This account is registered as ${response.data.user.role}`
  );
  return;
}

localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(
    response.data.user
  )
);
    const role = 
    response.data.user.role; 
    if ( 
        role === "Customer"
     ) {
        window.location.href =
          "/";
     }
     else if(
        role ==="Agent"
     ){
        window.location.href = 
        "/";
     }
     else if (
        role === "Admin"
     ){
        window.location.href = 
        "/";
     }
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
<select
  value={loginRole}
  onChange={(e) =>
    setLoginRole(e.target.value)
  }
  className="auth-input"
>
  <option value="Admin">
    Admin
  </option>

  <option value="Agent">
    Agent
  </option>

  <option value="Customer">
    Customer
  </option>
</select>
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

     <button
  type="button"
  className="auth-secondary-btn"
  onClick={() => setIsLogin(false)}
>
  Create New Account
</button>
    </div>
  </div>
);
};

  
export default Login;