// Home.js
import React, { useState } from 'react';
import './Home.css'; // Keep Home.css for Home-specific styles
import '../styles/SharedHeader.css'; // Make sure this path is correct for your SharedHeader.css
import { Link, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/product.js'; // <--- Assuming you have this product data file
import '../styles/SharedFooter.css'; // For consistent header styling
import SharedFooter from './SharedFooter';

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleShopGender = (gender) => {
    navigate(`/shop?gender=${encodeURIComponent(gender)}`);
  };

  // Define new arrival products with their actual IDs from allProducts
  // You would typically fetch or filter these based on a 'new' flag or date
  const newArrivals = [
    { id: 6, name: 'Classic Elastic Waist Athletic Shorts', gender: ['Mens'], sizes: ['S', 'M', 'L'], category: 'Shorts', color: 'Gray', image: '/images/shorts/shorts2.webp', description: 'Simple and breathable shorts great for daily workouts.', price: '$22.99' },
    { id: 9, name: 'Italian Print Graphic Tee', gender: ['Mens', 'Womens'], sizes: ['S', 'M', 'L'], category: 'T-Shirts', color: 'Black', image: '/images/tee/tees1.webp', description: 'Unisex graphic tee with bold Italian print design.', price: '$19.99' },
    { id: 13, name: 'Vintage Washed Oversized Hoodie', gender: ['Mens'], sizes: ['S', 'M', 'L'], category: 'Hoodies', color: 'Black', image: '/images/hoodie/hoodie1.webp', description: 'Cozy oversized hoodie with a vintage washed look.', price: '$39.99' },
    { id: 17, name: 'Distressed Pocket Wide Leg Jeans', gender: ['Mens'], sizes: ['S', 'M', 'L'], category: 'Pants', color: 'Black', image: '/images/pants/pants1.webp', description: 'Trendy wide-leg jeans with distressed detailing.', price: '$42.99' },
    { id: 21, name: 'Basic Denim Jacket', gender: ['Mens'], sizes: ['S', 'M', 'L'], category: 'Jackets', color: 'Black', image: '/images/jacket/jacket1.webp', description: 'Classic black denim jacket for a timeless style.', price: '$49.99' },
    { id: 22, name: 'Zip-Up Short Jacket', gender: ['Womens'], sizes: ['S', 'M', 'L'], category: 'Jackets', color: 'Blue', image: '/images/jacket/jacket2.webp', description: 'Trendy cropped zip-up jacket with sleek design.', price: '$44.99' },
  ];


  return (
    <>
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
          <button
            className="icon-btn"
            onClick={() => setShowSearch(prev => !prev)}
            aria-label="Toggle Search"
          >
            <img id="search" src="/images/search.png" alt="Search" />
          </button>
          <Link to="/cart" className="icon-btn cart-btn">
             <img id="cart" src="/images/cart.png" alt="Cart" />
          </Link>
        </div>
      </header>

      <div className={`search-bar ${showSearch ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <input
                type="text"
                className="search-input"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={showSearch}
            />
            <button type="submit" className="icon-btn search-submit-btn" aria-label="Perform Search">
                <img id="search" src="/images/search.png" alt="Search" />
            </button>
        </form>
        <button className="icon-btn search-close-btn" onClick={() => setShowSearch(false)} aria-label="Close Search">✕</button>
      </div>

      <div className="home-root">
        <section className="hero">
          <img src="/images/hero.png" alt="Hero Banner" className="hero-image" />
          <div className="hero-content">
            <h2 className="hero-title">Style that fits your day. Clothing that fits your life.</h2>
            <p className="hero-subtitle">Discover casual everyday fashion that keeps you comfortable and confident.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => handleShopGender('Mens')}>Shop Men’s →</button>
              <button className="btn-secondary" onClick={() => handleShopGender('Womens')}>Shop Women’s →</button>
            </div>
          </div>
        </section>

        {/* Slider Row - MODIFIED TO LINK TO PRODUCT PAGES */}
        <section className="slider-row">
          <h3>Just dropped! Check out what’s new and trending in everyday fashion.</h3>
          <div className="slider">
            {newArrivals.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="slide"> {/* <--- Link to product page */}
                <img src={product.image} alt={product.name} />
                <p>{product.name}<br/>{product.price}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="testimonials">
          <h3>What Our Customers Say</h3>
          <div className="testimonial">
            <p><strong>Sarah M.</strong><br/><small>July 15, 2024</small><br/>★★★★★<br/>I’ve never worn a hoodie this soft. Everything fits perfectly. I’ll be back!</p>
          </div>
          <div className="testimonial">
            <p><strong>Mike L.</strong><br/><small>July 10, 2024</small><br/>★★★★★<br/>The quality of the jeans is amazing. They fit great and are super comfortable.</p>
          </div>
          <div className="testimonial">
            <p><strong>Emily R.</strong><br/><small>July 5, 2024</small><br/>★★★★☆<br/>Love the style and fit of the tops. The material is a bit thin, but overall happy with my purchase.</p>
          </div>
        </section>

      </div>
    </>
  );
}
