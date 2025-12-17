"use client";

import Link from "next/link";
import "../auth.css";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    rollNumber: "",
    year: "",
    department: "",
    bio: "",
    interests: [],
    skills: [],
    avatar: null,
  });

  const [currentInterest, setCurrentInterest] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addInterest = (e) => {
    if (e.key === "Enter" && currentInterest.trim() !== "") {
      setForm({
        ...form,
        interests: [...form.interests, currentInterest.trim()],
      });
      setCurrentInterest("");
    }
  };

  const removeInterest = (index) => {
    setForm({
      ...form,
      interests: form.interests.filter((_, i) => i !== index),
    });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && currentSkill.trim() !== "") {
      setForm({
        ...form,
        skills: [...form.skills, currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (index) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  };

  const handleSignup = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "avatar") {
        if (form.avatar) formData.append("avatar", form.avatar);
      } else if (Array.isArray(form[key])) {
        form[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, form[key]);
      }
    });

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.success ? "Signup Successful!" : data.error);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Signup</h2>

      <input name="name" type="text" placeholder="Full Name" className="auth-input" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} />

      <input name="collegeName" type="text" placeholder="College Name" className="auth-input" onChange={handleChange} />
      <input name="rollNumber" type="text" placeholder="Roll Number" className="auth-input" onChange={handleChange} />

      <input name="year" type="number" placeholder="Year" className="auth-input" onChange={handleChange} />

      <label className="auth-label">Department</label>
      <select name="department" className="auth-input" onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="MECH">MECH</option>
        <option value="CIVIL">CIVIL</option>
      </select>

      <label className="auth-label">Bio</label>
      <textarea
        name="bio"
        placeholder="Write a short bio..."
        className="auth-input"
        style={{ height: "70px" }}
        onChange={handleChange}
      />

      <label className="auth-label">Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        className="auth-input"
        onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
      />

      <label className="auth-label">Interests</label>
      <div className="tag-container">
        {form.interests.map((item, index) => (
          <span key={index} className="tag">
            {item}
            <button onClick={() => removeInterest(index)}>x</button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Type interest & press Enter"
          value={currentInterest}
          onChange={(e) => setCurrentInterest(e.target.value)}
          onKeyDown={addInterest}
        />
      </div>

      <label className="auth-label">Skills</label>
      <div className="tag-container">
        {form.skills.map((item, index) => (
          <span key={index} className="tag">
            {item}
            <button onClick={() => removeSkill(index)}>x</button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Type skill & press Enter"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={addSkill}
        />
      </div>

      <button className="auth-btn" onClick={handleSignup}>Create Account</button>

      <p className="auth-link">
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
