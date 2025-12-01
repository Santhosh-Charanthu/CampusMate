"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./create-post.module.css";

export default function CreatePostPage() {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [category, setCategory] = useState("post");
  const fileInputRef = useRef(null);

  const MAX_CAPTION_LENGTH = 2200;

  const handleFileSelect = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file.");
      return;
    }

    setIsLoading(true);
    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        setMediaPreview(e.target.result);
        setIsLoading(false);
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
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
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCaptionChange = (e) => {
    if (e.target.value.length <= MAX_CAPTION_LENGTH) {
      setCaption(e.target.value);
    }
  };

  const handlePublish = () => {
    // Placeholder for API call
    alert("Post published successfully! (Placeholder)");
  };

  const isPublishDisabled = !mediaFile || caption.trim() === "";

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
            Back
          </Link>
          <h1 className={styles.headerTitle}>Create Post</h1>
          <div className={styles.headerSpacer}></div>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <label className={styles.sectionLabel}>Upload Media</label>

            {!mediaPreview ? (
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
                  onChange={handleInputChange}
                  className={styles.hiddenInput}
                />
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <div className={styles.previewWrapper}>
                  {mediaType === "video" ? (
                    <video
                      src={mediaPreview}
                      className={styles.previewMedia}
                      controls
                    />
                  ) : (
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className={styles.previewMedia}
                    />
                  )}
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleRemoveMedia}
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
                </div>
              </div>
            )}
          </div>

          {/* Caption Section */}
          <div className={styles.captionSection}>
            <label className={styles.sectionLabel}>Caption</label>
            <textarea
              className={styles.captionTextarea}
              placeholder="Write a caption..."
              value={caption}
              onChange={handleCaptionChange}
            />
            <p className={styles.charCount}>
              {caption.length}/{MAX_CAPTION_LENGTH}
            </p>
          </div>

          {/* Tags Section */}
          <div className={styles.tagsSection}>
            <label className={styles.sectionLabel}>Tags (optional)</label>
            <input
              type="text"
              className={styles.tagInput}
              placeholder="#hashtags or @mention friends"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Category Toggle */}
          <div className={styles.categoryToggle}>
            <button
              type="button"
              className={`${styles.categoryButton} ${
                category === "post" ? styles.categoryButtonActive : ""
              }`}
              onClick={() => setCategory("post")}
            >
              Post
            </button>
            <button
              type="button"
              className={`${styles.categoryButton} ${
                category === "reel" ? styles.categoryButtonActive : ""
              }`}
              onClick={() => setCategory("reel")}
            >
              Reel
            </button>
            <button
              type="button"
              className={`${styles.categoryButton} ${
                category === "short" ? styles.categoryButtonActive : ""
              }`}
              onClick={() => setCategory("short")}
            >
              Short Video
            </button>
          </div>

          {/* Controls Row */}
          <div className={styles.controlsRow}>
            <div className={styles.selectWrapper}>
              <label className={styles.selectLabel}>Visibility</label>
              <select
                className={styles.select}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="followers">Followers Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Link href="/profile" className={styles.cancelButton}>
              Cancel
            </Link>
            <button
              type="button"
              className={styles.publishButton}
              disabled={isPublishDisabled}
              onClick={handlePublish}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
