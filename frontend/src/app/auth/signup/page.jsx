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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!email.includes("@")) return "Email must contain @ symbol.";
    if (!email.includes(".edu")) return "Email must be a valid .edu domain.";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate on change
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "email") {
      const error = validateEmail(value);
      if (error) {
        newErrors.email = error;
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      const error = validatePassword(value);
      if (error) {
        newErrors.password = error;
      } else {
        delete newErrors.password;
      }
    }

    if (name === "name" && !value.trim()) {
      newErrors.name = "Name is required.";
    } else if (name === "name") {
      delete newErrors.name;
    }

    if (name === "collegeName" && !value.trim()) {
      newErrors.collegeName = "College name is required.";
    } else if (name === "collegeName") {
      delete newErrors.collegeName;
    }

    setErrors(newErrors);
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

  const handleSignup = async (e) => {
    e?.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(form).forEach((key) => {
      if (key !== "avatar" && key !== "interests" && key !== "skills") {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    // Validate all required fields
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }
    
    const emailError = validateEmail(form.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (!form.collegeName.trim()) {
      newErrors.collegeName = "College name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Signup Successful!");
      } else {
        setErrors({ submit: data.error || "Signup failed. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection." });
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Signup</h2>

      <div>
        <input
          name="name"
          type="text"
          placeholder="Full Name *"
          className={`auth-input ${touched.name && errors.name ? "auth-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.name && errors.name && (
          <div className="auth-error">{errors.name}</div>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email (.edu domain) *"
          className={`auth-input ${touched.email && errors.email ? "auth-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.email && errors.email && (
          <div className="auth-error">{errors.email}</div>
        )}
        {!errors.email && form.email && (
          <div className="auth-hint">
            Make sure your email ends with .edu domain
          </div>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters) *"
          className={`auth-input ${touched.password && errors.password ? "auth-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.password && errors.password && (
          <div className="auth-error">{errors.password}</div>
        )}
        {!errors.password && form.password && form.password.length < 8 && (
          <div className="auth-warning">
            Password must be at least 8 characters long
          </div>
        )}
      </div>

      <div>
        <input
          name="collegeName"
          type="text"
          placeholder="College Name *"
          className={`auth-input ${touched.collegeName && errors.collegeName ? "auth-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.collegeName && errors.collegeName && (
          <div className="auth-error">{errors.collegeName}</div>
        )}
      </div>
      <input
        name="rollNumber"
        type="text"
        placeholder="Roll Number"
        className="auth-input"
        onChange={handleChange}
      />

      <input
        name="year"
        type="number"
        placeholder="Year"
        className="auth-input"
        onChange={handleChange}
      />

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

      {errors.submit && (
        <div className="auth-error auth-error-submit">{errors.submit}</div>
      )}

      <button className="auth-btn" onClick={handleSignup}>
        Create Account
      </button>

      <p className="auth-link">
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
