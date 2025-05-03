import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faEnvelope, 
  faSearch, 
  faUserCircle,
  faCog,
  faMoon,
  faSun,
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import useShopStore from "../../store/shop-store.jsx";
import { useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);
  const user = useShopStore((state) => state.user);
  const logout = useShopStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 h-16 px-6 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm`}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mr-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search dashboard..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-all duration-200`}
        />
      </form>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200`}
          aria-label="Toggle dark mode"
        >
          <FontAwesomeIcon 
            icon={darkMode ? faSun : faMoon} 
            className="text-gray-600 dark:text-yellow-300 text-lg" 
          />
        </button>

        {/* Notifications */}
        <button className="p-2 relative rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <FontAwesomeIcon 
            icon={faBell} 
            className="text-gray-600 dark:text-gray-300 text-lg" 
          />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Messages */}
        <button className="p-2 relative rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <FontAwesomeIcon 
            icon={faEnvelope} 
            className="text-gray-600 dark:text-gray-300 text-lg" 
          />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
        </button>

        {/* Settings */}
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          onClick={() => navigate('/admin/settings')}
        >
          <FontAwesomeIcon 
            icon={faCog} 
            className="text-gray-600 dark:text-gray-300 text-lg" 
          />
        </button>

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button 
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
              </div>
            )}
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || 'Admin'}
              </span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`ml-1 text-xs text-gray-500 dark:text-gray-400 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}
              />
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => navigate('/admin/profile')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  Your Profile
                </button>
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default HeaderAdmin;