import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const FoodItemCard = ({ video }) => (
  <div className="food-item-card">
    <div className="food-item-image">
      <video
        src={video.video}
        controls
        muted
        className="food-video"
      />
    </div>
    {video.description && (
      <div className="food-item-name">{video.description}</div>
    )}
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/food-partner/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );

  if (!profile)
    return (
      <div className="error-container">
        <div className="error-message">Profile not found</div>
      </div>
    );

  return (
    <div className="profile-page-container">
      {/* Main Card */}
      <div className="profile-card">
        {/* Header Section */}
        <div className="card-header">
          <h1 className="card-title">{profile.name}</h1>
          <p className="card-subtitle">{profile.address || "Best food in town"}</p>
        </div>

        {/* Stats Section */}
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-label">Total Users</span>
            <span className="stat-number">2.4k</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Customer Served</span>
            <span className="stat-number">12.3k</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card-contact">
          <div className="contact-row">
            <span className="contact-label">Phone:</span>
            <span className="contact-value">{profile.phone}</span>
          </div>
          <div className="contact-row">
            <span className="contact-label">Email:</span>
            <span className="contact-value">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* Food Items Section */}
      <div className="food-section">
        <h2 className="section-title">Featured Dishes</h2>
        {videos.length === 0 ? (
          <div className="empty-state">
            <p>No dishes uploaded yet</p>
          </div>
        ) : (
          <div className="food-items-grid">
            {videos.map((video) => (
              <FoodItemCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
