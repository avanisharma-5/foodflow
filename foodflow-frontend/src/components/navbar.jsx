import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">FoodFlow</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;