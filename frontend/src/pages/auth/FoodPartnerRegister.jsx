import React, { useState } from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';

const FoodPartnerRegister = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerFirstName: '',
    ownerLastName: '',
    email: '',
    phone: '',
    restaurantType: '',
    address: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log('Food Partner Registration attempt:', formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-header-logo">🏪 Zomato Partner</div>
          <h1 className="auth-header-title">Register Your Restaurant</h1>
          <p className="auth-header-subtitle">Start selling on Zomato today</p>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="ownerFirstName" className="form-label">
                  Owner First Name
                </label>
                <input
                  type="text"
                  id="ownerFirstName"
                  name="ownerFirstName"
                  className="form-input"
                  placeholder="First name"
                  value={formData.ownerFirstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerLastName" className="form-label">
                  Owner Last Name
                </label>
                <input
                  type="text"
                  id="ownerLastName"
                  name="ownerLastName"
                  className="form-input"
                  placeholder="Last name"
                  value={formData.ownerLastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="restaurantName" className="form-label">
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                className="form-input"
                placeholder="Enter your restaurant name"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="restaurantType" className="form-label">
                Cuisine Type
              </label>
              <select
                id="restaurantType"
                name="restaurantType"
                className="form-select"
                value={formData.restaurantType}
                onChange={handleChange}
                required
              >
                <option value="">Select cuisine type</option>
                <option value="italian">Italian</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
                <option value="mexican">Mexican</option>
                <option value="fast-food">Fast Food</option>
                <option value="fusion">Fusion</option>
                <option value="bakery">Bakery</option>
                <option value="desserts">Desserts</option>
              </select>
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
                placeholder="Enter your business email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="Enter your business phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Restaurant Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                placeholder="Street address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="form-input"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className="form-checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the Partner Terms & Conditions and Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
              Register Restaurant
            </button>
          </form>

          <div className="auth-form-footer">
            <p className="auth-form-footer-text">
              Already registered?{' '}
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
