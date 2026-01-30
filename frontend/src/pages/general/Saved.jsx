import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import '../../styles/profile.css';
import { X, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video, onUnsave }) => {
  const videoRef = useRef(null);

  const handleClick = () => {
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div className="ig-video-card">
      <video
        ref={videoRef}
        src={video.video}
        playsInline
        preload="metadata"
        muted
      />

      <button
        title="Unsave"
        onClick={() => onUnsave(video._id)}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.45)',
          border: 'none',
          padding: 8,
          borderRadius: 8,
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <X size={16} />
      </button>

      <div style={{ position: 'absolute', left: 8, bottom: 8 }}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{video.name}</div>
      </div>

      <div onClick={handleClick} style={{ position: 'absolute', bottom: 8, right: 8 }}>
        <Bookmark size={20} color="#fff" />
      </div>
    </div>
  );
};

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    setMessage('');
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      // Try dedicated saved endpoint first (may not exist on backend)
      const res = await axios.get(`${API_URL}/food/saved`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (res.data?.savedItems) {
        setVideos(res.data.savedItems);
      } else if (res.data?.foodItems) {
        setVideos(res.data.foodItems);
      } else {
        setVideos(res.data);
      }
    } catch (err) {
      // If endpoint not available, fallback to fetching all food and inform the user
      if (err?.response?.status === 404) {
        setMessage('Saved endpoint not available on the server — showing all food items.');
        try {
          const res2 = await axios.get(`${API_URL}/food`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          });
          setVideos(res2.data?.foodItems || []);
        } catch (err2) {
          console.error(err2);
          setMessage('Unable to fetch items.');
        }
      } else if (err?.response?.status === 401) {
        setMessage('Please login to view saved items.');
      } else {
        console.error(err);
        setMessage('An error occurred while fetching saved items.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (foodId) => {
    // optimistic remove
    const prev = videos;
    setVideos(videos.filter((v) => v._id !== foodId));

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(
        `${API_URL}/food/save`,
        { foodId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      );
      // server toggles save state; we already removed from UI
    } catch (err) {
      console.error('Unsave failed', err);
      setVideos(prev);
      setMessage('Unsave failed. Try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading saved items...
      </div>
    );
  }

  return (
    <div style={{ padding: 16, minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>Home</Link>
        <h2 style={{ margin: 0, fontSize: 18 }}>Saved</h2>
      </div>

      {message && (
        <div style={{ marginBottom: 12, color: '#666' }}>{message}</div>
      )}

      {videos.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 8, background: 'var(--surface-color)', color: 'var(--text-secondary)' }}>
          No saved items yet.
        </div>
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