import { useEffect, useState } from "react";
import API_BASE from "../api.js";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={styles.page}>

      <div style={styles.navbar}>
        <h2 style={{ color: "white" }}>MyApp</h2>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.container}>

        <div style={styles.card}>
          <h1 style={{ marginBottom: "15px" }}>👋 Welcome</h1>
          <p>You are logged in successfully.</p>
        </div>

        <div style={styles.profileCard}>
          <h2 style={{ marginBottom: "15px" }}>Your Profile</h2>

          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "-"}</p>
          <p><strong>Bio:</strong> {user.bio || "-"}</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    marginBottom: "25px"
  },

  profileCard: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
  }
};