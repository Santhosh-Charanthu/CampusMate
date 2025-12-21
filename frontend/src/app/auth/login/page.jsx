"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import "../auth.css";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ stops page reload

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      console.log("Logged in user:", data.user);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="auth-btn">
          Login
        </button>

        <p className="auth-link">
          Don’t have an account? <Link href="/auth/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
