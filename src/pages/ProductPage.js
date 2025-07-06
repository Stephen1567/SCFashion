import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import '../styles/SharedHeader.css'; // Make sure this path is correct
import { allProducts } from '../data/product.js';

export default function ProductPage({ cartItems, setCartItems }) {
  const { productId } = useParams();
  const product = allProducts.find(p => p.id === Number(productId));
  const [selectedSize, setSelectedSize] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setCartMessage('Please select a size.');
      return;
    }
  
    const newItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      size: selectedSize,
      // CRUCIAL CHANGE: Set the 'price' in the cart item to the salePrice if available, otherwise the original price.
      price: parseFloat((product.salePrice || product.price).replace('$', '')),
      // NEW: Store the original price separately for display in the cart if it's a sale item.
      displayOriginalPrice: product.salePrice ? parseFloat(product.price.replace('$', '')) : undefined,
      quantity: 1,
    };
  
    // Check if item with same ID and size already exists in cart
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === newItem.id && item.size === newItem.size);
      if (existingItemIndex > -1) {
        // If it exists, update quantity
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Otherwise, add as new item
        return [...prev, newItem];
      }
    });
    setCartMessage('✅ Added to cart!');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearch(false);
        setSearchQuery('');
      }
    }
  };

  // Calculate total items for the header cart count
  const totalCartItems = cartItems ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;

  return (
    <> {/* Use a React Fragment as the top-level element */}
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
          <Link to="/cart" className="icon-btn cart-btn-link">
            <img id="cart" src="/images/cart.png" alt="Cart" />
            {totalCartItems > 0 && <span className="cart-item-count">{totalCartItems}</span>}
          </Link>
        </div>
      </header>

      <div className={`search-bar ${showSearch ? 'open' : ''}`}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          autoFocus={showSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
        <button className="icon-btn search-close-btn" onClick={() => setShowSearch(false)} aria-label="Close Search">✕</button>
        <button className="btn-primary search-btn" onClick={handleSearch}>Search</button>
      </div>
      
      <div className="home-root">
        <div className="product-detail">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            {/* MODIFIED: Display original price and sale price if available */}
            {product.salePrice ? (
              <p className="item-price">
                <span className="original-price-detail">${parseFloat(product.price.replace('$', '')).toFixed(2)}</span>
                <span className="sale-price-detail">${parseFloat(product.salePrice.replace('$', '')).toFixed(2)}</span>
              </p>
            ) : (
              <p className="item-price">{product.price}</p>
            )}

            <h4>Size</h4>
            <div className="size-options">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            {cartMessage && <p className="cart-message">{cartMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
