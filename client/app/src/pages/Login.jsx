import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail);
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/home");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          className="input"
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />

        <div style={{ position: "relative" }}>
        <input
          className="input"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
              position: "absolute",
              right: 10,
              top: 8,
              cursor: "pointer",
            }}
        >
          👁
        </span>
        <button className="button" onClick={handleSubmit}> Login </button>
      </div>

        <div className="link">
          Don’t have account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}