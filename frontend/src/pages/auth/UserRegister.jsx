import React, { useState } from "react";
import "../../styles/theme.css";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await axios.post(
      `${API_URL}/auth/user/register`,
      {
        fullName: firstName + " " + lastName,
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    console.log(response.data);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-header-logo">🍕 Zomato</div>
          <h1 className="auth-header-title">Create Account</h1>
          <p className="auth-header-subtitle">
            Join us to order delicious food
          </p>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--spacing-md)",
              }}
            >
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="form-helper-text">
                Must be at least 8 characters long
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "var(--spacing-lg)" }}
            >
              Create Account
            </button>
          </form>

          <div className="auth-form-footer">
            <p className="auth-form-footer-text">
              Already have an account?{" "}
              <a href="/login" className="auth-form-footer-link">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
