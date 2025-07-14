import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { FaRegUserCircle, FaRegSave } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { IoIosLogOut, IoIosArrowDropdown } from 'react-icons/io';

const Nav = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check login status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setDropdownOpen(false);
    navigate('/Signin');
  };

  // Handle save action (customize as needed)
  const handleSave = () => {
    navigate('/MySelfItems');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-500 tracking-wider">
          Go<span className="text-black">Out</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
          <Link to="/Destinations" className="hover:text-yellow-500 transition">Destinations</Link>
          <Link to="/Item" className="hover:text-yellow-500 transition">Items</Link>
          <Link to="/packages" className="hover:text-yellow-500 transition">Packages</Link>
          <Link to="/bookings" className="hover:text-yellow-500 transition">Bookings</Link>
          <Link to="/TravelGuides" className="hover:text-yellow-500 transition">Blog</Link>
          <Link to="/HotelList" className="hover:text-yellow-500 transition">Hotel</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center px-4 py-2">

          {/* POST YOUR ITEM */}
          {isLoggedIn ? (
            <div className="hidden md:block">
              <button
                onClick={() => navigate('/AddItem')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition shadow-md"
              >
                POST YOUR ITEM
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition shadow-md"
              >
                POST YOUR ITEM
              </button>
            </div>
          )}

          {/* User Section */}
          <div className="text-gray-700 text-l font-bold flex items-center space-x-4 mx-5 relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <span className="text-emerald-600 font-semibold cursor-default select-none">👋 {username}</span>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-red-500 hover:text-red-700 transition underline focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <IoIosArrowDropdown size={20} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-8 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      <IoIosLogOut className="mr-2" /> Logout
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaRegSave className="mr-2" /> My Items
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/Signin" className="text-2xl hover:text-emerald-600 transition">
                <FaRegUserCircle />
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-2xl text-gray-700">
            <FiMenu />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-10">
        <div className="flex items-center w-[50rem] bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden">
          <input
            type="text"
            name="search"
            placeholder="What are you looking for?"
            className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button className="px-4 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl">
            <CiSearch />
          </button>
        </div>
      </div>
      <br /><br />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 border border-gray-100 animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-800">Join Our Community!</h3>
            <p className="mb-6 text-gray-600">
              To post your item, please become part of our growing family. It only takes a minute!
            </p>

            <div className="flex flex-col space-y-3">
              <Link
                to="/Login"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-center"
              >
                Login to Your Account
              </Link>

              <Link
                to="/Signin"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-center"
              >
                Create New Account
              </Link>

              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all border border-gray-300 hover:border-gray-400"
              >
                Maybe Later
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">By joining, you agree to our Terms and Privacy Policy</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
