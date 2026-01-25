import React, { useState } from "react";
import "../../styles/theme.css";
import "../../styles/auth.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-header-logo">🍕 Zomato</div>
          <h1 className="auth-header-title">Welcome Back</h1>
          <p className="auth-header-subtitle">Login to your account</p>
          <p className="text-sm font-bold bg-black font-Calibri text-white">
            Tailwind is working as🚀
          </p>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
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
