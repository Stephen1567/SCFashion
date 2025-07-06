import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SurveyPage from './pages/SurveyPage';
import SharedFooter from './pages/SharedFooter';

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductPage cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route
          path="/cart"
          element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/survey" element={<SurveyPage />} /> {/* <--- NEW: Add route for SurveyPage */}
      </Routes>
      <SharedFooter />
    </Router>
  );
}

export default App;
