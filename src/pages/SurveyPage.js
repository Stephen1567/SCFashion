// SurveyPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SurveyPage.css'; // Import the dedicated CSS for the survey page
import '../styles/SharedHeader.css'; // For consistent header styling
import '../styles/SharedFooter.css'; // For consistent header styling

export default function SurveyPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    overallExperience: '',
    easeOfNavigation: '',
    productQuality: '',
    likelihoodToRecommend: '',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this feedback to a backend server.
    // For this assignment, we'll just log it and show a confirmation message.
    console.log('Survey Feedback:', feedback);
    setSubmitted(true);
    // Optionally, you could redirect to the home or shop page after a short delay
    // setTimeout(() => navigate('/'), 3000);
  };

  // Dummy data for header totalCartItems (if not passed via context/props)
  // In a full app, this would come from a global state or context
  const totalCartItems = 0; // Assuming 0 as cart is cleared after purchase

  return (
    <>
      {/* Header (Copied for consistency, ideally a shared component) */}
      {/* NEW: Top Sale Banner */}
      <div className="top-sale-banner">
      ️‍🔥Summer Sale 15% Off with code SM15!️‍🔥
      </div>
      <header className="home-header">
        <div className="logo-area">
          <div className="logo-icon">
            <img id="logo" src="/images/logo.png" alt="StyleNest Logo" />
          </div>
        </div>
        <nav className="main-nav">
          <Link to="/">HOME</Link>
          <Link to="/shop">SHOP</Link>
          <Link to="/shop?sale=On%20Sale">SALE</Link>
          <Link to="/survey">SURVEY</Link>
        </nav>
        <div className="header-buttons">
          {/* Search button placeholder - functionality not needed on survey page but kept for consistency */}
          <button
            className="icon-btn"
            onClick={() => console.log('Search toggled from SurveyPage')} // No actual search bar on this page
            aria-label="Toggle Search"
          >
            <img id="search" src="/images/search.png" alt="Search" />
          </button>
          <Link to="/cart" className="icon-btn cart-btn-link">
            <img id="cart" src="/images/cart.png" alt="Cart" />
            {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          </Link>
        </div>
      </header>

      <div className="survey-container">
        {!submitted ? (
          <>
            <h2>Want to tell us how we did?</h2>
            <p className="survey-intro">Your feedback helps us make StyleNest even better for you!</p>
            <form onSubmit={handleSubmit} className="survey-form">
              <div className="form-group">
                <label htmlFor="overallExperience">How would you rate your overall shopping experience today?</label>
                <select
                  id="overallExperience"
                  name="overallExperience"
                  value={feedback.overallExperience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="easeOfNavigation">How easy was it to find what you were looking for?</label>
                <select
                  id="easeOfNavigation"
                  name="easeOfNavigation"
                  value={feedback.easeOfNavigation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Very Easy">Very Easy</option>
                  <option value="Easy">Easy</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Difficult">Difficult</option>
                  <option value="Very Difficult">Very Difficult</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="productQuality">How satisfied are you with the quality of our products?</label>
                <select
                  id="productQuality"
                  name="productQuality"
                  value={feedback.productQuality}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Very Satisfied">Very Satisfied</option>
                  <option value="Satisfied">Satisfied</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Dissatisfied">Dissatisfied</option>
                  <option value="Very Dissatisfied">Very Dissatisfied</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="likelihoodToRecommend">How likely are you to recommend StyleNest to a friend?</label>
                <select
                  id="likelihoodToRecommend"
                  name="likelihoodToRecommend"
                  value={feedback.likelihoodToRecommend}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Extremely Likely">Extremely Likely</option>
                  <option value="Likely">Likely</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Unlikely">Unlikely</option>
                  <option value="Extremely Unlikely">Extremely Unlikely</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comments">Any other thoughts or suggestions? (Optional)</label>
                <textarea
                  id="comments"
                  name="comments"
                  rows="4"
                  value={feedback.comments}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-survey-btn">Share Your Feedback!</button>
            </form>
          </>
        ) : (
          <div className="survey-confirmation">
            <h3>Thank you for your valuable feedback!</h3>
            <p>We truly appreciate you taking the time to help us improve.</p>
            <Link to="/" className="back-to-home-btn">Back to Home</Link>
            <Link to="/shop" className="continue-shopping-btn">Continue Shopping</Link>
          </div>
        )}
      </div>
    </>
  );
}
