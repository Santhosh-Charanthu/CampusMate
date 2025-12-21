"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "../auth.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    collegeName: "",
    rollNumber: "",
    year: "",
    department: "",
    bio: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [mockOtp, setMockOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    if (!formData.email) {
      setOtpError("Please enter your email first");
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setOtpSent(true);
    setOtpError("");
    setOtpSuccess(`OTP sent to ${formData.email}! (Mock OTP: ${generatedOtp})`);
    setCountdown(60);
    setEnteredOtp("");
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === mockOtp) {
      setOtpVerified(true);
      setOtpSuccess("Email verified successfully!");
      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Please try again.");
      setOtpSuccess("");
    }
  };

  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

  const predefinedInterests = [
    { name: "Software Development", color: "#FF6B6B" },
    { name: "Competitive Programming", color: "#4ECDC4" },
    { name: "Machine Learning", color: "#CE93D8" },
    { name: "AI Research", color: "#9575CD" },
    { name: "Web Development", color: "#A29BFE" },
    { name: "App Development", color: "#6C5CE7" },
    { name: "Robotics", color: "#E57373" },
    { name: "Drone Technology", color: "#81D4FA" },
    { name: "Aerospace", color: "#7986CB" },
    { name: "Data Science", color: "#80CBC4" },
    { name: "Cyber Security", color: "#EF5350" },
    { name: "Startups & Entrepreneurship", color: "#FFA726" },
    { name: "UI/UX Design", color: "#F48FB1" },
    { name: "Open Source", color: "#81C784" },
    { name: "Hackathons", color: "#FFD93D" },
    { name: "Placements & Internships", color: "#90CAF9" },
    { name: "Higher Studies", color: "#B39DDB" },
    { name: "Research & Publications", color: "#80CBC4" },
  ];

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchInput, setSkillSearchInput] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillInputRef = useRef(null);
  const [skillDropdownDirection, setSkillDropdownDirection] = useState("down");

  const predefinedSkills = {
    "Programming & CS": [
      { name: "Java", color: "#FF6B6B" },
      { name: "Python", color: "#4ECDC4" },
      { name: "C", color: "#45B7D1" },
      { name: "C++", color: "#96CEB4" },
      { name: "JavaScript", color: "#FFEAA7" },
      { name: "TypeScript", color: "#74B9FF" },
    ],
    "Web & App": [
      { name: "React", color: "#A29BFE" },
      { name: "Next.js", color: "#6C5CE7" },
      { name: "Node.js", color: "#81C784" },
      { name: "Express", color: "#FFD93D" },
      { name: "HTML", color: "#FF8A80" },
      { name: "CSS", color: "#82B1FF" },
    ],
    "AI / Data": [
      { name: "Machine Learning", color: "#CE93D8" },
      { name: "Deep Learning", color: "#9575CD" },
      { name: "Artificial Intelligence", color: "#B39DDB" },
      { name: "Data Science", color: "#80CBC4" },
      { name: "Computer Vision", color: "#90CAF9" },
      { name: "NLP", color: "#F48FB1" },
    ],
    "Core / Engineering": [
      { name: "CAD", color: "#FFB74D" },
      { name: "AutoCAD", color: "#FF8A65" },
      { name: "SolidWorks", color: "#A1887F" },
      { name: "Drone Technology", color: "#81D4FA" },
      { name: "Robotics", color: "#E57373" },
      { name: "Embedded Systems", color: "#AED581" },
      { name: "IoT", color: "#4DB6AC" },
      { name: "Aerospace Engineering", color: "#7986CB" },
    ],
    "Other Tech": [
      { name: "Cyber Security", color: "#EF5350" },
      { name: "Cloud Computing", color: "#42A5F5" },
      { name: "DevOps", color: "#66BB6A" },
      { name: "Blockchain", color: "#FFA726" },
    ],
  };

  const allSkills = Object.values(predefinedSkills).flat();

  const [fileName, setFileName] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        return "";
      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today)
          return "Date of birth cannot be in the future";
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();
        const actualAge =
          monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        if (actualAge < 16) return "You must be at least 16 years old";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "collegeName":
        if (!value.trim()) return "College name is required";
        return "";
      case "rollNumber":
        if (!value.trim()) return "Roll number is required";
        return "";
      case "year":
        if (!value) return "Please select your year";
        return "";
      case "department":
        if (!value) return "Please select your department";
        return "";
      case "bio":
        if (!value.trim()) return "Bio is required";
        if (value.trim().length < 20)
          return "Bio must be at least 20 characters";
        return "";
      default:
        return "";
    }
  };

  const validateAllFields = () => {
    const newErrors = {};

    newErrors.fullName = validateField("fullName", formData.fullName);
    newErrors.dateOfBirth = validateField("dateOfBirth", formData.dateOfBirth);
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);
    newErrors.collegeName = validateField("collegeName", formData.collegeName);
    newErrors.rollNumber = validateField("rollNumber", formData.rollNumber);
    newErrors.year = validateField("year", formData.year);
    newErrors.department = validateField("department", formData.department);
    newErrors.bio = validateField("bio", formData.bio);

    if (!formData.profilePicture) {
      newErrors.profilePicture = "Profile picture is required";
    }

    if (!otpVerified) {
      newErrors.emailVerification = "Please verify your email";
    }

    if (interests.length === 0) {
      newErrors.interests = "Please select at least 1 interest";
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = "Please select at least 1 skill";
    }

    return newErrors;
  };

  const isFormValid = () => {
    const validationErrors = validateAllFields();
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });
      setFileName(file.name);
      setErrors((prev) => ({ ...prev, profilePicture: "" }));
      setTouched((prev) => ({ ...prev, profilePicture: true }));
    }
  };

  const handleInterestInputChange = (e) => {
    setInterestInput(e.target.value);
    setShowInterestSuggestions(e.target.value.length > 0);
  };

  const filteredInterests = predefinedInterests.filter(
    (interest) =>
      interest.name.toLowerCase().includes(interestInput.toLowerCase()) &&
      !interests.some((i) => i.name === interest.name)
  );

  const addInterest = (interest) => {
    if (!interests.some((i) => i.name === interest.name)) {
      setInterests([...interests, interest]);
      setErrors((prev) => ({ ...prev, interests: "" }));
    }
    setInterestInput("");
    setShowInterestSuggestions(false);
  };

  const removeInterest = (indexToRemove) => {
    const newInterests = interests.filter(
      (_, index) => index !== indexToRemove
    );
    setInterests(newInterests);
    if (newInterests.length === 0 && touched.interests) {
      setErrors((prev) => ({
        ...prev,
        interests: "Please select at least 1 interest",
      }));
    }
  };

  const handleSkillSearchChange = (e) => {
    setSkillSearchInput(e.target.value);
    setShowSkillDropdown(true);
    checkDropdownPosition();
  };

  const checkDropdownPosition = () => {
    if (skillInputRef.current) {
      const rect = skillInputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240; // max-height of dropdown

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setSkillDropdownDirection("up");
      } else {
        setSkillDropdownDirection("down");
      }
    }
  };

  const handleSkillFocus = () => {
    setShowSkillDropdown(true);
    checkDropdownPosition();
  };

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(skillSearchInput.toLowerCase()) &&
      !selectedSkills.some((s) => s.name === skill.name)
  );

  const addSkill = (skill) => {
    if (!selectedSkills.some((s) => s.name === skill.name)) {
      setSelectedSkills([...selectedSkills, skill]);
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
    setSkillSearchInput("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = selectedSkills.filter(
      (s) => s.name !== skillToRemove.name
    );
    setSelectedSkills(newSkills);
    if (newSkills.length === 0 && touched.skills) {
      setErrors((prev) => ({
        ...prev,
        skills: "Please select at least 1 skill",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      dateOfBirth: true,
      email: true,
      password: true,
      collegeName: true,
      rollNumber: true,
      year: true,
      department: true,
      bio: true,
      profilePicture: true,
      interests: true,
      skills: true,
    });

    const validationErrors = validateAllFields();
    setErrors(validationErrors);

    if (!isFormValid()) {
      return;
    }

    const completeData = {
      ...formData,
      interests: interests.map((i) => i.name),
      skills: selectedSkills.map((s) => s.name),
    };
    console.log("Signup form submitted:", completeData);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup initiated");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>CampusConnect</h1>
          <p>Join the campus community</p>
        </div>

        <button className="oauth-button" onClick={handleGoogleSignup}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
            />
            {touched.fullName && errors.fullName && (
              <div className="field-error">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              max={new Date().toISOString().split("T")[0]}
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <div className="field-error">{errors.dateOfBirth}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <div className="email-otp-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@college.edu"
                disabled={otpVerified}
                className={otpVerified ? "verified-input" : ""}
              />
              {otpVerified && (
                <span className="verified-badge">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            {touched.email && errors.email && !otpVerified && (
              <div className="field-error">{errors.email}</div>
            )}

            {!otpVerified && (
              <button
                type="button"
                className="send-otp-button"
                onClick={handleSendOtp}
                disabled={countdown > 0 || !formData.email}
              >
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
              </button>
            )}

            {otpSuccess && <div className="otp-success">{otpSuccess}</div>}
            {otpError && <div className="otp-error">{otpError}</div>}

            {otpSent && !otpVerified && (
              <div className="otp-input-section">
                <label htmlFor="otp">Enter 6-digit OTP</label>
                <div className="otp-verify-wrapper">
                  <input
                    type="text"
                    id="otp"
                    value={enteredOtp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setEnteredOtp(value);
                      setOtpError("");
                    }}
                    placeholder="000000"
                    maxLength="6"
                    className="otp-input"
                  />
                  <button
                    type="button"
                    className="verify-otp-button"
                    onClick={handleVerifyOtp}
                    disabled={enteredOtp.length !== 6}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
            {touched.email && errors.emailVerification && (
              <div className="field-error">{errors.emailVerification}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a strong password"
            />
            {touched.password && errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="collegeName">College Name *</label>
            <input
              type="text"
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MIT, Stanford, etc."
            />
            {touched.collegeName && errors.collegeName && (
              <div className="field-error">{errors.collegeName}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number *</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="2021CS001"
              />
              {touched.rollNumber && errors.rollNumber && (
                <div className="field-error">{errors.rollNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label>Year *</label>
              <div className="pill-selector">
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                  (year) => (
                    <button
                      key={year}
                      type="button"
                      className={`year-pill ${
                        formData.year === year ? "selected" : ""
                      }`}
                      onClick={() => {
                        setFormData({ ...formData, year });
                        setTouched((prev) => ({ ...prev, year: true }));
                        setErrors((prev) => ({ ...prev, year: "" }));
                      }}
                    >
                      {year}
                    </button>
                  )
                )}
              </div>
              {touched.year && errors.year && (
                <div className="field-error">{errors.year}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Branch / Department *</label>
            <div className="department-pills">
              {[
                { code: "CSE", name: "CSE", color: "#A8D5FF" },
                { code: "IT", name: "IT", color: "#B5E7A0" },
                { code: "AIML", name: "AIML", color: "#E7BCFF" },
                { code: "AIDS", name: "AIDS", color: "#D5C7FF" },
                { code: "ECE", name: "ECE", color: "#FFD4B5" },
                { code: "MECH", name: "MECH", color: "#FFE5B5" },
                { code: "CIVIL", name: "CIVIL", color: "#FFCCCC" },
              ].map((dept) => (
                <button
                  key={dept.code}
                  type="button"
                  className={`department-pill ${
                    formData.department === dept.code ? "selected" : ""
                  }`}
                  style={{ "--dept-color": dept.color }}
                  onClick={() => {
                    setFormData({ ...formData, department: dept.code });
                    setTouched((prev) => ({ ...prev, department: true }));
                    setErrors((prev) => ({ ...prev, department: "" }));
                  }}
                >
                  {dept.name}
                </button>
              ))}
            </div>
            {touched.department && errors.department && (
              <div className="field-error">{errors.department}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio * (minimum 20 characters)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell us about yourself..."
              rows="3"
            />
            {touched.bio && errors.bio && (
              <div className="field-error">{errors.bio}</div>
            )}
          </div>

          <div className="form-group">
            <label>Profile Picture *</label>
            <div className="file-input-wrapper">
              <label htmlFor="profilePicture" className="file-input-label">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {fileName || "Upload profile picture"}
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {fileName && <div className="file-name">Selected: {fileName}</div>}
            {touched.profilePicture && errors.profilePicture && (
              <div className="field-error">{errors.profilePicture}</div>
            )}
          </div>

          <div className="form-group">
            <label>Interests *</label>
            <p className="skills-subtitle">
              Areas you want to grow in or are passionate about
            </p>

            {interests.length > 0 && (
              <div className="selected-tags-display">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="selected-tag-pill"
                    style={{ "--tag-color": interest.color }}
                  >
                    {interest.name}
                    <button
                      type="button"
                      className="tag-pill-remove"
                      onClick={() => removeInterest(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="searchable-input-wrapper">
              <input
                type="text"
                className="searchable-input"
                value={interestInput}
                onChange={handleInterestInputChange}
                onFocus={() => {
                  setShowInterestSuggestions(interestInput.length > 0);
                  setTouched((prev) => ({ ...prev, interests: true }));
                }}
                placeholder="Search or select interests Ex:Web-dev,Robotics,Hackathons"
              />
              {showInterestSuggestions && filteredInterests.length > 0 && (
                <div className="suggestions-dropdown">
                  {filteredInterests.map((interest) => (
                    <button
                      key={interest.name}
                      type="button"
                      className="suggestion-item"
                      style={{ "--tag-color": interest.color }}
                      onClick={() => addInterest(interest)}
                    >
                      {interest.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {touched.interests && errors.interests && (
              <div className="field-error">{errors.interests}</div>
            )}
          </div>

          <div className="form-group">
            <label>Skills *</label>
            <p className="skills-subtitle">Select the skills you have</p>

            {selectedSkills.length > 0 && (
              <div className="selected-tags-display">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill.name}
                    className="selected-tag-pill"
                    style={{ "--tag-color": skill.color }}
                  >
                    {skill.name}
                    <button
                      type="button"
                      className="tag-pill-remove"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="searchable-input-wrapper" ref={skillInputRef}>
              <input
                type="text"
                className="searchable-input"
                value={skillSearchInput}
                onChange={handleSkillSearchChange}
                onFocus={() => {
                  handleSkillFocus();
                  setTouched((prev) => ({ ...prev, skills: true }));
                }}
                placeholder=" Search or select skills  "
              />
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div
                  className={`suggestions-dropdown ${
                    skillDropdownDirection === "up" ? "dropdown-up" : ""
                  }`}
                >
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill.name}
                      type="button"
                      className="suggestion-item"
                      style={{ "--tag-color": skill.color }}
                      onClick={() => addSkill(skill)}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {touched.skills && errors.skills && (
              <div className="field-error">{errors.skills}</div>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid()}
          >
            {isFormValid() ? "Create Account" : "Complete All Required Fields"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/auth/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
