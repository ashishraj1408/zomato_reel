import React, { useState } from "react";
import "../../styles/theme.css";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/food-partner/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Food Partner Login response:", response.data);
      navigate("/create-food");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* HEADER */}
        <div className="auth-header">
          <div className="auth-header-logo">🏪 Zomato Partner</div>
          <h1 className="auth-header-title">Partner Login</h1>
          <p className="auth-header-subtitle">Manage your food business</p>
        </div>

        {/* FORM */}
        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
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

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: "var(--spacing-lg)" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-form-footer">
            <p className="auth-form-footer-text">
              New to Zomato Partner?{" "}
              <a
                href="/foodpartner-register"
                className="auth-form-footer-link"
              >
                Register here
              </a>
            </p>
          </div>
        </div>

        <div className="auth-links">
          <a href="/login">Login as Customer</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
