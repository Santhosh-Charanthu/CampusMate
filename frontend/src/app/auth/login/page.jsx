"use client";
import Link from "next/link";
import "../auth.css";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>

      <input name="email" type="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} className="auth-input" />
      <input name="password" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} className="auth-input" />

      <button className="auth-btn" onClick={handleLogin}>Login</button>

      <p className="auth-link">
        Don’t have an account? <Link href="/auth/signup">Signup</Link>
      </p>
    </div>
  );
}
