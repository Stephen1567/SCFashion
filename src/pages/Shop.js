// Shop.js
import React, { useState, useEffect } from 'react';
import './Shop.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/product.js';
import '../styles/SharedHeader.css';
import '../styles/SharedFooter.css';
import SharedFooter from './SharedFooter';

const filtersConfig = {
  gender: ['Mens', 'Womens'],
  category: ['T-Shirts', 'Hoodies', 'Dresses', 'Pants', 'Skirts', 'shorts', 'Jackets'],
  size: ['S', 'M', 'L', 'XL'],
  color: ['Black', 'White', 'Gray', 'Blue', 'Purple', 'Beige', 'Brown'],
  sale: ['On Sale']
};

export default function Shop({ cartItems, setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getFiltersFromUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = { gender: [], category: [], size: [], color: [], sale: [] };

    for (const key in initialFilters) {
      const param = queryParams.get(key);
      if (param) {
        initialFilters[key] = param.split(',');
      }
    }
    return initialFilters;
  };

  const getSearchTermFromUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('search') || '';
  };

  // NEW: State for sorting option
  const getSortOptionFromUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('sort') || ''; // Default to no sorting
  };

  const [filters, setFilters] = useState(getFiltersFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(getSearchTermFromUrl);
  const [sortOption, setSortOption] = useState(getSortOptionFromUrl); // NEW: Initialize sort option

  useEffect(() => {
    setFilters(getFiltersFromUrl());
    setSearchQuery(getSearchTermFromUrl());
    setSortOption(getSortOptionFromUrl()); // NEW: Update sort option from URL
    setCurrentPage(1);
  }, [location.search]);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const values = prev[type];
      const newValues = values.includes(value)
        ? values.filter(v => v !== value)
        : [...values, value];

      const newSearchParams = new URLSearchParams(location.search);
      if (newValues.length > 0) {
        newSearchParams.set(type, newValues.join(','));
      } else {
        newSearchParams.delete(type);
      }
      navigate(`${location.pathname}?${newSearchParams.toString()}`);

      return {
        ...prev,
        [type]: newValues
      };
    });
    setCurrentPage(1);
  };

  // NEW: Handle sorting change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    const newSearchParams = new URLSearchParams(location.search);
    if (newSortOption) {
      newSearchParams.set('sort', newSortOption);
    } else {
      newSearchParams.delete('sort');
    }
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const newSearchParams = new URLSearchParams(location.search);
      if (searchQuery.trim()) {
        newSearchParams.set('search', encodeURIComponent(searchQuery.trim()));
      } else {
        newSearchParams.delete('search');
      }
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
      setShowSearch(false);
    }
  };

  // Helper to parse price (from CartPage, ensuring consistency)
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('$', ''));
    }
    return parseFloat(price);
  };

  let processedProducts = allProducts.filter(p => {
    const matchGender = filters.gender.length ? filters.gender.some(filterGender => p.gender.includes(filterGender)) : true;
    const matchCategory = filters.category.length ? filters.category.includes(p.category) : true;
    const matchSize = filters.size.length ? p.sizes.some(s => filters.size.includes(s)) : true;
    const matchColor = filters.color.length ? filters.color.includes(p.color) : true;
    const matchSearch = searchQuery ?
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) :
      true;
    const matchSale = filters.sale.includes('On Sale') ? p.salePrice !== undefined : true;

    return matchGender && matchCategory && matchSize && matchColor && matchSearch && matchSale;
  });

  // NEW: Apply sorting to processedProducts
  if (sortOption) {
    processedProducts.sort((a, b) => {
      if (sortOption === 'price-asc') {
        return parsePrice(a.salePrice || a.price) - parsePrice(b.salePrice || b.price);
      } else if (sortOption === 'price-desc') {
        return parsePrice(b.salePrice || b.price) - parsePrice(a.salePrice || a.price);
      } else if (sortOption === 'title-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'title-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0; // No change if sortOption is unknown
    });
  }

  const totalPages = Math.ceil(processedProducts.length / productsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalCartItems = cartItems ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;


  return (
    <>
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
            className="icon-btn cart-btn"
            onClick={() => setShowSearch(prev => !prev)}
            aria-label="Toggle Search"
          >
            <img id="search" src="/images/search.png" alt="Search" />
          </button>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="View Cart">
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
        <button type="submit" className="icon-btn search-submit-btn" aria-label="Perform Search">
                <img id="search" src="/images/search.png" alt="Search" />
        </button>
      </div>

      <div className="shop-container">
        <aside className="filters">
          <h3>Filters</h3>
          {Object.entries(filtersConfig).map(([type, options]) => (
            <div key={type} className="filter-group">
              <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
              {options.map(option => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={filters[type].includes(option)}
                    onChange={() => handleCheckboxChange(type, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button className="clear-filters-btn" onClick={() => {
             setFilters({ gender: [], category: [], size: [], color: [], sale: [] });
             setSortOption(''); // NEW: Clear sort option on clear all filters
             navigate(location.pathname);
          }}>Clear All Filters</button>
        </aside>

        <main className="product-grid-container">
          {/* NEW: Sorting Bar */}
          <div className="sort-bar">
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sortOption} onChange={handleSortChange}>
              <option value="">Featured</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {searchQuery && (
            <div className="search-results-info">
              <h2>Search Results for "{searchQuery}"</h2>
              <p>{processedProducts.length} items found.</p> {/* Use processedProducts for count */}
            </div>
          )}

          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                  <div className="image-wrapper">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <h4>{product.name}</h4>
                  {product.salePrice ? (
                    <p className="product-prices">
                      <span className="original-price">${parseFloat(product.price.replace('$', '')).toFixed(2)}</span>
                      <span className="sale-price">${parseFloat(product.salePrice.replace('$', '')).toFixed(2)}</span>
                    </p>
                  ) : (
                    <p>{product.price}</p>
                  )}
                </Link>
              ))
            ) : (
              <p className="no-products-message">No products found matching your criteria.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {'<'}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
