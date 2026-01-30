import React, { useRef, useState } from "react";
import "../../styles/createfood.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null); // { file, preview }
  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ---------- helpers ---------- */

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getVideoDuration = (file) =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.src = url;

      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(vid.duration);
      };

      vid.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
    });

  /* ---------- file handlers ---------- */

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    // cleanup previous preview
    if (videoFile?.preview) {
      URL.revokeObjectURL(videoFile.preview);
    }

    const preview = URL.createObjectURL(file);
    const duration = await getVideoDuration(file);

    setVideoFile({ file, preview });
    setFileMeta({
      name: file.name,
      size: file.size,
      duration,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);

    // 🔥 critical: allow selecting same file again
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeFile = () => {
    if (videoFile?.preview) {
      URL.revokeObjectURL(videoFile.preview);
    }

    setVideoFile(null);
    setFileMeta(null);

    // 🔥 reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  /* ---------- submit ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !tagName.trim()) {
      console.log("❌ Missing video or name");
      return;
    }

    setUploading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const formData = new FormData();
      formData.append("video", videoFile.file);
      formData.append("name", tagName);
      formData.append("description", tagDescription);

      console.log("📤 Uploading:");
      for (let p of formData.entries()) {
        console.log(p[0], p[1]);
      }

      const response = await axios.post(
        `${API_URL}/food`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Upload success:", response.data);
      navigate("/");

      removeFile();
      setTagName("");
      setTagDescription("");
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response?.data || error.message
      );
    } finally {
      setUploading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="cf-container">
      <div className="cf-card">
        <div className="cf-header">
          <div>
            <h2 className="cf-title">Create Food Reel</h2>
            <div className="cf-subtitle">
              Add a short, tasty video with a tag and description.
            </div>
          </div>
        </div>

        <form
          className="cf-form"
          onSubmit={handleSubmit}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="cf-left">
            <div className="cf-field">
              <label className="cf-label">Video</label>

              <div
                className={`cf-dropzone ${isDragging ? "dragover" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {videoFile ? (
                  <div className="cf-file-info">
                    <strong>{fileMeta?.name}</strong>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 36 }}>🎬</div>
                    <div style={{ fontWeight: 600 }}>
                      Drop video here or click to choose
                    </div>
                    <div className="cf-note">
                      Preferred: MP4, WEBM. Max 60s
                    </div>
                    <button type="button" className="cf-file-btn">
                      Choose file
                    </button>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  className="cf-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>

              {videoFile && (
                <div className="cf-file-meta-row">
                  <div className="cf-file-meta">
                    <span><b>{fileMeta?.name}</b></span>
                    <span>•</span>
                    <span>{formatBytes(fileMeta?.size)}</span>
                    {fileMeta?.duration && (
                      <>
                        <span>•</span>
                        <span>{Math.round(fileMeta.duration)}s</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="cf-btn secondary"
                    onClick={removeFile}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="cf-field">
              <label className="cf-label">Tag Name</label>
              <input
                className="cf-input"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. spicy-burger"
                required
              />
            </div>

            <div className="cf-field">
              <label className="cf-label">Tag Description</label>
              <textarea
                className="cf-textarea"
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                placeholder="Short description or caption"
              />
            </div>

            <div className="cf-actions">
              <button
                type="button"
                className="cf-btn secondary"
                onClick={() => {
                  removeFile();
                  setTagName("");
                  setTagDescription("");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cf-btn primary"
                disabled={!videoFile || !tagName.trim() || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div className="cf-right">
            <div className="cf-field">
              <label className="cf-label">Preview</label>
              <div className="cf-preview">
                {videoFile ? (
                  <video
                    ref={videoRef}
                    src={videoFile.preview}
                    controls
                    playsInline
                  />
                ) : (
                  <div className="cf-note">No video selected</div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
