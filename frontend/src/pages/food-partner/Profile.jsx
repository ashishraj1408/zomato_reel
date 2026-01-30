import React, { useEffect, useRef, useState } from "react";
import "../../styles/profile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

/* VIDEO CARD */
const VideoCard = ({ video, activeVideo, setActiveVideo }) => {
  const videoRef = useRef(null);

  const handleClick = () => {
    // pause previously playing video
    if (activeVideo && activeVideo !== videoRef.current) {
      activeVideo.pause();
    }

    videoRef.current.muted = false;
    videoRef.current.play();
    setActiveVideo(videoRef.current);
  };

  return (
    <div className="ig-video-card" onClick={handleClick}>
      <video
        ref={videoRef}
        src={video.video}
        playsInline
        preload="metadata"
      />
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(
        `${API_URL}/food-partner/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      setProfile(res.data.foodPartner);
      setVideos(res.data.foodPartner.foodItems || []);
    };

    fetchProfile();
  }, [id]);

  if (!profile) return null;

  return (
    <div className="ig-profile-container">
      {/* PROFILE HEADER */}
      <div className="ig-profile-header">
        <div className="ig-avatar">
          {profile.name.charAt(0)}
        </div>

        <div className="ig-profile-info">
          <h2>{profile.name}</h2>

          <div className="ig-stats">
            <span><b>{videos.length}</b> posts</span>
            <span><b>2.4k</b> followers</span>
            <span><b>1.1k</b> following</span>
          </div>

          <p className="ig-bio">
            {profile.address || "Best food in town 🍔🔥"}
          </p>

          <div className="ig-actions">
            <button className="ig-btn primary">Follow</button>
            <button className="ig-btn secondary">Contact</button>
          </div>
        </div>
      </div>

      {/* VIDEOS GRID */}
      <div className="ig-posts-grid">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
