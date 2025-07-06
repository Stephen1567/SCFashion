// CartPage.js
import React, { useState } from 'react';
import './CartPage.css';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SharedHeader.css';
import '../styles/SharedFooter.css'; // For consistent header styling

// Ensure CartPage receives setCartItems as a prop from its parent (e.g., App.js)
export default function CartPage({ cartItems = [], setCartItems }) {
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [personalInfo, setPersonalInfo] = useState({ name: '', address: '', email: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderTotal, setOrderTotal] = useState(0); // State to store the total for confirmation

  // NEW: States for discount code functionality
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [currentCalculatedTotal, setCurrentCalculatedTotal] = useState(0); // Total shown in payment section
  const [originalPriceBeforeDiscount, setOriginalPriceBeforeDiscount] = useState(0); // Store original total

  const navigate = useNavigate();

  // Helper function to safely parse price
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('$', ''));
    }
    return parseFloat(price); // Already a number
  };

  // Calculate base total from cart items.
  // The 'item.price' here will be the sale price if applicable,
  // because ProductPage.js now adds it that way.
  const baseTotal = cartItems.reduce((acc, item) => acc + (parsePrice(item.price) * (item.quantity || 1)), 0);

  const handlePersonalInfoChange = e => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = e => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const proceedToPersonalInfo = () => setCheckoutStep('Personal Info');

  const proceedToPayment = () => {
    // When moving to payment, set the initial calculated total (before any discount from coupon)
    setCurrentCalculatedTotal(baseTotal);
    setOriginalPriceBeforeDiscount(baseTotal); // Store the base total as original price for coupon calculation
    setDiscountApplied(false); // Reset discount status for coupon
    setDiscountMessage(''); // Clear any previous discount messages
    setDiscountCodeInput(''); // Clear discount input
    setCheckoutStep('Payment');
  };

  const handleApplyDiscount = () => {
    let newCalculatedTotal = baseTotal; // Start with the base total from cart items

    if (discountCodeInput.toUpperCase() === 'OF10' && !discountApplied) {
      newCalculatedTotal = baseTotal * 0.90; // Apply 10% discount
      setCurrentCalculatedTotal(newCalculatedTotal);
      setDiscountApplied(true);
      setDiscountMessage('Discount "OF10" applied! You saved 10%.');
    } else if (discountCodeInput.toUpperCase() === 'SM15' && !discountApplied) {
      newCalculatedTotal = baseTotal * 0.85; // Apply 15% discount
      setCurrentCalculatedTotal(newCalculatedTotal);
      setDiscountApplied(true);
      setDiscountMessage('Discount "SM15" applied! You saved 15%.');
    } else if (discountApplied) {
      setDiscountMessage('Discount already applied.');
    } else {
      setDiscountMessage('Invalid discount code.');
    }
  };

  const placeOrder = () => {
    // Store the final calculated total (after discount, if applied) for confirmation
    setOrderTotal(currentCalculatedTotal);
    setCartItems([]); // Clear cart after order is placed
    setCheckoutStep('Confirmation');
  };

  const handleRemoveItem = (indexToRemove) => {
    setCartItems(prevItems => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateQuantity = (indexToUpdate, change) => {
    setCartItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx === indexToUpdate) {
          const newQuantity = Math.max(1, (item.quantity || 1) + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const stepNames = ['cart', 'Personal Info', 'Payment', 'Confirmation'];

  const StepIndicator = () => {
    const currentStepIndex = stepNames.indexOf(checkoutStep);

    return (
      <div className="step-indicator">
        {stepNames.map((name, i) => {
          const isActive = currentStepIndex === i;
          const isCompleted = currentStepIndex > i;

          return (
            <div
              key={name}
              className={[
                'step',
                isCompleted && 'completed',
                isActive && 'active'
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-name">{name}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
    {/* NEW: Top Sale Banner (copied from Home.js for consistency) */}
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

      <div className="cart-container">
        <h2>Your Cart &amp; Checkout</h2>
        <StepIndicator />

        {checkoutStep === 'cart' && (
          <>
            {cartItems.length === 0 ? (
              <p>Your cart is empty. <Link to="/shop">Continue shopping →</Link></p>
            ) : (
              <>
                <ul className="cart-list">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Size: {item.size}</p>
                        {/* MODIFIED: Display original price and sale price if item.displayOriginalPrice exists */}
                        {item.displayOriginalPrice !== undefined ? ( // Check if displayOriginalPrice exists
                          <p className="item-price">
                            <span className="original-price-cart">${parsePrice(item.displayOriginalPrice).toFixed(2)}</span>
                            <span className="sale-price-cart">${parsePrice(item.price).toFixed(2)}</span>
                          </p>
                        ) : (
                          <p className="item-price">${parsePrice(item.price).toFixed(2)}</p>
                        )}
                        <div className="quantity-control">
                          <button className="quantity-btn" onClick={() => handleUpdateQuantity(idx, -1)}>-</button>
                          <input
                            type="text"
                            value={item.quantity || 1}
                            readOnly
                            className="quantity-input"
                          />
                          <button className="quantity-btn" onClick={() => handleUpdateQuantity(idx, 1)}>+</button>
                        </div>
                        <p className="item-total">Subtotal: ${(parsePrice(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                      <button className="remove-item-btn" onClick={() => handleRemoveItem(idx)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="cart-summary">
                  <h3>Total: ${baseTotal.toFixed(2)}</h3> {/* Display base total here */}
                  <button className="checkout-btn" onClick={proceedToPersonalInfo}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {checkoutStep === 'Personal Info' && (
          <div className="checkout-section">
            <h3>Step 2: Personal Information</h3>
            <form className="checkout-form">
              <label>
                Full Name:
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </label>
              <label>
                Shipping Address:
                <input
                  type="text"
                  name="address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </label>
              <button type="button" className="checkout-btn" onClick={proceedToPayment}>
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {checkoutStep === 'Payment' && (
          <div className="checkout-section">
            <h3>Step 3: Payment Information</h3>
            <form className="checkout-form">
              {/* Display Order Summary including Original Price and Discount */}
              <div className="order-summary-payment">
                <h4>Order Summary</h4>
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>${baseTotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <>
                    <div className="summary-line original-price-line">
                      <span>Original Price:</span>
                      <span className="strikethrough">${originalPriceBeforeDiscount.toFixed(2)}</span>
                    </div>
                    <div className="summary-line discount-amount-line">
                      <span>Discount:</span>
                      <span className="discount-value">-${(originalPriceBeforeDiscount - currentCalculatedTotal).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="summary-line total-line">
                  <span>Total:</span>
                  <span className="final-price">${currentCalculatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Code Input */}
              <div className="discount-section">
                <label htmlFor="discountCode">Discount Code:</label>
                <div className="discount-input-group">
                  <input
                    type="text"
                    id="discountCode"
                    name="discountCode"
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value)}
                    placeholder="Enter code (e.g., OF10, SM15)"
                    disabled={discountApplied} // Disable input if discount is applied
                  />
                  <button
                    type="button"
                    className="apply-discount-btn"
                    onClick={handleApplyDiscount}
                    disabled={discountApplied} // Disable button if discount is applied
                  >
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <p className={`discount-message ${discountApplied ? 'success' : 'error'}`}>
                    {discountMessage}
                  </p>
                )}
              </div>

              {/* Payment Information Inputs */}
              <label>
                Card Number:
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  required
                />
              </label>
              <label>
                Expiry Date (MM/YY):\
                <input
                  type="text"
                  name="expiry"
                  value={paymentInfo.expiry}
                  onChange={handlePaymentInfoChange}
                  required
                />
              </label>
              <label>
                CVV:
                <input
                  type="text"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentInfoChange}
                  required
                />
              </label>
              <button type="button" className="checkout-btn" onClick={placeOrder}>
                Place Order
              </button>
            </form>
          </div>
        )}

        {checkoutStep === 'Confirmation' && (
          <div className="checkout-section confirmation-section">
            <h3>Step 4: Order Confirmation!</h3>
            <p>Thank you for your purchase!</p>
            <p>Your order for items totaling <strong>${orderTotal.toFixed(2)}</strong> has been placed.</p>
            <p>We've sent a confirmation email to {personalInfo.email}.</p>
            <p className="survey-prompt">Want to tell us how we did? <Link to="/survey" className="survey-link">Help us get better!</Link></p>
            <Link to="/shop" className="checkout-btn">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
