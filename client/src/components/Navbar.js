import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h1>🏠 OneRoom</h1>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/my-tasks">My Tasks</Link>
        <span style={{ color: '#667eea' }}>👤 {user.name}</span>
        <button className="btn btn-secondary btn-small" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
