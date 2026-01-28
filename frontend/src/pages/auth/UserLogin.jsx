import React, { useState } from "react";
import "../../styles/theme.css";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();

  // ✅ REQUIRED STATE (this fixes the error)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Login response:", response.data);

      // ✅ SAVE TOKEN (THIS IS THE MISSING PIECE)
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
      } else {
        console.error("Token not found in login response");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-header-logo">🍕 Zomato</div>
          <h1 className="auth-header-title">Welcome Back</h1>
          <p className="auth-header-subtitle">Login to your account</p>
          <p className="text-sm font-bold bg-black font-Calibri text-white">
            Tailwind is working 🚀
          </p>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember me */}
            <div className="switch-container">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="btn-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "var(--spacing-lg)" }}
            >
              Sign In
            </button>
          </form>

          <div className="auth-form-footer">
            <p className="auth-form-footer-text">
              Don't have an account?{" "}
              <a href="/register" className="auth-form-footer-link">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="auth-links">
          <a href="/foodpartner-login">Login as Food Partner</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
