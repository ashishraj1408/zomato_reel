import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../styles/saved.css";
import { X, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const VideoCard = ({ video, onUnsave }) => {
  const videoRef = useRef(null);

  return (
    <div className="saved-video-card">
      <video
        ref={videoRef}
        src={video.video}
        playsInline
        preload="metadata"
        muted
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
      />

      {/* Unsave button */}
      <button
        className="unsave-btn"
        title="Remove from saved"
        onClick={() => onUnsave(video._id)}
      >
        <X size={16} />
      </button>

      {/* Gradient overlay */}
      <div className="saved-overlay">
        <div className="saved-title">{video.name}</div>
        <Bookmark size={18} className="saved-icon" />
      </div>
    </div>
  );
};

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/auth/food/save`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      // 🔥 KEY FIX: extract food from savedFoods
      const savedReels = (res.data.savedFoods || []).map((item) => ({
        ...item.food,
        isSaved: true, // force true
      }));

      setVideos(savedReels);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load saved reels");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (foodId) => {
    const prev = videos;
    setVideos(videos.filter((v) => v._id !== foodId));

    try {
      await axios.post(
        `${API_URL}/auth/food/save`,
        { foodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.error(err);
      setVideos(prev);
      setMessage("Unsave failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading saved items...
      </div>
    );
  }

  return (
    <div style={{ padding: 16, minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
        >
          Home
        </Link>
        <h2 style={{ margin: 0, fontSize: 18 }}>Saved</h2>
      </div>

      {message && (
        <div style={{ marginBottom: 12, color: "#666" }}>{message}</div>
      )}

      {videos.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 8 }}>No saved items yet.</div>
      ) : (
        <div className="ig-posts-grid">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} onUnsave={handleUnsave} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
