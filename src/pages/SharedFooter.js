// SharedFooter.js
import React, { useState } from 'react';
import '../styles/SharedFooter.css';

export default function SharedFooter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear messages when user starts typing again
    if (message || discountCode) {
      setMessage('');
      setDiscountCode('');
    }
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubscribe = () => {
    if (validateEmail(email)) {
      setMessage('Thank you for subscribing! Here is your 10% off code:');
      setDiscountCode('OF10');
      setEmail(''); // Clear email input on success
    } else {
      setMessage('Please enter a valid email address.');
      setDiscountCode('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <h2>Get 10% Off Your First Order</h2>
        <p>No spam, we promise.</p>
        <div className="email-signup">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
        {message && (
          <div className="signup-message">
            <p>{message}</p>
            {discountCode && <p className="discount-code"><strong>{discountCode}</strong></p>}
          </div>
        )}
      </div>
      {/* Assuming you want footer-links if they were part of your original footer */}
      {/* <div className="footer-links">
        <a href="#">About Us</a>
        <a href="#">Contact</a>
        <a href="#">Returns</a>
        <a href="#">Privacy Policy</a>
      </div> */}
      <div className="footer-bottom">
        <p>&copy; 2024 SC Fashion. All rights reserved.</p>
      </div>
    </footer>
  );
}
