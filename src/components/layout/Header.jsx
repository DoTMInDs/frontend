import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Config';
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-2 px-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Brand/Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600">🌱</span>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Farm-Connect</span>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Nav links */}
        <nav className={`flex-col md:flex-row md:flex items-center gap-4 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent shadow md:shadow-none transition-all duration-200 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded">Home</Link>
          {user && (
            <Link to="/product" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded">My Products</Link>
          )}
          <Link to="/shop" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded">Shop</Link>
        </nav>
        {/* User actions */}
        <div className="flex items-center gap-2 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
                aria-label="User menu"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full ring-2 ring-green-500" />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-bold ring-2 ring-green-500">
                    {user.displayName ? user.displayName[0] : user.email[0]}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-semibold border-b border-gray-200 dark:border-gray-700">
                    {user.displayName || user.email}
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900 flex items-center gap-2"
            >
              <FiLogIn className="text-lg" /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;