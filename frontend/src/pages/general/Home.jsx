import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/reels.css";
import {
  Sun,
  Moon,
  UploadCloud,
  User,
  Heart,
  Bookmark,
  MessageSquare,
  Share2,
  Search,
  Home as HomeIcon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  /* ---------------- fetch videos ---------------- */

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/food`, {
        headers: localStorage.getItem("userToken")
          ? { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
          : {},
        withCredentials: true,
      });

      if (response.data?.foodItems) {
        setVideos(response.data.foodItems);
      }
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- theme ---------------- */

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark-mode", theme === "dark");
    root.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ---------------- like video ---------------- */

  const likeVideo = async (video) => {
    try {
      const response = await axios.post(
        `${API_URL}/food/like`,
        { foodId: video._id },
        { withCredentials: true },
      );

      setVideos((prev) =>
        prev.map((v) =>
          v._id === video._id
            ? {
                ...v,
                likeCount: response.data.likeCount,
                isLiked: response.data.liked,
              }
            : v,
        ),
      );
    } catch (err) {
      console.error("Like failed:", err.response?.data || err.message);
    }
  };

  /* ---------------- refs ---------------- */

  const setVideoRef = (id) => (el) => {
    if (!el) videoRefs.current.delete(id);
    else videoRefs.current.set(id, el);
  };

  const saveVideo = async (video) => {
    try {
      const response = await axios.post(
        `${API_URL}/food/save`,
        { foodId: video._id },
        { withCredentials: true },
      );

      setVideos((prev) =>
        prev.map((v) =>
          v._id === video._id
            ? {
                ...v,
                isSaved: response.data.saved,
              }
            : v,
        ),
      );
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
    }
  };

  /* ---------------- loading ---------------- */

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading reels...</div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* HEADER */}
      <header className="app-header">
        <div className="left">
          <Link to="/" className="logo">
            ZomatoReel
          </Link>
        </div>

        <div className="right">
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/food-partner/create">
            <UploadCloud size={18} />
          </Link>
          <Link to="/profile">
            <User size={18} />
          </Link>
        </div>
      </header>

      {/* REELS */}
      <div className="reels-container" ref={containerRef}>
        {videos.length === 0 ? (
          <div className="h-screen w-screen flex items-center justify-center bg-black">
            <div className="text-white text-xl">No videos available</div>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="reel-item">
              <video
                ref={setVideoRef(video._id)}
                className="reel-video"
                loop
                muted
                autoPlay
                playsInline
                preload="metadata"
                src={video.video}
              />

              {/* TOP */}
              <div className="reel-top">
                <div className="reel-user">
                  <div className="avatar">
                    {(video.foodPartnerName || "S").charAt(0)}
                  </div>
                  <div className="username">
                    {video.foodPartnerName || "Store"}
                  </div>
                </div>
                <Share2 size={18} />
              </div>

              {/* ACTIONS */}
              <div className="reel-actions">
                <div className="reel-action" onClick={() => likeVideo(video)}>
                  <Heart
                    size={22}
                    color={video.isLiked ? "red" : "currentColor"}
                    fill={video.isLiked ? "red" : "none"}
                  />
                  <div className="count">{video.likeCount || 0}</div>
                </div>

                <div className="reel-action" onClick={() => saveVideo(video)}>
                  <Bookmark
                    size={22}
                    color={video.isSaved ? "#2563eb" : "currentColor"}
                    fill={video.isSaved ? "#2563eb" : "none"}
                  />
                </div>

                <div className="reel-action">
                  <MessageSquare size={22} />
                  <div className="count">{video.comments?.length || 0}</div>
                </div>
              </div>

              {/* OVERLAY */}
              <div className="reel-overlay">
                <p className="reel-description">{video.description}</p>
                <Link
                  className="reel-button"
                  to={`/food-partner/${video.foodPartner}`}
                >
                  Visit Store
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <Link to="/">
          <HomeIcon size={18} />
          <span>Home</span>
        </Link>
        <Link to="/search">
          <Search size={18} />
          <span>Search</span>
        </Link>
        <Link to="/food-partner/create" className="reel-center">
          <UploadCloud size={22} />
        </Link>
        <Link to="/saved">
          <Bookmark size={18} />
          <span>Saved</span>
        </Link>
        <Link to="/profile">
          <User size={18} />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
};

export default Home;
