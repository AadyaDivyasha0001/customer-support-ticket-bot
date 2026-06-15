import { useState } from "react";
import axios from "axios";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [department, setDepartment] =
    useState("Technical");

  const submitTicket = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "https://customer-support-ticket-bot.onrender.com/tickets",
        {
          title,
          description,
          priority,
          department,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Ticket Created Successfully"
      );

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);

      alert(
        "Failed to create ticket"
      );
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
      }}
    >
      <h2>Create Ticket</h2>

      <input
        type="text"
        placeholder="Issue Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
        }}
      />

      <textarea
        placeholder="Describe your issue"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: "150px",
          padding: "12px",
          marginTop: "15px",
        }}
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
        }}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        value={department}
        onChange={(e) =>
          setDepartment(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
        }}
      >
        <option>Technical</option>
        <option>Billing</option>
        <option>Support</option>
      </select>

      <button
        onClick={submitTicket}
        style={{
          marginTop: "20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
        }}
      >
        Submit Ticket
      </button>
    </div>
  );
};

export default CreateTicket;