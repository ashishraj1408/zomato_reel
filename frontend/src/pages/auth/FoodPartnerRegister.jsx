import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// global styles
import "../../styles/theme.css";
import "../../styles/auth.css";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/food-partner/register",
        payload,
        { withCredentials: true }
      );

      console.log("Registration success:", response.data);
      navigate("/create-food");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* HEADER */}
        <div className="auth-header">
          <div className="auth-header-logo">🏪 Zomato Partner</div>
          <h1 className="auth-header-title">Register Your Restaurant</h1>
          <p className="auth-header-subtitle">
            Start selling on Zomato today
          </p>
        </div>

        {/* FORM */}
        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>

            {/* Restaurant Name */}
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter restaurant name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contact Name */}
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input
                type="text"
                name="contactName"
                className="form-input"
                placeholder="Enter contact person name"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter business email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="form-helper-text">
                Minimum 8 characters required
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Restaurant Address</label>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter full restaurant address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "var(--spacing-lg)" }}
            >
              Register Restaurant
            </button>
          </form>

          {/* Footer */}
          <div className="auth-form-footer">
            <p className="auth-form-footer-text">
              Already registered?{" "}
              <a href="/foodpartner-login" className="auth-form-footer-link">
                Sign in
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

export default FoodPartnerRegister;
