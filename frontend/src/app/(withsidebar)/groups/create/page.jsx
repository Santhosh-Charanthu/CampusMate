"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./create-group.module.css";

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "club",
    type: "public",
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 500;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Group name is required.";
      } else if (value.length > MAX_NAME_LENGTH) {
        newErrors.name = `Group name cannot exceed ${MAX_NAME_LENGTH} characters.`;
      } else {
        delete newErrors.name;
      }
    }

    if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    } else if (name === "description") {
      delete newErrors.description;
    }

    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newErrors = { ...errors };
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        newErrors.coverImage = "Please upload an image file only.";
      } else if (file.size > MAX_FILE_SIZE) {
        newErrors.coverImage = `File size exceeds 5MB limit. Please choose a smaller image.`;
      } else {
        delete newErrors.coverImage;
        setFormData((prev) => ({ ...prev, coverImage: file }));
      }
      
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Group name is required.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true });
      return;
    }

    // Handle group creation
    alert("Group created successfully! (Placeholder)");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/groups" className={styles.backButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className={styles.title}>Create Group</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <label className={styles.label}>
              Group Name *
              <span className={styles.requiredIndicator}></span>
            </label>
            <input
              type="text"
              name="name"
              className={`${styles.input} ${
                touched.name && errors.name ? styles.inputError : ""
              }`}
              placeholder="Enter group name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={MAX_NAME_LENGTH}
              required
            />
            {touched.name && errors.name && (
              <div className={styles.errorMessage}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.name}
              </div>
            )}
            <div className={styles.charCount}>
              {formData.name.length}/{MAX_NAME_LENGTH}
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              className={`${styles.textarea} ${
                touched.description && errors.description
                  ? styles.inputError
                  : ""
              }`}
              placeholder="Describe your group..."
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            {touched.description && errors.description && (
              <div className={styles.errorMessage}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.description}
              </div>
            )}
            <div className={styles.charCount}>
              {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Category *</label>
            <select
              name="category"
              className={styles.select}
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="club">Club</option>
              <option value="academic">Academic</option>
              <option value="interest">Interest</option>
              <option value="project">Project</option>
            </select>
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Group Type *</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="public"
                  checked={formData.type === "public"}
                  onChange={handleInputChange}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>Public</span>
                  <span className={styles.radioDescription}>
                    Anyone can see posts and join
                  </span>
                </div>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="private"
                  checked={formData.type === "private"}
                  onChange={handleInputChange}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>Private</span>
                  <span className={styles.radioDescription}>
                    Only members can see posts
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>
              Cover Image
              <span className={styles.optionalLabel}>(Optional)</span>
            </label>
            <div className={styles.fileUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="coverImage"
              />
              <label
                htmlFor="coverImage"
                className={`${styles.fileLabel} ${
                  errors.coverImage ? styles.fileLabelError : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {formData.coverImage
                  ? formData.coverImage.name
                  : "Upload Cover Image"}
              </label>
            </div>
            {errors.coverImage && (
              <div className={styles.errorMessage}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.coverImage}
              </div>
            )}
            {formData.coverImage && !errors.coverImage && (
              <div className={styles.fileInfo}>
                <svg
                  className={styles.successIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                File selected: {formData.coverImage.name} (
                {(formData.coverImage.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Link href="/groups" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitButton}>
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

