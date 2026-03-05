import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {

    try {

      const data = await loginUser(email, password);

      console.log("LOGIN RESPONSE:", data);

      if (data && data.token) {

        // store token
        localStorage.setItem("token", data.token);

        setMessage("Login successful 🚀");

        // redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);

      } else {
        setMessage("Invalid email or password ❌");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage("Server error. Check backend ⚠️");
    }

  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#111"
    }}>

      <div style={{
        background: "#1e1e1e",
        padding: "40px",
        borderRadius: "10px",
        width: "320px",
        color: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)"
      }}>

        <h2 style={{marginBottom:"20px"}}>AI SaaS Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius:"6px",
            border:"none"
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius:"6px",
            border:"none"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius:"6px",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          Login
        </button>

        <p style={{marginTop:"15px", color:"#aaa"}}>
          {message}
        </p>

      </div>

    </div>
  );
}