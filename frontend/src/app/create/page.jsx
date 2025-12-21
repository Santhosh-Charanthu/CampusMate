"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./create-post.module.css";

export default function CreatePostPage() {
  const [mediaList, setMediaList] = useState([]); // { file, preview, type }
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [category, setCategory] = useState("post");
  const [errors, setErrors] = useState({});
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

  const MAX_CAPTION_LENGTH = 2200;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images
  const MAX_MEDIA_ITEMS = 10; // max number of media items allowed

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;

    setErrors({});

    const incoming = Array.from(files).slice(0, MAX_MEDIA_ITEMS - mediaList.length);
    if (incoming.length === 0) {
      setErrors({ file: `You can upload up to ${MAX_MEDIA_ITEMS} media items.` });
      return;
    }

    const validFiles = [];
    for (const file of incoming) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        setErrors({ file: "Please upload image(s) or video(s) only." });
        continue;
      }
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        setErrors({ file: `File size exceeds ${maxSizeMB}MB limit.` });
        continue;
      }
      validFiles.push({ file, type: isVideo ? "video" : "image" });
    }

    if (validFiles.length === 0) return;

    try {
      setIsLoading(true);
      const reads = await Promise.all(validFiles.map((f) => readFileAsDataUrl(f.file)));
      const newItems = validFiles.map((f, i) => ({ file: f.file, preview: reads[i], type: f.type }));
      setMediaList((prev) => [...prev, ...newItems]);
      setActiveIndex((prev) => (prev >= 0 ? prev : 0));
      setErrors({});
    } catch (err) {
      setErrors({ file: "Error reading file(s). Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    handleFilesSelected(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFilesSelected(files);
  };
  const handleRemoveAt = (index) => {
    setMediaList((prev) => {
      const next = prev.slice();
      next.splice(index, 1);
      return next;
    });
    // adjust active index
    setActiveIndex((prev) => {
      if (mediaList.length === 1) return 0;
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
    if (fileInputRef.current && mediaList.length <= 1) fileInputRef.current.value = "";
  };

  const handleCaptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CAPTION_LENGTH) {
      setCaption(value);
      setErrors((prev) => ({ ...prev, caption: null }));
    } else {
      setErrors((prev) => ({
        ...prev,
        caption: `Caption cannot exceed ${MAX_CAPTION_LENGTH} characters.`,
      }));
    }
  };

  const handlePublish = () => {
    const newErrors = {};

    if (!mediaList || mediaList.length === 0) {
      newErrors.file = "Please upload at least one photo or video to share.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Placeholder for API call
    alert("Post published successfully! (Placeholder)");
  };

  const isPublishDisabled = !mediaList || mediaList.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/profile" className={styles.backButton}>
            <svg
              className={styles.backIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className={styles.headerTitle}>Create new post</h1>
          <button
            type="button"
            className={styles.shareButton}
            disabled={isPublishDisabled}
            onClick={handlePublish}
          >
            Share
          </button>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          {mediaList.length === 0 ? (
            /* Upload Section */
            <div className={styles.uploadSection}>
              <div
                className={`${styles.uploadArea} ${
                  isDragging ? styles.uploadAreaActive : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {isLoading ? (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Processing...</p>
                  </div>
                ) : (
                  <>
                    <svg
                      className={styles.uploadIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className={styles.uploadText}>
                      Drag and drop your photo or video
                    </p>
                    <p className={styles.uploadSubtext}>
                      or click to browse files
                    </p>
                    <button
                      type="button"
                      className={styles.uploadButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Upload File
                    </button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleInputChange}
                  className={styles.hiddenInput}
                />
                {errors.file && (
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
                    {errors.file}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Two Column Layout - Instagram Style */
            <div className={styles.twoColumnLayout}>
              {/* Left Column - Media Preview */}
              <div className={styles.mediaColumn}>
                <div className={styles.previewContainer}>
                  <div className={styles.previewWrapper}>
                    {mediaList[activeIndex] && mediaList[activeIndex].type === "video" ? (
                      <video
                        src={mediaList[activeIndex].preview}
                        className={styles.previewMedia}
                        controls
                      />
                    ) : (
                      <img
                        src={(mediaList[activeIndex] && mediaList[activeIndex].preview) || "/placeholder.svg"}
                        alt="Preview"
                        className={styles.previewMedia}
                      />
                    )}

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveAt(activeIndex)}
                    >
                      <svg
                        className={styles.removeIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    {/* Thumbnails and Add More */}
                    <div className={styles.thumbnailsBar}>
                      {mediaList.map((m, idx) => (
                        <div
                          key={idx}
                          className={`${styles.thumbnail} ${idx === activeIndex ? styles.thumbnailActive : ""}`}
                          onClick={() => setActiveIndex(idx)}
                        >
                          <img src={m.preview} alt={`thumb-${idx}`} className={styles.thumbnailImg} />
                          <button
                            type="button"
                            className={styles.thumbnailDeleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAt(idx);
                            }}
                            aria-label="Remove media"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      {mediaList.length < MAX_MEDIA_ITEMS && (
                        <button
                          type="button"
                          className={styles.addMoreButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            addMoreInputRef.current?.click();
                          }}
                          aria-label="Add more media"
                        >
                          +
                        </button>
                      )}
                      {/* hidden input for add-more (only when media area visible) */}
                      <input
                        ref={addMoreInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleInputChange}
                        className={styles.hiddenInput}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className={styles.formColumn}>
                {/* User Info */}
                <div className={styles.userInfoRow}>
                  <div className={styles.userAvatar}>
                    <img
                      src="data:image/png;base64,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"
                      alt="Profile"
                      className={styles.avatarImg}
                    />
                  </div>
                  <span className={styles.username}>sarah_mitchell</span>
                </div>

                {/* Caption Section */}
                <div className={styles.captionSection}>
                  <textarea
                    className={styles.captionTextarea}
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={handleCaptionChange}
                    rows={8}
                  />
                  <div className={styles.captionFooter}>
                    {errors.caption && (
                      <span className={styles.captionError}>
                        {errors.caption}
                      </span>
                    )}
                    <p
                      className={`${styles.charCount} ${
                        caption.length > MAX_CAPTION_LENGTH * 0.9
                          ? styles.charCountWarning
                          : ""
                      } ${
                        caption.length >= MAX_CAPTION_LENGTH
                          ? styles.charCountError
                          : ""
                      }`}
                    >
                      {caption.length}/{MAX_CAPTION_LENGTH}
                    </p>
                  </div>
                </div>

                {/* Location removed per request */}

                {/* Advanced Options */}
                <div className={styles.advancedSection}>
                  <div className={styles.advancedHeader}>
                    <span className={styles.advancedTitle}>Advanced settings</span>
                    <svg
                      className={styles.chevronIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  
                  <div className={styles.advancedContent}>
                    {/* Visibility */}
                    <div className={styles.controlItem}>
                      <div className={styles.controlLabel}>
                        <svg
                          className={styles.controlIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>Audience</span>
                      </div>
                      <select
                        className={styles.advancedSelect}
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                      >
                        <option value="public">Public</option>
                        <option value="followers">Followers Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
