import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const passwordRules = [
    { label: "Uppercase letter", regex: /[A-Z]/ },
    { label: "Lowercase letter", regex: /[a-z]/ },
    { label: "Number", regex: /[0-9]/ },
    { label: "Special character", regex: /[@$!%*?&]/ },
    { label: "Minimum 8 characters", regex: /.{8,}/ },
  ];

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [ruleStatus, setRuleStatus] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password rule checker
  const checkPasswordRules = (password) => {
    const status = {};

    passwordRules.forEach((rule) => {
      status[rule.label] = rule.regex.test(password);
    });

    setRuleStatus(status);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});

    if (name === "password") {
      checkPasswordRules(value);
    }
  };

  const passwordValid = Object.values(ruleStatus).every(Boolean);

  const handleSubmit = async () => {
    if (
      !form.username ||
      !form.email ||
      !form.bio ||
      !form.phone ||
      !form.password ||
      !form.password2
    ) {
      setErrors({
        non_field_errors: ["Please fill all required fields"],
      });
      return;
    }

    if (!passwordValid) {
      setErrors({
        password: ["Password does not meet requirements"],
      });
      return;
    }

    if (form.password !== form.password2) {
      setErrors({
        password2: ["Passwords do not match"],
      });
      return;
    }

    const res = await fetch(`${API_BASE}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data);
      return;
    }

    setMessage("✅ Verify your mail. Please check your inbox.");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Sign Up</h2>

        {errors.non_field_errors && (
          <p style={{ color: "red" }}>{errors.non_field_errors[0]}</p>
        )}

        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          className="input"
          type="text"
          placeholder="Username *"
          name="username"
          onChange={handleChange}
        />
        {errors.username && (
          <p style={{ color: "red" }}>{errors.username[0]}</p>
        )}

        <input
          className="input"
          type="email"
          placeholder="Email *"
          name="email"
          onChange={handleChange}
        />
        {errors.email && (
          <p style={{ color: "red" }}>{errors.email[0]}</p>
        )}

        <input
          className="input"
          type="text"
          placeholder="Phone"
          name="phone"
          onChange={handleChange}
        />

        <input
          className="input"
          type="text"
          placeholder="Bio"
          name="bio"
          onChange={handleChange}
        />

        {/* Password input */}
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            name="password"
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
        </div>

        {/* Password checklist */}
        {form.password && !passwordValid && (
          <div style={{ fontSize: "14px", marginTop: "8px" }}>
            {passwordRules.map((rule) => (
              <p
                key={rule.label}
                style={{
                  color: ruleStatus[rule.label] ? "green" : "red",
                  margin: "2px 0",
                }}
              >
                {ruleStatus[rule.label] ? "✅" : "❌"} {rule.label}
              </p>
            ))}
          </div>
        )}

        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password *"
          name="password2"
          onChange={handleChange}
        />

        {errors.password2 && (
          <p style={{ color: "red" }}>{errors.password2[0]}</p>
        )}

        <button className="button" onClick={handleSubmit}>
          Create Account
        </button>

        <div className="link">
          Already have account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}