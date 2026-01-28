import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/reels.css";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/api/v1/food", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      console.log("Full API response:", response.data);

      if (response.data?.foodItems) {
        console.log("Total videos:", response.data.foodItems.length); // 👈 COUNT
        setVideos(response.data.foodItems);
      }
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id);
    } else {
      videoRefs.current.set(id, el);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading reels...</div>
      </div>
    );
  }

  return (
    <div className="reels-container" ref={containerRef}>
      {videos.length === 0 ? (
        <div className="h-screen w-screen flex items-center justify-center bg-black">
          <div className="text-white text-xl">No videos available</div>
        </div>
      ) : (
        videos.map((video, index) => (
          <div key={video._id} className="reel-item">
            <video
              ref={setVideoRef(video._id)}
              className="reel-video"
              loop
              muted
              autoPlay
              playsInline
              preload="metadata"
            >
              <source src={video.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay */}
            <div className="reel-overlay">
              <div className="reel-content">
                <p className="reel-description" title={video.description}>
                  {video.description}
                </p>

                <Link
                  className="reel-button"
                  to={`/food-partner/${video.foodPartner}`}
                  aria-label="Visit store"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
