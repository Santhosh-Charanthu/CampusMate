"use client";
import Link from "next/link";
import "../auth.css";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name === "email" ? "Email" : "Password"} is required.`,
      }));
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (data.success || data.token) {
        // Handle successful login
        console.log("Login successful");
      } else {
        setErrors({ submit: data.error || "Invalid email or password." });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection." });
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${
            touched.email && errors.email ? "auth-input-error" : ""
          }`}
          required
        />
        {touched.email && errors.email && (
          <div className="auth-error">{errors.email}</div>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password *"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`auth-input ${
            touched.password && errors.password ? "auth-input-error" : ""
          }`}
          required
        />
        {touched.password && errors.password && (
          <div className="auth-error">{errors.password}</div>
        )}
      </div>

      {errors.submit && (
        <div className="auth-error auth-error-submit">{errors.submit}</div>
      )}

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <p className="auth-link">
        Don’t have an account? <Link href="/auth/signup">Signup</Link>
      </p>
    </div>
  );
}
